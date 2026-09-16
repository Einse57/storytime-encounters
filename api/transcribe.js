import { checkAiRateLimit, getClientIp, TRANSCRIBE_LIMITS } from '../lib/aiRateLimit.js';

function looksLikeMissingAudio(text) {
  const t = String(text || '').toLowerCase();
  if (!t.trim()) return true;
  return (
    /please (provide|upload|send|attach).{0,40}audio/.test(t) ||
    /no audio (was )?(provided|detected|found|included)/.test(t) ||
    /could(n't| not) (hear|find|detect|access).{0,40}(audio|speech|recording)/.test(t) ||
    /unable to (hear|transcribe|process).{0,40}(audio|speech|recording)/.test(t)
  );
}

function extractTranscript(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkAiRateLimit(`transcribe:${getClientIp(req)}`, TRANSCRIBE_LIMITS);
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
      error: 'Hosted AI is not configured yet. Edit the Story Log by hand, or use Copy Prompt for images.',
    });
  }

  const audioBase64 =
    typeof req.body?.audioBase64 === 'string' ? req.body.audioBase64.trim() : '';
  const rawMime =
    typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : 'audio/webm';
  const mimeType = rawMime.includes(';') ? rawMime.split(';')[0] : rawMime;
  const part = Number(req.body?.part) || 1;
  const partCount = Number(req.body?.partCount) || 1;

  if (!audioBase64) {
    return res.status(400).json({ error: 'audioBase64 is required' });
  }

  // Platform body limit is ~4.5MB. Reject before Gemini if the client skipped shrink.
  if (audioBase64.length > 3_400_000) {
    return res.status(413).json({
      error:
        'This recording is too long for one upload. Try a shorter take, or edit the Story Log by hand.',
      code: 'PAYLOAD_TOO_LARGE',
    });
  }

  const partNote =
    partCount > 1
      ? `This is part ${part} of ${partCount} of one continuous storytelling session. Transcribe only this part. Do not summarize other parts.`
      : '';

  const prompt = `You are an expert transcriber for tabletop roleplaying and storytelling sessions with kids.
Transcribe this audio recording accurately.
Format the output as a clean, engaging story narrative:
- Include dialogue with character names if discernable.
- Capture the imaginative events, actions, and excitement.
- Keep the tone friendly, adventurous, and fun.
Output only the transcribed story text. If the audio contains speech, never ask the user to upload a file.
${partNote}`;

  const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = 'No transcription returned by Gemini.';

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  // REST accepts snake_case; also send camelCase for newer gateways.
                  inline_data: {
                    mime_type: mimeType || 'audio/webm',
                    data: audioBase64,
                  },
                  inlineData: {
                    mimeType: mimeType || 'audio/webm',
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
      lastError = err?.error?.message || `API Error: ${response.status} ${response.statusText}`;
      // Try next model on not-found / unsupported; otherwise surface.
      if (response.status === 404 || response.status === 400) continue;
      return res.status(response.status).json({ error: lastError });
    }

    const data = await response.json();
    const transcribedText = extractTranscript(data);
    if (!transcribedText || looksLikeMissingAudio(transcribedText)) {
      lastError = 'Hosted AI did not hear speech in this recording. Try Enhance again, or edit the Story Log by hand.';
      continue;
    }

    return res.status(200).json({ transcript: transcribedText });
  }

  return res.status(502).json({ error: lastError });
}
