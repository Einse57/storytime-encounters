import { checkAiRateLimit, getClientIp, ILLUSTRATE_LIMITS } from '../lib/aiRateLimit.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkAiRateLimit(`illustrate:${getClientIp(req)}`, ILLUSTRATE_LIMITS);
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({
      error: limit.error,
      code: limit.code,
      retryAfterSec: limit.retryAfterSec,
    });
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
    // Fall through to Gemini image / Flash generateContent
  }

  // Prefer a native image model when available
  const imageModels = ['gemini-3.1-flash-image', 'gemini-3-pro-image', 'gemini-3.6-flash'];

  for (const model of imageModels) {
    const flashRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an image for: ${prompt}` }] }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      },
    );

    if (!flashRes.ok) {
      continue;
    }

    const data = await flashRes.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        const mime = inlineData.mime_type || inlineData.mimeType || 'image/png';
        return res.status(200).json({ imageUrl: `data:${mime};base64,${inlineData.data}` });
      }
    }
  }

  return res.status(502).json({
    error: 'Image generation completed, but no image was returned. Try Copy Prompt.',
  });
}
