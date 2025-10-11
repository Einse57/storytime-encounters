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

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 to-parchment-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-serif font-bold text-center">
            ⚔️ Storytime Encounters
          </h1>
          <p className="text-center text-gray-300 mt-2 font-serif italic">
            Your Ad Hoc D&D Companion
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionControls />
          <StorySeedGenerator />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <DiceRoller />
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-12">
        <p className="text-sm font-serif">
          Built for storytellers and adventurers • Sprint 3 Complete ✨
        </p>
      </footer>
    </div>
  );
}

export default App;
