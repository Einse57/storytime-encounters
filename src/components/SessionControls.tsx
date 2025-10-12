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
      // Reset the input so the same file can be imported again
      e.target.value = '';
      // Activate session when importing
      onStartSession();
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire session? This cannot be undone.')) {
      clearSession();
      onClearSession();
    }
  };
  
  const handleNew = () => {
    onStartSession();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200">
      <h3 className="text-lg font-serif font-semibold text-gray-800 mb-3">Session</h3>
      
      {!isSessionActive ? (
        // Before session starts - show only "New" button
        <div>
          <button
            onClick={handleNew}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-4 rounded-md transition-colors duration-200 shadow-md"
            title="Start a new session to track players, encounters, and loot"
          >
            🎲 New Session
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Start a session to unlock player creation, encounter tracking, and loot management
          </p>
        </div>
      ) : (
        // After session starts - show all controls
        <div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={exportSession}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200"
              title="Export session to JSON file"
            >
              💾 Export
            </button>
            
            <button
              onClick={handleImport}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200"
              title="Import session from JSON file"
            >
              📂 Import
            </button>
            
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200"
              title="Clear entire session"
            >
              🗑️ Clear
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Auto-saves to browser
          </p>
        </div>
      )}

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
