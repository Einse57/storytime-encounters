import { checkAiRateLimit, getClientIp, ILLUSTRATE_LIMITS } from '../lib/aiRateLimit.js';

const IMAGE_MODEL = 'gemini-3.1-flash-image';

/**
 * Pull a short free_tier / paid_tier hint from Google's error payload when present.
 * @param {unknown} body
 * @returns {string | null}
 */
function extractQuotaTier(body) {
  if (!body || typeof body !== 'object') return null;
  const blob = JSON.stringify(body);
  if (/\bfree[_ ]?tier\b/i.test(blob)) return 'free_tier';
  if (/\bpaid[_ ]?tier\b/i.test(blob)) return 'paid_tier';
  return null;
}

/**
 * Build a client-facing error message from Google's generateContent error JSON.
 * @param {number} status
 * @param {unknown} body
 */
function googleErrorPayload(status, body) {
  const google =
    body && typeof body === 'object' && 'error' in body
      ? /** @type {{ error?: { message?: string, status?: string, code?: number, details?: unknown } }} */ (
          body
        ).error
      : null;
  const googleMessage =
    (google && typeof google.message === 'string' && google.message) ||
    (typeof body === 'string' && body) ||
    `Google image API returned HTTP ${status}`;
  const quotaTier = extractQuotaTier(body);
  const looksQuota =
    status === 429 ||
    /quota|rate.?limit|resource.?exhausted|billing/i.test(googleMessage) ||
    (google && typeof google.status === 'string' && /RESOURCE_EXHAUSTED/i.test(google.status));

  let error = googleMessage;
  if (looksQuota) {
    const tierNote = quotaTier ? ` (${quotaTier})` : '';
    error = `Google image quota/exhausted${tierNote}: ${googleMessage}`;
  }

  return {
    error,
    code: looksQuota ? 'GOOGLE_QUOTA' : 'GOOGLE_API_ERROR',
    model: IMAGE_MODEL,
    googleStatus: status,
    googleStatusName: google?.status || null,
    quotaTier,
    google: body && typeof body === 'object' ? body : { raw: body },
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Soft app ceiling (8/day, 2/min) — distinct from Google's own quota errors.
  const limit = checkAiRateLimit(`illustrate:${getClientIp(req)}`, ILLUSTRATE_LIMITS);
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({
      error: limit.error,
      code: 'RATE_LIMIT',
      source: 'app',
      retryAfterSec: limit.retryAfterSec,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Hosted AI is not configured yet. Use Copy Prompt as a free escape hatch.',
      code: 'NOT_CONFIGURED',
    });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required', code: 'BAD_REQUEST' });
  }

  // ONE image model only — no Imagen, no fallback loop that swallows errors.
  let upstream;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error calling Gemini image API';
    return res.status(502).json({
      error: msg,
      code: 'UPSTREAM_NETWORK',
      model: IMAGE_MODEL,
    });
  }

  const rawText = await upstream.text();
  let body = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    body = { raw: rawText.slice(0, 4000) };
  }

  if (!upstream.ok) {
    const payload = googleErrorPayload(upstream.status, body);
    // Forward Google's HTTP status so the client can tell app 429 (RATE_LIMIT) from Google 403/429.
    return res.status(upstream.status).json(payload);
  }

  const parts = body?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inlineData = part.inline_data || part.inlineData;
    if (inlineData?.data) {
      const mime = inlineData.mime_type || inlineData.mimeType || 'image/png';
      return res.status(200).json({
        imageUrl: `data:${mime};base64,${inlineData.data}`,
        model: IMAGE_MODEL,
      });
    }
  }

  // Success HTTP but no image bytes — still return upstream body for debugging (not a generic 502).
  return res.status(502).json({
    error: 'Gemini returned no image bytes in the response. Try Copy Prompt.',
    code: 'NO_IMAGE_IN_RESPONSE',
    model: IMAGE_MODEL,
    googleStatus: upstream.status,
    google: body,
  });
}
