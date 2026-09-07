export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Hosted AI is not configured yet. Edit the Story Log by hand, or use Copy Prompt for images.',
    });
  }

  const audioBase64 =
    typeof req.body?.audioBase64 === 'string' ? req.body.audioBase64.trim() : '';
  const rawMime =
    typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : 'audio/webm';
  const mimeType = rawMime.includes(';') ? rawMime.split(';')[0] : rawMime;

  if (!audioBase64) {
    return res.status(400).json({ error: 'audioBase64 is required' });
  }

  const prompt = `You are an expert transcriber for tabletop roleplaying and storytelling sessions with kids.
Transcribe this audio recording accurately.
Format the output as a clean, engaging story narrative:
- Include dialogue with character names if discernable.
- Capture the imaginative events, actions, and excitement.
- Keep the tone friendly, adventurous, and fun.
Output only the transcribed story text.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType || 'audio/webm',
                  data: audioBase64,
                },
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({
      error: err?.error?.message || `API Error: ${response.status} ${response.statusText}`,
    });
  }

  const data = await response.json();
  const transcribedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!transcribedText) {
    return res.status(502).json({ error: 'No transcription returned by Gemini.' });
  }

  return res.status(200).json({ transcript: transcribedText.trim() });
}
