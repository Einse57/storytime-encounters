const INTERESTS = new Set(['kids', 'tabletop', 'both']);
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/** In-memory soft rate limit (best-effort across warm instances). */
const rateBuckets = new Map();

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) {
    return xf.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.reset) {
    bucket = { count: 0, reset: now + WINDOW_MS };
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count <= MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({ error: 'Too many requests. Try again shortly.' });
  }

  const email =
    typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const interestRaw = req.body?.interest;
  const interest =
    interestRaw == null || interestRaw === ''
      ? null
      : String(interestRaw).trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (interest !== null && !INTERESTS.has(interest)) {
    return res.status(400).json({
      error: 'interest must be kids, tabletop, or both',
    });
  }

  const payload = {
    email,
    interest,
    ts: new Date().toISOString(),
  };

  console.log('[waitlist]', JSON.stringify(payload));

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('[waitlist] webhook failed', err);
      // Soft-launch: still succeed for the visitor.
    }
  }

  return res.status(200).json({ ok: true });
}
