/** Keep JSON under Vercel Hobby's ~4.5MB request body (base64 expands ~4/3). */
export const MAX_UPLOAD_BYTES = 2_500_000;
export const MAX_PARTS = 8;
const SLICE_SEC = 240;

export async function blobToBase64(blob: Blob): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the recording.'));
    reader.readAsDataURL(blob);
  });
  const comma = dataUrl.indexOf(',');
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function mixdownSlice(
  decoded: AudioBuffer,
  startSec: number,
  durationSec: number,
  ctx: AudioContext,
): AudioBuffer {
  const rate = decoded.sampleRate;
  const start = Math.min(decoded.length, Math.floor(startSec * rate));
  const end = Math.min(decoded.length, Math.floor((startSec + durationSec) * rate));
  const length = Math.max(1, end - start);
  const out = ctx.createBuffer(1, length, rate);
  const dest = out.getChannelData(0);
  const channels = decoded.numberOfChannels;
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let c = 0; c < channels; c++) {
      sum += decoded.getChannelData(c)[start + i] || 0;
    }
    dest[i] = sum / channels;
  }
  return out;
}

function encodeSlice(slice: AudioBuffer): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const dest = ctx.createMediaStreamDestination();
    const src = ctx.createBufferSource();
    const playable = mixdownSlice(slice, 0, slice.duration, ctx);
    src.buffer = playable;
    src.connect(dest);

    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(dest.stream, { mimeType: mime, audioBitsPerSecond: 20000 });
    } catch {
      rec = new MediaRecorder(dest.stream);
    }

    const parts: Blob[] = [];
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) parts.push(e.data);
    };
    rec.onerror = () => {
      ctx.close().catch(() => {});
      reject(new Error('Could not compress the recording.'));
    };
    rec.onstop = () => {
      ctx.close().catch(() => {});
      resolve(new Blob(parts, { type: rec.mimeType || 'audio/webm' }));
    };

    rec.start();
    src.onended = () => {
      window.setTimeout(() => {
        if (rec.state !== 'inactive') rec.stop();
      }, 200);
    };
    src.start();
  });
}

const TOO_LONG =
  'This recording is too long to upload as-is. Try a shorter take (about 20–30 minutes), or keep editing the Story Log by hand.';

/**
 * Shrink a long kid-session recording so /api/transcribe stays under the
 * platform body limit. Returns one or more opus/webm parts.
 */
export async function prepareAudioParts(blob: Blob): Promise<Blob[]> {
  if (blob.size <= MAX_UPLOAD_BYTES) return [blob];

  const ctx = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  } catch {
    await ctx.close().catch(() => {});
    throw new Error(TOO_LONG);
  }
  await ctx.close().catch(() => {});

  const total = decoded.duration;
  if (total > SLICE_SEC * MAX_PARTS) {
    throw new Error(TOO_LONG);
  }

  const parts: Blob[] = [];
  for (let start = 0; start < total; start += SLICE_SEC) {
    const slice = mixdownSlice(decoded, start, Math.min(SLICE_SEC, total - start), new AudioContext());
    // mixdownSlice already created a buffer on a throwaway context — encode from decoded instead
    const encoded = await encodeSlice(
      (() => {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const tmp = new Ctx();
        const buf = mixdownSlice(decoded, start, Math.min(SLICE_SEC, total - start), tmp);
        return buf;
      })(),
    );
    if (encoded.size > MAX_UPLOAD_BYTES) {
      throw new Error(TOO_LONG);
    }
    if (encoded.size > 0) parts.push(encoded);
  }

  if (parts.length === 0) {
    throw new Error('Could not prepare this recording for Enhance.');
  }
  return parts;
}
