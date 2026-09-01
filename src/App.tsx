import { DiceRoller } from './components/DiceRoller';
import { StorySeedGenerator } from './components/StorySeedGenerator';
import { StorySparks } from './components/StorySparks';
import { AudioStudio } from './components/AudioStudio';
import { ComicStudio } from './components/ComicStudio';
import { useSessionPersistence } from './hooks/useSessionPersistence';
import { useStoryStore } from './stores/storyStore';

function App() {
  // Silent session persistence (auto-saves to localStorage in the background)
  useSessionPersistence();
  
  const { getCurrentPack } = useStoryStore();
  const pack = getCurrentPack();

  return (
    <div className="min-h-screen bg-[#f5eedc] text-[#2c1810] pb-16 font-sans">
      {/* Clean Top Header */}
      <header className="pt-3 pb-1.5 px-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex-1 text-center pr-2">
            <h1 className="text-lg sm:text-xl font-serif font-black tracking-wider text-[#451a03] uppercase drop-shadow-2xs">
              Storytime Encounters
            </h1>
          </div>

          {/* Theme Pill */}
          <div className="flex-shrink-0 flex items-center bg-[#fcf7ec] border border-[#d9c49e] rounded-lg px-2 py-0.5 shadow-2xs">
            <span className="text-[10px] font-serif font-bold text-amber-950 uppercase tracking-wider leading-tight">
              {pack.title.split('&')[0].trim()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Storytelling Cockpit */}
      <main className="max-w-lg mx-auto px-3 space-y-3 pt-0.5">
        {/* 1. Story Seed Generator */}
        <section aria-label="Story Seed">
          <StorySeedGenerator />
        </section>
        
        {/* 2. 1-Click Story Sparks (Loot, Creatures, Plot Twists) */}
        <section aria-label="Story Sparks">
          <StorySparks />
        </section>

        {/* 3. 1-Tap Quick Dice Roller */}
        <section aria-label="Dice Roller">
          <DiceRoller />
        </section>

        {/* 4. Audio Studio & Live Session Transcriber */}
        <section aria-label="Audio Studio">
          <AudioStudio />
        </section>

        {/* 5. Comic & Picture Book Scene Studio */}
        <section aria-label="Comic & Picture Book Studio">
          <ComicStudio />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-amber-900/60 text-[11px] font-serif px-4">
        <p>Built for storytellers, adventurers, and young imaginations</p>
      </footer>
    </div>
  );
}

export default App;
