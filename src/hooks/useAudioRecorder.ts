import { useRef, useEffect, useState, useCallback } from 'react';
import { useAudioStore } from '../stores/audioStore';
import type { ISpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types/audio';

export const useAudioRecorder = () => {
  const {
    recordingState,
    recordingDuration,
    audioBlob,
    audioBlobUrl,
    transcript,
    liveInterimText,
    isLiveTranscriptionEnabled,
    geminiApiKey,
    isTranscribingWithGemini,
    geminiError,
    setRecordingState,
    setRecordingDuration,
    setAudioBlob,
    setTranscript,
    appendTranscript,
    setLiveInterimText,
    setGeminiApiKey,
    setIsTranscribingWithGemini,
    setGeminiError,
    clearAudioSession,
  } = useAudioStore();

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(16).fill(5));
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(false);

  // Native refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<ISpeechRecognition | null>(null);
  const isSpeechActiveRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechSupported(Boolean(SpeechClass));
  }, []);

  // Audio level visualizer loop
  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current || recordingState !== 'recording') {
      setAudioLevel(0);
      setWaveformBars(new Array(16).fill(5));
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const normalized = Math.min(100, Math.round((avg / 128) * 100));
    setAudioLevel(normalized);

    // Extract 16 frequency bands for visual waveform
    const step = Math.floor(dataArray.length / 16);
    const bars: number[] = [];
    for (let i = 0; i < 16; i++) {
      const val = dataArray[i * step] || 0;
      const barHeight = Math.max(8, Math.min(100, Math.round((val / 255) * 100)));
      bars.push(barHeight);
    }
    setWaveformBars(bars);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
  }, [recordingState]);

  // Handle Speech Recognition setup
  const initSpeechRecognition = useCallback(() => {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechClass || !isLiveTranscriptionEnabled) return;

    try {
      const recognition = new SpeechClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isSpeechActiveRef.current = true;
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            appendTranscript(text);
          } else {
            interimStr += text;
          }
        }
        setLiveInterimText(interimStr);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        console.warn('Speech recognition notice:', event.error);
      };

      recognition.onend = () => {
        isSpeechActiveRef.current = false;
        // Auto-restart if we are still actively recording
        if (useAudioStore.getState().recordingState === 'recording' && isLiveTranscriptionEnabled) {
          try {
            recognition.start();
          } catch {
            // Ignore start collision
          }
        }
      };

      speechRecognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to init speech recognition:', err);
    }
  }, [isLiveTranscriptionEnabled, appendTranscript, setLiveInterimText]);

  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      // Audio analysis setup
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // MediaRecorder setup
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mime = selectedMime || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob, url, mime);
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;
      setRecordingState('recording');
      setRecordingDuration(0);

      // Start duration timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(useAudioStore.getState().recordingDuration + 1);
      }, 1000);

      // Start audio level visualizer
      animationFrameRef.current = requestAnimationFrame(updateAudioLevels);

      // Start Speech Recognition
      initSpeechRecognition();
      if (speechRecognitionRef.current && !isSpeechActiveRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch {
          // Ignore if already running
        }
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure microphone permissions are granted in your browser.');
      setRecordingState('idle');
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }
    if (speechRecognitionRef.current && isSpeechActiveRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setRecordingState('paused');
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
    if (speechRecognitionRef.current && !isSpeechActiveRef.current && isLiveTranscriptionEnabled) {
      try {
        speechRecognitionRef.current.start();
      } catch {
        // Ignore
      }
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingDuration(useAudioStore.getState().recordingDuration + 1);
    }, 1000);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
    setRecordingState('recording');
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (speechRecognitionRef.current && isSpeechActiveRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }

    setRecordingState('idle');
    setLiveInterimText('');
    setAudioLevel(0);
    setWaveformBars(new Array(16).fill(5));
  };

  // Handle manual audio file upload
  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioBlob(file, url, file.type || 'audio/webm');
  };

  // Transcribe with Gemini 2.0 Flash
  const transcribeWithGemini = async () => {
    if (!audioBlob) {
      setGeminiError('Please record audio or upload an audio file first.');
      return;
    }
    if (!geminiApiKey.trim()) {
      setGeminiError('Please provide a Google Gemini API key to use AI audio transcription.');
      return;
    }

    setIsTranscribingWithGemini(true);
    setGeminiError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64Data = res.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const base64Audio = await base64Promise;
      const mimeType = audioBlob.type || 'audio/webm';

      const prompt = `You are an expert transcriber for tabletop roleplaying and storytelling sessions with kids.
Transcribe this audio recording accurately.
Format the output as a clean, engaging story narrative:
- Include dialogue with character names if discernable.
- Capture the imaginative events, actions, and excitement.
- Keep the tone friendly, adventurous, and fun.
Output only the transcribed story text.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
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
                      mime_type: mimeType.includes(';') ? mimeType.split(';')[0] : mimeType,
                      data: base64Audio,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const transcribedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (transcribedText) {
        setTranscript(transcribedText.trim());
      } else {
        throw new Error('No transcription returned by Gemini.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transcription failed.';
      console.error('Gemini transcription error:', err);
      setGeminiError(msg);
    } finally {
      setIsTranscribingWithGemini(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return {
    recordingState,
    recordingDuration,
    audioBlob,
    audioBlobUrl,
    transcript,
    liveInterimText,
    isLiveTranscriptionEnabled,
    geminiApiKey,
    isTranscribingWithGemini,
    geminiError,
    audioLevel,
    waveformBars,
    isSpeechSupported,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    handleFileUpload,
    transcribeWithGemini,
    setTranscript,
    setGeminiApiKey,
    clearAudioSession,
  };
};
