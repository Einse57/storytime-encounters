import { useEffect, useState } from 'react';
import { DiceRoller } from './components/DiceRoller';
import { StorySeedGenerator } from './components/StorySeedGenerator';
import { StorySparks } from './components/StorySparks';
import { AudioStudio } from './components/AudioStudio';
import { ComicStudio } from './components/ComicStudio';
import { WaitlistLanding } from './components/WaitlistLanding';
import { useSessionPersistence } from './hooks/useSessionPersistence';
import { useStoryStore } from './stores/storyStore';

function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return pathname;
}

function isCompanionPath(pathname: string) {
  return pathname === '/app' || pathname.startsWith('/app/');
}

function CompanionApp() {
  // Silent session persistence (auto-saves to localStorage in the background)
  useSessionPersistence();

  const { currentPackId, setCurrentPack } = useStoryStore();
  const isScifi = currentPackId === 'scifi-frontier';

  function goHome() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <div
      className={`min-h-screen ${
        isScifi ? 'bg-[#0b1329] text-slate-100' : 'bg-[#f5eedc] text-[#2c1810]'
      } pb-16 font-sans transition-colors duration-300`}
    >
      {/* Clean Top Header */}
      <header className="pt-3 pb-1.5 px-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 text-left">
            <h1
              className={`text-base sm:text-lg font-serif font-black tracking-wider uppercase ${
                isScifi
                  ? 'text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]'
                  : 'text-[#451a03] drop-shadow-2xs'
              }`}
            >
              Storytime Encounters
            </h1>
            <button
              type="button"
              onClick={goHome}
              className={`mt-0.5 text-[10px] font-serif uppercase tracking-wide cursor-pointer ${
                isScifi
                  ? 'text-slate-400 hover:text-cyan-300'
                  : 'text-amber-900/55 hover:text-amber-950'
              }`}
            >
              ← Waitlist home
            </button>
          </div>

          {/* 1-Click Theme Switcher (Direct Toggle: Fantasy vs Sci-Fi) */}
          <div
            className={`flex-shrink-0 flex items-center p-0.5 rounded-lg border shadow-2xs transition-colors ${
              isScifi ? 'bg-slate-900 border-slate-700' : 'bg-[#eae0cc] border-[#d9c49e]'
            }`}
          >
            <button
              onClick={() => setCurrentPack('high-fantasy')}
              className={`px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isScifi
                  ? 'bg-[#451a03] text-amber-100 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch to High Fantasy theme"
            >
              Fantasy
            </button>
            <button
              onClick={() => setCurrentPack('scifi-frontier')}
              className={`px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-wider transition-all cursor-pointer ${
                isScifi
                  ? 'bg-cyan-500 text-slate-950 shadow-xs font-black'
                  : 'text-amber-950/70 hover:text-amber-950'
              }`}
              title="Switch to Sci-Fi Frontier theme"
            >
              Sci-Fi
            </button>
          </div>
        </div>
      </header>

      {/* Main Storytelling Cockpit */}
      <main className="max-w-lg mx-auto px-3 space-y-3 pt-0.5">
        <section aria-label="Story Seed">
          <StorySeedGenerator />
        </section>

        <section aria-label="Story Sparks">
          <StorySparks />
        </section>

        <section aria-label="Dice Roller">
          <DiceRoller />
        </section>

        <section aria-label="Audio Studio">
          <AudioStudio />
        </section>

        <section aria-label="Comic & Picture Book Studio">
          <ComicStudio />
        </section>
      </main>

      <footer
        className={`mt-6 text-center text-[11px] font-serif px-4 ${
          isScifi ? 'text-slate-400' : 'text-amber-900/60'
        }`}
      >
        <p>Built for storytellers, adventurers, and young imaginations</p>
      </footer>
    </div>
  );
}

function App() {
  const pathname = usePathname();

  if (isCompanionPath(pathname)) {
    return <CompanionApp />;
  }

  return <WaitlistLanding />;
}

export default App;
