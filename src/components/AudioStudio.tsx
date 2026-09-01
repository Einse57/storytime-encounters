import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useStoryStore } from '../stores/storyStore';

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

  const currentPackId = useStoryStore((s) => s.currentPackId);
  const isScifi = currentPackId === 'scifi-frontier';

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
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className={`font-serif font-black text-xs sm:text-sm tracking-tight uppercase ${
          isScifi ? 'text-white' : 'text-gray-900'
        }`}>
          Audio Recorder
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsApiKeyOpen(!isApiKeyOpen)}
            className={`text-[11px] font-bold underline cursor-pointer ${
              isScifi ? 'text-cyan-400 hover:text-cyan-200' : 'text-amber-900 hover:text-amber-700'
            }`}
          >
            {geminiApiKey ? 'Key Active' : 'API Key'}
          </button>
        </div>
      </div>

      {/* API Key Modal Drawer */}
      {isApiKeyOpen && (
        <div className={`rounded-xl p-3 space-y-2 text-xs border ${
          isScifi ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-[#fcf7ec] border-[#d9c49e] text-amber-950'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`font-bold ${isScifi ? 'text-cyan-300' : 'text-amber-950'}`}>
              Google Gemini API Key
            </span>
            <span className={`text-[10px] ${isScifi ? 'text-slate-400' : 'text-gray-500'}`}>
              For AI speech & images
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className={`flex-1 px-2.5 py-1.5 border rounded-lg text-xs ${
                isScifi
                  ? 'bg-[#0f172a] border-slate-600 text-white placeholder-slate-500 focus:ring-cyan-500'
                  : 'bg-white border-amber-300 text-gray-900 focus:ring-amber-500'
              }`}
            />
            <button
              onClick={() => {
                setGeminiApiKey(apiKeyInput);
                setIsApiKeyOpen(false);
              }}
              className={`font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                isScifi
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  : 'bg-amber-800 hover:bg-amber-900 text-white'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Capsule Pod */}
      <div className={`rounded-xl p-2 shadow-xs flex items-center justify-between gap-2.5 relative overflow-hidden border-2 ${
        isScifi
          ? 'bg-[#1e293b] border-cyan-500/40 text-slate-100'
          : 'bg-[#f5ebd6] border-[#d4b98b] text-[#2c1810]'
      }`}>
        {/* Left: Compact Embossed REC Button */}
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

        {/* Center: Soundwave Visualizer */}
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
                    backgroundColor: isScifi
                      ? recordingState === 'recording' ? '#38bdf8' : '#0ea5e9'
                      : recordingState === 'recording' ? '#d97706' : '#c9a875',
                  }}
                />
              );
            })}
          </div>

          <div className="text-center mt-0.5">
            <span className={`font-mono font-bold text-[10px] uppercase tracking-wider ${
              isScifi ? 'text-cyan-300' : 'text-amber-950'
            }`}>
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
            className={`font-serif font-bold text-xs underline cursor-pointer select-none ${
              isScifi ? 'text-cyan-400 hover:text-cyan-200' : 'text-amber-950 hover:text-amber-800'
            }`}
          >
            Story Log
          </button>

          {recordingState === 'recording' && (
            <button
              onClick={pauseRecording}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                isScifi
                  ? 'bg-cyan-900/80 text-cyan-200'
                  : 'bg-amber-200/80 text-amber-950'
              }`}
            >
              Pause
            </button>
          )}

          {audioBlob && recordingState === 'idle' && (
            <button
              onClick={clearAudioSession}
              className="text-[10px] font-bold text-rose-400 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Audio Playback Bar if audio exists */}
      {audioBlobUrl && (
        <div className={`rounded-lg p-2 flex items-center justify-between gap-2 border ${
          isScifi
            ? 'bg-slate-900 border-slate-700 text-slate-200'
            : 'bg-amber-50/80 border-amber-300'
        }`}>
          <audio controls src={audioBlobUrl} className="h-6 flex-1" />
          <a
            href={audioBlobUrl}
            download="storytime-recording.webm"
            className="btn-tactile bg-amber-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap cursor-pointer"
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
            className={`w-full p-2.5 border rounded-xl font-serif leading-relaxed text-xs shadow-2xs resize-y transition-colors ${
              isScifi
                ? 'bg-[#0b1329] border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500'
                : 'bg-white border-[#d9c49e] text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-500'
            }`}
          />

          {liveInterimText && (
            <div className={`absolute bottom-2 left-2 right-2 rounded-lg p-1.5 text-xs italic font-serif pointer-events-none shadow-sm border ${
              isScifi
                ? 'bg-slate-900/95 border-cyan-500/40 text-cyan-200'
                : 'bg-amber-100/95 border-amber-300 text-amber-950'
            }`}>
              <span className={`font-bold not-italic uppercase text-[9px] block ${
                isScifi ? 'text-cyan-400' : 'text-amber-800'
              }`}>
                Listening:
              </span>
              {liveInterimText}...
            </div>
          )}

          {audioBlob && geminiApiKey && (
            <button
              onClick={transcribeWithGemini}
              disabled={isTranscribingWithGemini}
              className={`btn-tactile mt-1 text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer ${
                isScifi
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-500/50 hover:bg-cyan-900'
                  : 'text-purple-800 bg-purple-100 hover:bg-purple-200 border-purple-300'
              }`}
            >
              <span>{isTranscribingWithGemini ? 'Transcribing...' : 'AI Enhance Transcript (Gemini)'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
