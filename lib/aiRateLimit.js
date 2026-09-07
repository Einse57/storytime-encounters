/**
 * Best-effort in-memory rate limits for hosted Gemini routes.
 * Soft ceiling for ~$20/mo spend — not durable across cold starts.
 */

const buckets = new Map();

export function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) {
    return xf.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * @param {string} key - e.g. "illustrate:1.2.3.4"
 * @param {{ maxPerDay: number, maxPerMinute: number, softMessage: string }} limits
 * @returns {{ ok: true } | { ok: false, retryAfterSec: number, error: string, code: 'RATE_LIMIT' }}
 */
export function checkAiRateLimit(key, limits) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const minuteMs = 60_000;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = {
      dayCount: 0,
      dayReset: now + dayMs,
      minuteCount: 0,
      minuteReset: now + minuteMs,
    };
  }

  if (now > bucket.dayReset) {
    bucket.dayCount = 0;
    bucket.dayReset = now + dayMs;
  }
  if (now > bucket.minuteReset) {
    bucket.minuteCount = 0;
    bucket.minuteReset = now + minuteMs;
  }

  if (bucket.dayCount >= limits.maxPerDay) {
    buckets.set(key, bucket);
    return {
      ok: false,
      code: 'RATE_LIMIT',
      retryAfterSec: Math.max(1, Math.ceil((bucket.dayReset - now) / 1000)),
      error: limits.softMessage,
    };
  }

  if (bucket.minuteCount >= limits.maxPerMinute) {
    buckets.set(key, bucket);
    return {
      ok: false,
      code: 'RATE_LIMIT',
      retryAfterSec: Math.max(1, Math.ceil((bucket.minuteReset - now) / 1000)),
      error: 'A few AI requests at once — wait a moment and try again.',
    };
  }

  bucket.dayCount += 1;
  bucket.minuteCount += 1;
  buckets.set(key, bucket);
  return { ok: true };
}

export const ILLUSTRATE_LIMITS = {
  maxPerDay: 8,
  maxPerMinute: 2,
  softMessage:
    'Daily AI paints used up — try again tomorrow, or use Copy Prompt.',
};

export const TRANSCRIBE_LIMITS = {
  maxPerDay: 15,
  maxPerMinute: 3,
  softMessage:
    'Daily AI transcript boosts used up — try again tomorrow, or edit the Story Log by hand.',
};
