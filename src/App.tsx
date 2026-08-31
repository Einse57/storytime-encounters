import { useState } from 'react';
import { DiceRoller } from './components/DiceRoller';
import { StorySeedGenerator } from './components/StorySeedGenerator';
import { StorySparks } from './components/StorySparks';
import { AudioStudio } from './components/AudioStudio';
import { ComicStudio } from './components/ComicStudio';
import { MobSelector } from './components/MobSelector';
import { EncounterTracker } from './components/EncounterTracker';
import { LootLog } from './components/LootLog';
import { PlayerCreator } from './components/PlayerCreator';
import { SessionControls } from './components/SessionControls';
import { useSessionPersistence } from './hooks/useSessionPersistence';
import { useEncounterStore } from './stores/encounterStore';
import { useStoryStore } from './stores/storyStore';

function App() {
  // Initialize session persistence
  useSessionPersistence();
  
  // Track whether legacy combat features are active/expanded
  const [isCombatTrackerOpen, setIsCombatTrackerOpen] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // Get entities from encounter store
  const { entities } = useEncounterStore();
  const { getCurrentPack } = useStoryStore();
  const pack = getCurrentPack();
  
  const handleStartSession = () => {
    setIsSessionActive(true);
  };
  
  const handleClearSession = () => {
    setIsSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-100 via-amber-50/40 to-parchment-200 text-gray-800 pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white shadow-xl border-b border-amber-900/30">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-3xl">⚔️</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
                Storytime Encounters
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-serif mt-1">
              Imaginative Storytelling, Audio Recording, Adventure Sparks & AI Art Studio 🎨
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 shadow-xs">
              <span className="text-base">{pack.icon}</span>
              <span className="text-xs font-semibold text-slate-200">{pack.title}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* 1. Story Seed Generator */}
        <section aria-label="Story Seed">
          <StorySeedGenerator />
        </section>
        
        {/* 2. 1-Click Story Sparks (Loot, Creatures/NPCs, Plot Twists) */}
        <section aria-label="Story Sparks">
          <StorySparks />
        </section>

        {/* 3. Dice Roller */}
        <section aria-label="Dice Roller">
          <DiceRoller isSessionActive={isSessionActive} entities={entities} />
        </section>

        {/* 4. Audio Studio & Live Session Transcriber */}
        <section aria-label="Audio Studio">
          <AudioStudio />
        </section>

        {/* 5. Comic & Picture Book Scene Studio */}
        <section aria-label="Comic & Picture Book Studio">
          <ComicStudio />
        </section>

        {/* 6. Session Storage & Save Controls */}
        <section aria-label="Session Controls">
          <SessionControls 
            isSessionActive={isSessionActive}
            onStartSession={handleStartSession}
            onClearSession={handleClearSession}
          />
        </section>

        {/* Optional Collapsible Combat & Character Tracker */}
        <section className="bg-white/80 rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200">
          <button
            onClick={() => {
              setIsCombatTrackerOpen(!isCombatTrackerOpen);
              if (!isSessionActive) setIsSessionActive(true);
            }}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <h3 className="font-serif font-bold text-gray-800 text-base">
                  Advanced Battle Grid & Turn Tracker
                </h3>
                <p className="text-xs text-gray-500">
                  Optional HP management, initiative tracking, and player character builder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                {entities.length} {entities.length === 1 ? 'Entity' : 'Entities'}
              </span>
              <span className="text-gray-400 font-bold text-sm">
                {isCombatTrackerOpen ? '▲' : '▼'}
              </span>
            </div>
          </button>

          {isCombatTrackerOpen && (
            <div className="p-6 border-t border-gray-200 bg-parchment-50/60">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Entity Creators */}
                <div className="space-y-6">
                  <PlayerCreator />
                  <MobSelector />
                </div>

                {/* Middle Column - Turn & HP Tracker */}
                <div>
                  <EncounterTracker />
                </div>

                {/* Right Column - Loot Assignment Log */}
                <div>
                  <LootLog />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-xs font-serif">
        <p>Built for storytellers, adventurers, and young imaginations ✨</p>
      </footer>
    </div>
  );
}

export default App;
