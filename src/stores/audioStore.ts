import { create } from 'zustand';
import type { RecordingState } from '../types/audio';

const API_KEY_STORAGE = 'storytime-gemini-api-key';
const TRANSCRIPT_STORAGE = 'storytime-session-transcript';

interface AudioStore {
  recordingState: RecordingState;
  recordingDuration: number;
  audioBlob: Blob | null;
  audioBlobUrl: string | null;
  audioMimeType: string;
  transcript: string;
  liveInterimText: string;
  isLiveTranscriptionEnabled: boolean;
  geminiApiKey: string;
  isTranscribingWithGemini: boolean;
  geminiError: string | null;

  // Actions
  setRecordingState: (state: RecordingState) => void;
  setRecordingDuration: (duration: number) => void;
  setAudioBlob: (blob: Blob | null, url: string | null, mimeType?: string) => void;
  setTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;
  setLiveInterimText: (text: string) => void;
  toggleLiveTranscription: () => void;
  setGeminiApiKey: (key: string) => void;
  setIsTranscribingWithGemini: (isTranscribing: boolean) => void;
  setGeminiError: (error: string | null) => void;
  clearAudioSession: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  recordingState: 'idle',
  recordingDuration: 0,
  audioBlob: null,
  audioBlobUrl: null,
  audioMimeType: 'audio/webm',
  transcript: localStorage.getItem(TRANSCRIPT_STORAGE) || '',
  liveInterimText: '',
  isLiveTranscriptionEnabled: true,
  geminiApiKey: localStorage.getItem(API_KEY_STORAGE) || '',
  isTranscribingWithGemini: false,
  geminiError: null,

  setRecordingState: (recordingState) => set({ recordingState }),

  setRecordingDuration: (recordingDuration) => set({ recordingDuration }),

  setAudioBlob: (blob, url, mimeType = 'audio/webm') => {
    const prevUrl = get().audioBlobUrl;
    if (prevUrl && prevUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
    }
    set({ audioBlob: blob, audioBlobUrl: url, audioMimeType: mimeType });
  },

  setTranscript: (transcript) => {
    localStorage.setItem(TRANSCRIPT_STORAGE, transcript);
    set({ transcript });
  },

  appendTranscript: (newText) => {
    const current = get().transcript.trim();
    const cleanNew = newText.trim();
    if (!cleanNew) return;

    const updated = current ? `${current} ${cleanNew}` : cleanNew;
    localStorage.setItem(TRANSCRIPT_STORAGE, updated);
    set({ transcript: updated, liveInterimText: '' });
  },

  setLiveInterimText: (liveInterimText) => set({ liveInterimText }),

  toggleLiveTranscription: () =>
    set((state) => ({ isLiveTranscriptionEnabled: !state.isLiveTranscriptionEnabled })),

  setGeminiApiKey: (key) => {
    const cleanKey = key.trim();
    localStorage.setItem(API_KEY_STORAGE, cleanKey);
    set({ geminiApiKey: cleanKey, geminiError: null });
  },

  setIsTranscribingWithGemini: (isTranscribingWithGemini) =>
    set({ isTranscribingWithGemini }),

  setGeminiError: (geminiError) => set({ geminiError }),

  clearAudioSession: () => {
    const prevUrl = get().audioBlobUrl;
    if (prevUrl && prevUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
    }
    localStorage.removeItem(TRANSCRIPT_STORAGE);
    set({
      recordingState: 'idle',
      recordingDuration: 0,
      audioBlob: null,
      audioBlobUrl: null,
      transcript: '',
      liveInterimText: '',
      geminiError: null,
    });
  },
}));
