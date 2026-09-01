import React, { useRef } from 'react';
import { useSessionPersistence } from '../hooks/useSessionPersistence';

interface SessionControlsProps {
  isSessionActive: boolean;
  onStartSession: () => void;
  onClearSession: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({ 
  isSessionActive, 
  onStartSession,
  onClearSession 
}) => {
  const { clearSession, exportSession, importSession } = useSessionPersistence();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importSession(file);
      e.target.value = '';
      onStartSession();
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire session? This cannot be undone.')) {
      clearSession();
      onClearSession();
    }
  };

  return (
    <div className="bg-white/95 rounded-xl shadow-xs border border-amber-900/10 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
              Session Backup & Data
            </h3>
            {isSessionActive && (
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Auto-saves locally to your browser. You can export or import JSON stories anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={exportSession}
            className="btn-tactile flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Export session to JSON file"
          >
            Export
          </button>
          
          <button
            onClick={handleImport}
            className="btn-tactile flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Import session from JSON file"
          >
            Import
          </button>
          
          <button
            onClick={handleClear}
            className="btn-tactile text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 py-1.5 px-2.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            title="Clear entire session"
          >
            Reset All
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
