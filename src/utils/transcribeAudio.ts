/** Keep JSON under Vercel Hobby's ~4.5MB request body (base64 expands ~4/3). */
export const MAX_UPLOAD_BYTES = 2_500_000;
export const MAX_PARTS = 8;
const SLICE_SEC = 240;

const TOO_LONG =
  'This recording is too long to upload as-is. Try a shorter take (about 20–30 minutes), or keep editing the Story Log by hand.';

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

function audioContext(): AudioContext {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx();
}

function encodeSlice(decoded: AudioBuffer, startSec: number, durationSec: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const ctx = audioContext();
    const rate = decoded.sampleRate;
    const start = Math.min(decoded.length, Math.floor(startSec * rate));
    const end = Math.min(decoded.length, Math.floor((startSec + durationSec) * rate));
    const length = Math.max(1, end - start);
    const slice = ctx.createBuffer(1, length, rate);
    const dest = slice.getChannelData(0);
    const channels = decoded.numberOfChannels;
    for (let i = 0; i < length; i++) {
      let sum = 0;
      for (let c = 0; c < channels; c++) {
        sum += decoded.getChannelData(c)[start + i] || 0;
      }
      dest[i] = sum / channels;
    }

    const node = ctx.createBufferSource();
    const stream = ctx.createMediaStreamDestination();
    node.buffer = slice;
    node.connect(stream);

    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(stream.stream, { mimeType: mime, audioBitsPerSecond: 20000 });
    } catch {
      rec = new MediaRecorder(stream.stream);
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
    node.onended = () => {
      window.setTimeout(() => {
        if (rec.state !== 'inactive') rec.stop();
      }, 200);
    };
    node.start();
  });
}

/**
 * Shrink a long kid-session recording so /api/transcribe stays under the
 * platform body limit. Returns one or more opus/webm parts.
 */
export async function prepareAudioParts(blob: Blob): Promise<Blob[]> {
  if (blob.size <= MAX_UPLOAD_BYTES) return [blob];

  const ctx = audioContext();
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
    const encoded = await encodeSlice(decoded, start, Math.min(SLICE_SEC, total - start));
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
