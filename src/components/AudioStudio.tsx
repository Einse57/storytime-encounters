import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export const AudioStudio: React.FC = () => {
  const {
    recordingState,
    recordingDuration,
    audioBlob,
    audioBlobUrl,
    transcript,
    liveInterimText,
    geminiApiKey,
    isTranscribingWithGemini,
    waveformBars,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    transcribeWithGemini,
    setTranscript,
    setGeminiApiKey,
    clearAudioSession,
  } = useAudioRecorder();

  const [showStoryLog, setShowStoryLog] = useState(true);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRecordToggle = () => {
    if (recordingState === 'idle') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    } else if (recordingState === 'paused') {
      resumeRecording();
    }
  };

  return (
    <div className="space-y-2">
      {/* Section Header without Emojis */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif font-black text-xs sm:text-sm text-gray-900 tracking-tight uppercase">
          Audio Recorder
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsApiKeyOpen(!isApiKeyOpen)}
            className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline cursor-pointer"
          >
            {geminiApiKey ? 'Key Active' : 'API Key'}
          </button>
        </div>
      </div>

      {/* API Key Modal Drawer */}
      {isApiKeyOpen && (
        <div className="bg-[#fcf7ec] border border-[#d9c49e] rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-950">Google Gemini API Key</span>
            <span className="text-[10px] text-gray-500">For AI speech & images</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AI Studio Key (AIzaSy...)"
              className="flex-1 px-3 py-1.5 border border-amber-300 rounded-lg text-xs bg-white font-mono"
            />
            <button
              onClick={() => {
                setGeminiApiKey(apiKeyInput);
                setIsApiKeyOpen(false);
              }}
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-1.5 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Capsule Pod (Slim & Proportional) */}
      <div className="bg-[#f5ebd6] border-2 border-[#d4b98b] rounded-xl p-2 shadow-xs flex items-center justify-between gap-2.5 relative overflow-hidden">
        {/* Left: Compact Embossed Golden REC Button */}
        <button
          onClick={handleRecordToggle}
          className={`btn-tactile flex-shrink-0 w-10 h-10 rounded-full rec-pod-outer flex flex-col items-center justify-center cursor-pointer select-none ${
            recordingState === 'recording' ? 'ring-3 ring-red-500/50 animate-pulse' : ''
          }`}
          title={recordingState === 'recording' ? 'Tap to finish recording' : 'Tap to start recording'}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full mb-0.2 transition-all ${
              recordingState === 'recording'
                ? 'bg-red-600 shadow-[0_0_6px_#ef4444] animate-ping'
                : 'bg-red-700 shadow-inner'
            }`}
          />
          <span className="font-serif font-black text-[9px] tracking-wider text-amber-950 uppercase leading-none">
            {recordingState === 'recording' ? 'STOP' : 'REC'}
          </span>
        </button>

        {/* Center: Golden Animated Soundwave Visualizer */}
        <div className="flex-1 flex flex-col justify-center min-w-0 px-1">
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 h-6">
            {waveformBars.map((bar, i) => {
              const height = recordingState === 'recording' ? Math.max(4, bar * 0.6) : 3 + (i % 5) * 2;
              return (
                <div
                  key={i}
                  className="w-1 sm:w-1.5 rounded-full transition-all duration-75"
                  style={{
                    height: `${height}px`,
                    backgroundColor: recordingState === 'recording' ? '#d97706' : '#c9a875',
                  }}
                />
              );
            })}
          </div>

          <div className="text-center mt-0.5">
            <span className="font-mono font-bold text-[10px] text-amber-950 uppercase tracking-wider">
              {recordingState === 'recording'
                ? `RECORDING ${formatTimer(recordingDuration)}`
                : recordingState === 'paused'
                ? 'RECORDING PAUSED'
                : audioBlob
                ? `RECORDED (${(audioBlob.size / 1024).toFixed(0)} KB)`
                : 'READY TO RECORD'}
            </span>
          </div>
        </div>

        {/* Right: Story Log Link Button */}
        <div className="flex-shrink-0 pr-1 flex flex-col items-end gap-1">
          <button
            onClick={() => setShowStoryLog(!showStoryLog)}
            className="font-serif font-bold text-xs text-amber-950 hover:text-amber-800 underline cursor-pointer select-none"
          >
            Story Log
          </button>

          {recordingState === 'recording' && (
            <button
              onClick={pauseRecording}
              className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full cursor-pointer"
            >
              Pause
            </button>
          )}

          {audioBlob && recordingState === 'idle' && (
            <button
              onClick={clearAudioSession}
              className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Audio Playback Bar if audio exists */}
      {audioBlobUrl && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-lg p-2 flex items-center justify-between gap-2">
          <audio controls src={audioBlobUrl} className="h-6 flex-1" />
          <a
            href={audioBlobUrl}
            download="storytime-recording.webm"
            className="btn-tactile bg-amber-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"
          >
            Save .webm
          </a>
        </div>
      )}

      {/* Expandable Story Log */}
      {showStoryLog && (
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken adventure streams here in real time as you tell your story... You can also type or edit anytime."
            rows={3}
            className="w-full p-2.5 border border-[#d9c49e] rounded-xl focus:ring-2 focus:ring-amber-500 text-gray-900 font-serif leading-relaxed text-xs bg-white shadow-2xs resize-y"
          />

          {liveInterimText && (
            <div className="absolute bottom-2 left-2 right-2 bg-amber-100/95 border border-amber-300 rounded-lg p-1.5 text-xs text-amber-950 italic font-serif pointer-events-none shadow-sm">
              <span className="font-bold text-amber-800 not-italic uppercase text-[9px] block">Listening:</span>
              {liveInterimText}...
            </div>
          )}

          {audioBlob && geminiApiKey && (
            <button
              onClick={transcribeWithGemini}
              disabled={isTranscribingWithGemini}
              className="btn-tactile mt-1 text-xs font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg border border-purple-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isTranscribingWithGemini ? 'Transcribing...' : 'AI Enhance Transcript (Gemini)'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
