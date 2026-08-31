import React from 'react';
import type { RecordingState } from '../types/audio';

interface AudioWaveformProps {
  recordingState: RecordingState;
  waveformBars: number[];
  audioLevel: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  recordingState,
  waveformBars,
  audioLevel,
}) => {
  const isRecording = recordingState === 'recording';
  const isPaused = recordingState === 'paused';

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner overflow-hidden">
      {waveformBars.map((height, idx) => {
        const barColor =
          audioLevel > 65
            ? 'bg-rose-500 shadow-rose-500/50'
            : audioLevel > 30
            ? 'bg-amber-400 shadow-amber-400/50'
            : 'bg-emerald-400 shadow-emerald-400/50';

        const displayedHeight = isRecording
          ? `${height}%`
          : isPaused
          ? '20%'
          : '10%';

        return (
          <div
            key={idx}
            className="w-1.5 rounded-full transition-all duration-75 ease-out shadow-xs"
            style={{
              height: displayedHeight,
              minHeight: '4px',
            }}
          >
            <div
              className={`w-full h-full rounded-full ${
                isRecording
                  ? barColor
                  : isPaused
                  ? 'bg-amber-400/60'
                  : 'bg-slate-600/40'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
