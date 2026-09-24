import { checkAiRateLimit, getClientIp, ILLUSTRATE_LIMITS } from '../lib/aiRateLimit.js';

/** Ordered try — stop on first successful image. No Imagen, no preview IDs. Pro last. */
const IMAGE_MODELS = [
  'gemini-3.1-flash-image', // Nano Banana 2 (primary)
  'gemini-3.1-flash-lite-image', // Lite
  'gemini-2.5-flash-image', // Nano Banana 1
  'gemini-3-pro-image', // Pro last
];

const BANANA2_PRIMARY = 'gemini-3.1-flash-image';
/** 1–2 retries on 429/503 with short exponential backoff + jitter. */
const MAX_TRANSIENT_RETRIES = 2;

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
 * @param {string} model
 */
function googleErrorPayload(status, body, model) {
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
    model,
    googleStatus: status,
    googleStatusName: google?.status || null,
    quotaTier,
    google: body && typeof body === 'object' ? body : { raw: body },
  };
}

/**
 * @param {number} attempt - 0-based retry index after a transient failure
 */
function backoffMs(attempt) {
  const base = 400 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 200);
  return base + jitter;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} prompt
 * @param {string} model
 */
function buildGenerateBody(prompt, model) {
  /** @type {Record<string, unknown>} */
  const generationConfig = {
    responseModalities: ['TEXT', 'IMAGE'],
  };
  // Banana 2 primary: minimal thinking to cut latency/timeouts when supported.
  if (model === BANANA2_PRIMARY) {
    generationConfig.thinkingConfig = { thinkingLevel: 'minimal' };
  }
  return {
    contents: [{ parts: [{ text: `Generate an image for: ${prompt}` }] }],
    generationConfig,
  };
}

/**
 * One generateContent call. Concurrency is 1 (caller sequences models + retries).
 * @param {string} apiKey
 * @param {string} model
 * @param {string} prompt
 */
async function callGenerateContent(apiKey, model, prompt) {
  let upstream;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildGenerateBody(prompt, model)),
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error calling Gemini image API';
    return {
      kind: /** @type {const} */ ('network'),
      model,
      error: msg,
    };
  }

  const rawText = await upstream.text();
  let body = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    body = { raw: rawText.slice(0, 4000) };
  }

  if (!upstream.ok) {
    return {
      kind: /** @type {const} */ ('http'),
      model,
      status: upstream.status,
      body,
      payload: googleErrorPayload(upstream.status, body, model),
    };
  }

  const parts = body?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inlineData = part.inline_data || part.inlineData;
    if (inlineData?.data) {
      const mime = inlineData.mime_type || inlineData.mimeType || 'image/png';
      return {
        kind: /** @type {const} */ ('ok'),
        model,
        imageUrl: `data:${mime};base64,${inlineData.data}`,
      };
    }
  }

  return {
    kind: /** @type {const} */ ('no_image'),
    model,
    status: upstream.status,
    body,
  };
}

/**
 * Call one model with short exponential backoff + jitter on 429/503 (1–2 retries).
 * @param {string} apiKey
 * @param {string} model
 * @param {string} prompt
 */
async function callModelWithRetries(apiKey, model, prompt) {
  /** @type {Awaited<ReturnType<typeof callGenerateContent>> | null} */
  let last = null;
  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt++) {
    last = await callGenerateContent(apiKey, model, prompt);
    if (last.kind === 'ok') return last;

    const transient =
      last.kind === 'http' && (last.status === 429 || last.status === 503);
    if (transient && attempt < MAX_TRANSIENT_RETRIES) {
      await sleep(backoffMs(attempt));
      continue;
    }
    return last;
  }
  return /** @type {NonNullable<typeof last>} */ (last);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Soft app ceiling (20/day, 2/min) — distinct from Google's own quota errors.
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

  // Ordered try, concurrency 1 — stop on first successful image.
  /** @type {Awaited<ReturnType<typeof callModelWithRetries>> | null} */
  let lastFailure = null;
  for (const model of IMAGE_MODELS) {
    const result = await callModelWithRetries(apiKey, model, prompt);
    if (result.kind === 'ok') {
      return res.status(200).json({
        imageUrl: result.imageUrl,
        model: result.model,
      });
    }
    lastFailure = result;
  }

  if (!lastFailure) {
    return res.status(502).json({
      error: 'Gemini returned no image bytes in the response. Try Copy Prompt.',
      code: 'NO_IMAGE_IN_RESPONSE',
      model: IMAGE_MODELS[0],
    });
  }

  if (lastFailure.kind === 'network') {
    return res.status(502).json({
      error: lastFailure.error,
      code: 'UPSTREAM_NETWORK',
      model: lastFailure.model,
    });
  }

  if (lastFailure.kind === 'http') {
    return res.status(lastFailure.status).json(lastFailure.payload);
  }

  // Success HTTP but no image bytes across all models.
  return res.status(502).json({
    error: 'Gemini returned no image bytes in the response. Try Copy Prompt.',
    code: 'NO_IMAGE_IN_RESPONSE',
    model: lastFailure.model,
    googleStatus: lastFailure.status,
    google: lastFailure.body,
  });
}
