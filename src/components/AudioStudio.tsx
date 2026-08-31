import React, { useRef, useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { AudioWaveform } from './AudioWaveform';

export const AudioStudio: React.FC = () => {
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
    waveformBars,
    audioLevel,
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
  } = useAudioRecorder();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setIsApiKeyOpen(false);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-parchment-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎙️</span>
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              Audio Studio & Live Story Transcriber
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Record your story session live. Speech-to-text streams your words in real time, ready for picture book generation.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsApiKeyOpen(!isApiKeyOpen)}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            title="Configure Gemini API Key for AI transcription & image generation"
          >
            <span>⚙️</span>
            <span>{geminiApiKey ? 'Gemini Key Configured' : 'Add Gemini Key'}</span>
          </button>

          {(audioBlob || transcript) && recordingState === 'idle' && (
            <button
              onClick={clearAudioSession}
              className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors"
              title="Clear audio and transcript"
            >
              Clear Session
            </button>
          )}
        </div>
      </div>

      {/* Gemini API Key Collapsible Panel */}
      {isApiKeyOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-slate-800">
              🔑 Google Gemini API Key (Optional)
            </h4>
            <span className="text-xs text-slate-400">Stored safely in local browser storage</span>
          </div>
          <p className="text-xs text-slate-600">
            Real-time speech-to-text works out of the box with zero API key! Entering a Gemini key enables high-accuracy audio transcription and direct AI comic image generation in Phase 3.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your AI Studio Gemini API key (AIzaSy...)"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white font-mono"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Recording Cockpit */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Record / Pause / Stop Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            {recordingState === 'idle' ? (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span>Start Recording Session</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {recordingState === 'recording' ? (
                  <button
                    onClick={pauseRecording}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>⏸️</span>
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>▶️</span>
                    <span>Resume</span>
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>⏹️</span>
                  <span>Finish Recording</span>
                </button>

                <div className="font-mono text-xl font-bold text-amber-300 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
                  {formatTimer(recordingDuration)}
                </div>
              </div>
            )}

            {recordingState === 'idle' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold py-3 px-4 rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5"
                title="Upload audio file (.mp3, .wav, .m4a, .webm)"
              >
                <span>📁</span>
                <span>Upload Audio</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Waveform Visualizer */}
          <div className="w-full md:w-64">
            <AudioWaveform
              recordingState={recordingState}
              waveformBars={waveformBars}
              audioLevel={audioLevel}
            />
          </div>
        </div>

        {/* Live Status Sub-bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60 gap-2">
          <div className="flex items-center gap-2">
            {recordingState === 'recording' && (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live Recording Active
              </span>
            )}
            {recordingState === 'paused' && (
              <span className="text-amber-400 font-semibold">⏸️ Recording Paused</span>
            )}
            {recordingState === 'idle' && (
              <span>
                {isSpeechSupported
                  ? '🎙️ Built-in Speech Recognition Ready'
                  : '⚠️ Browser speech recognition not supported (use Chrome/Edge for real-time STT)'}
              </span>
            )}
          </div>

          {audioBlob && (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">
                ✓ Audio Captured ({(audioBlob.size / 1024).toFixed(0)} KB)
              </span>
              <button
                onClick={transcribeWithGemini}
                disabled={isTranscribingWithGemini || !geminiApiKey}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-1 px-3 rounded text-xs transition-colors flex items-center gap-1"
                title={geminiApiKey ? 'Run AI transcription with Gemini 2.0 Flash' : 'Add Gemini API Key to run AI transcription'}
              >
                <span>✨</span>
                <span>{isTranscribingWithGemini ? 'Transcribing...' : 'AI Transcribe (Gemini)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {geminiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs flex justify-between items-center">
          <span>⚠️ {geminiError}</span>
          <button onClick={() => setIsApiKeyOpen(true)} className="underline font-semibold">
            Check API Key
          </button>
        </div>
      )}

      {/* Audio Playback Bar */}
      {audioBlobUrl && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-2xl">🎧</span>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Session Audio Recording</h4>
              <p className="text-xs text-gray-500">Replay or export your oral session audio</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 justify-end">
            <audio controls src={audioBlobUrl} className="h-9 max-w-full sm:max-w-xs" />
            <a
              href={audioBlobUrl}
              download={`storytime-audio-${new Date().toISOString().slice(0, 10)}.webm`}
              className="bg-gray-800 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              ⬇️ Save Audio
            </a>
          </div>
        </div>
      )}

      {/* Live Transcript Story Pad */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-gray-800 text-lg">
              📝 Session Story Transcript
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {wordCount} words
            </span>
          </div>

          {recordingState === 'recording' && isLiveTranscriptionEnabled && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Speech-to-Text Streaming
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="As you speak during the session, your story words will appear here automatically in real time! You can also type or edit anything directly..."
            rows={7}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 font-serif leading-relaxed text-base bg-white shadow-2xs resize-y"
          />

          {liveInterimText && (
            <div className="absolute bottom-4 left-4 right-4 bg-purple-50/90 border border-purple-200 rounded-lg p-2 text-xs text-purple-900 italic font-serif pointer-events-none">
              <span className="font-bold text-purple-700">Listening: </span>
              {liveInterimText}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
