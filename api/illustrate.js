export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Hosted AI is not configured yet. Use Copy Prompt as a free escape hatch.',
    });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  // Prefer Imagen 3 when available for this key
  try {
    const imagenRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            outputOptions: { mimeType: 'image/jpeg' },
          },
        }),
      },
    );

    if (imagenRes.ok) {
      const data = await imagenRes.json();
      const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
      if (b64) {
        return res.status(200).json({ imageUrl: `data:image/jpeg;base64,${b64}` });
      }
    }
  } catch {
    // Fall through to Flash generateContent
  }

  const flashRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate an image for: ${prompt}` }] }],
      }),
    },
  );

  if (!flashRes.ok) {
    const err = await flashRes.json().catch(() => ({}));
    return res.status(flashRes.status).json({
      error: err?.error?.message || `Gemini API error: ${flashRes.status}`,
    });
  }

  const data = await flashRes.json();
  const part = data?.candidates?.[0]?.content?.parts?.[0] || {};
  const inlineData = part.inline_data || part.inlineData;
  if (inlineData?.data) {
    const mime = inlineData.mime_type || inlineData.mimeType || 'image/png';
    return res.status(200).json({ imageUrl: `data:${mime};base64,${inlineData.data}` });
  }

  return res.status(502).json({
    error: 'Image generation completed, but no image was returned.',
  });
}
