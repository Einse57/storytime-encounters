import React, { useEffect } from 'react';
import { useStoryStore } from '../stores/storyStore';
import settingRealmImg from '../assets/setting_realm.webp';
import conflictClashImg from '../assets/conflict_clash.webp';
import hookScrollImg from '../assets/hook_scroll.webp';

export const StorySeedGenerator: React.FC = () => {
  const seed = useStoryStore((s) => s.seed);
  const rollSetting = useStoryStore((s) => s.rollSetting);
  const rollConflict = useStoryStore((s) => s.rollConflict);
  const rollHook = useStoryStore((s) => s.rollHook);
  const currentPackId = useStoryStore((s) => s.currentPackId);

  useEffect(() => {
    const current = useStoryStore.getState().seed;
    if (!current.setting && !current.conflict && !current.hook) {
      useStoryStore.getState().randomizeSeed();
    }
  }, [currentPackId]);

  return (
    <div className="space-y-2">
      {/* 1. SETTING (Themed Clickable Ribbon, Pure White Text, 36px Realm Art) */}
      <div
        onClick={rollSetting}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#16203b] via-[#0f172a] to-[#080d1a] border-2 border-[#d97706] rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full"
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Setting"
      >
        <div className="filigree-corner-tl text-amber-400" />
        <div className="filigree-corner-br text-amber-400" />

        {/* 36px Graphic Badge */}
        <div
          className="flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border border-amber-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={settingRealmImg}
            alt="Setting"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details - Strictly Constrained & Auto-Wrapping */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              SETTING
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30"
              style={{ color: '#ffffff' }}
            >
              Location
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5 capitalize"
            style={{ color: '#ffffff' }}
          >
            {seed.setting || 'Generating setting...'}
          </p>
        </div>
      </div>

      {/* 2. CONFLICT (Themed Clickable Ribbon, Pure White Text, 36px Clash Art) */}
      <div
        onClick={rollConflict}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#3f1015] via-[#2a080d] to-[#170306] border-2 border-[#ef4444] rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full"
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Conflict"
      >
        <div className="filigree-corner-tl text-rose-400" />
        <div className="filigree-corner-br text-rose-400" />

        {/* 36px Graphic Badge */}
        <div
          className="flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border border-rose-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={conflictClashImg}
            alt="Conflict"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details - Strictly Constrained & Auto-Wrapping */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              CONFLICT
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded border border-rose-400/30"
              style={{ color: '#ffffff' }}
            >
              Challenge
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5"
            style={{ color: '#ffffff' }}
          >
            {seed.conflict || 'Generating conflict...'}
          </p>
        </div>
      </div>

      {/* 3. HOOK (Themed Clickable Ribbon, Pure White Text, 36px Scroll Art) */}
      <div
        onClick={rollHook}
        className="btn-tactile spark-card-text bg-gradient-to-r from-[#1e153d] via-[#130d29] to-[#090517] border-2 border-[#a855f7] rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full"
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Hook"
      >
        <div className="filigree-corner-tl text-purple-400" />
        <div className="filigree-corner-br text-purple-400" />

        {/* 36px Graphic Badge */}
        <div
          className="flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border border-purple-400/80 bg-black/40 flex items-center justify-center shadow-xs"
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={hookScrollImg}
            alt="Hook"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details - Strictly Constrained & Auto-Wrapping */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              HOOK
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30"
              style={{ color: '#ffffff' }}
            >
              Opportunity
            </span>
          </div>

          <p
            className="font-serif text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal mt-0.5"
            style={{ color: '#ffffff' }}
          >
            {seed.hook || 'Generating hook...'}
          </p>
        </div>
      </div>
    </div>
  );
};
