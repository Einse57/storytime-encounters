import { useState } from 'react';
import { DiceRoller } from './components/DiceRoller';
import { MobSelector } from './components/MobSelector';
import { EncounterTracker } from './components/EncounterTracker';
import { LootLog } from './components/LootLog';
import { PlayerCreator } from './components/PlayerCreator';
import { SessionControls } from './components/SessionControls';
import { StorySeedGenerator } from './components/StorySeedGenerator';
import { useSessionPersistence } from './hooks/useSessionPersistence';

function App() {
  // Initialize session persistence
  useSessionPersistence();
  
  // Track whether a session is active (advanced features visible)
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const handleStartSession = () => {
    setIsSessionActive(true);
  };
  
  const handleClearSession = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-serif font-bold text-center">
            ⚔️ Storytime Encounters
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Story Seed Generator - Always visible */}
        <div className="mb-6">
          <StorySeedGenerator />
        </div>
        
        {/* Dice Roller - Always visible */}
        <div className="mb-6">
          <DiceRoller />
        </div>
        
        {/* Session Controls - Always visible */}
        <div className="mb-6">
          <SessionControls 
            isSessionActive={isSessionActive}
            onStartSession={handleStartSession}
            onClearSession={handleClearSession}
          />
        </div>
        
        {/* Advanced Session Features - Only visible when session is active */}
        {isSessionActive && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <PlayerCreator />
              <MobSelector />
            </div>

            {/* Middle Column - Encounter */}
            <div>
              <EncounterTracker />
            </div>

            {/* Right Column - Logs */}
            <div>
              <LootLog />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-12">
        <p className="text-sm font-serif">
          Built for storytellers and adventurers ✨
        </p>
      </footer>
    </div>
  );
}

export default App;
