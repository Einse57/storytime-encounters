/** Keep JSON under Vercel Hobby's ~4.5MB request body (base64 expands ~4/3). */
export const MAX_UPLOAD_BYTES = 2_500_000;
export const MAX_PARTS = 24;
/** 8 kHz mono PCM stays under the upload cap for ~2.5 minutes per part. */
const WAV_SAMPLE_RATE = 8000;
const SLICE_SEC = 140;

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

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

/** Reliable PCM WAV slice — avoids MediaRecorder silent/corrupt webm re-encodes. */
function encodeWavSlice(decoded: AudioBuffer, startSec: number, durationSec: number): Blob {
  const outRate = WAV_SAMPLE_RATE;
  const start = Math.min(decoded.length, Math.floor(startSec * decoded.sampleRate));
  const end = Math.min(
    decoded.length,
    Math.floor((startSec + durationSec) * decoded.sampleRate),
  );
  const srcLen = Math.max(1, end - start);
  const outLen = Math.max(1, Math.floor(srcLen * (outRate / decoded.sampleRate)));
  const channels = decoded.numberOfChannels;
  const pcm = new Int16Array(outLen);

  for (let i = 0; i < outLen; i++) {
    const srcIndex = start + Math.floor(i * (decoded.sampleRate / outRate));
    let sum = 0;
    for (let c = 0; c < channels; c++) {
      sum += decoded.getChannelData(c)[Math.min(decoded.length - 1, srcIndex)] || 0;
    }
    const sample = Math.max(-1, Math.min(1, sum / channels));
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  const dataSize = pcm.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, outRate, true);
  view.setUint32(28, outRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < pcm.length; i++, offset += 2) {
    view.setInt16(offset, pcm[i], true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

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
    const encoded = encodeWavSlice(decoded, start, Math.min(SLICE_SEC, total - start));
    if (encoded.size > MAX_UPLOAD_BYTES) {
      throw new Error(TOO_LONG);
    }
    if (encoded.size > 1000) parts.push(encoded);
  }

  if (parts.length === 0) {
    throw new Error('Could not prepare this recording for Enhance.');
  }
  return parts;
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function transcribePart(part: Blob, index: number, partCount: number): Promise<string> {
  const audioBase64 = await blobToBase64(part);
  const mimeType = (part.type || 'audio/webm').split(';')[0];
  const body = JSON.stringify({
    audioBase64,
    mimeType,
    part: index + 1,
    partCount,
  });

  let attempt = 0;
  while (attempt < 3) {
    attempt += 1;
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const data = await response.json().catch(() => ({}));
    if (response.status === 413) {
      throw new Error(
        data?.error ||
          'This recording is too long to upload. Try a shorter take, or edit the Story Log by hand.',
      );
    }
    if (response.status === 429) {
      const waitSec = Number(data?.retryAfterSec) || Number(response.headers.get('Retry-After')) || 5;
      if (attempt >= 3) {
        throw new Error(data?.error || 'Too many Enhance requests — wait a moment and try again.');
      }
      await sleep(Math.min(60, Math.max(2, waitSec)) * 1000);
      continue;
    }
    if (!response.ok) {
      throw new Error(data?.error || `Transcription failed: ${response.status}`);
    }
    const text = data?.transcript || data?.text;
    if (!text || !String(text).trim()) {
      throw new Error(data?.error || 'Hosted AI returned no transcription. Try again later.');
    }
    return String(text).trim();
  }

  throw new Error('Hosted AI transcription failed. Try again later.');
}

/** Compress if needed, then transcribe in parts small enough for Vercel. */
export async function enhanceRecording(blob: Blob): Promise<string> {
  const parts = await prepareAudioParts(blob);
  const transcripts: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    transcripts.push(await transcribePart(parts[i], i, parts.length));
    if (i + 1 < parts.length) {
      await sleep(400);
    }
  }
  const joined = transcripts.filter(Boolean).join('\n\n');
  if (!joined) {
    throw new Error('Hosted AI returned no transcription. Try again later.');
  }
  return joined;
}
