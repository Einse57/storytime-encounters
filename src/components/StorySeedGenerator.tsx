import React, { useEffect } from 'react';
import { useStoryStore } from '../stores/storyStore';
import settingRealmImg from '../assets/setting_realm.webp';
import conflictClashImg from '../assets/conflict_clash.webp';
import hookScrollImg from '../assets/hook_scroll.webp';
import scifiSettingImg from '../assets/scifi_setting.webp';
import scifiConflictImg from '../assets/scifi_conflict.webp';
import scifiHookImg from '../assets/scifi_hook.webp';

export const StorySeedGenerator: React.FC = () => {
  const seed = useStoryStore((s) => s.seed);
  const rollSetting = useStoryStore((s) => s.rollSetting);
  const rollConflict = useStoryStore((s) => s.rollConflict);
  const rollHook = useStoryStore((s) => s.rollHook);
  const currentPackId = useStoryStore((s) => s.currentPackId);

  const isScifi = currentPackId === 'scifi-frontier';

  useEffect(() => {
    const current = useStoryStore.getState().seed;
    if (!current.setting && !current.conflict && !current.hook) {
      useStoryStore.getState().randomizeSeed();
    }
  }, [currentPackId]);

  return (
    <div className="space-y-2">
      {/* 1. SETTING */}
      <div
        onClick={rollSetting}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#090d16] border-[#38bdf8]'
            : 'bg-gradient-to-r from-[#16203b] via-[#0f172a] to-[#080d1a] border-[#d97706]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Setting"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-cyan-400' : 'text-amber-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-cyan-400' : 'text-amber-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-cyan-400/80' : 'border-amber-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiSettingImg : settingRealmImg}
            alt="Setting"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              SETTING
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'Sector / Zone' : 'Location'}
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

      {/* 2. CONFLICT */}
      <div
        onClick={rollConflict}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#2a0e00] via-[#1f0a00] to-[#120500] border-[#f97316]'
            : 'bg-gradient-to-r from-[#3f1015] via-[#2a080d] to-[#170306] border-[#ef4444]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Conflict"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-orange-400' : 'text-rose-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-orange-400' : 'text-rose-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-orange-400/80' : 'border-rose-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiConflictImg : conflictClashImg}
            alt="Conflict"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              CONFLICT
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-orange-500/20 text-orange-200 border-orange-400/30'
                  : 'bg-rose-500/20 text-rose-200 border-rose-400/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'Hazard' : 'Challenge'}
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

      {/* 3. HOOK */}
      <div
        onClick={rollHook}
        className={`btn-tactile spark-card-text rounded-xl p-2.5 sm:p-3 shadow-sm relative overflow-hidden flex items-start gap-3 cursor-pointer select-none max-w-full border-2 ${
          isScifi
            ? 'bg-gradient-to-r from-[#022226] via-[#011417] to-[#000c0e] border-[#06b6d4]'
            : 'bg-gradient-to-r from-[#1e153d] via-[#130d29] to-[#090517] border-[#a855f7]'
        }`}
        style={{ color: '#ffffff' }}
        role="button"
        tabIndex={0}
        aria-label="Roll Hook"
      >
        <div className={`filigree-corner-tl ${isScifi ? 'text-cyan-400' : 'text-purple-400'}`} />
        <div className={`filigree-corner-br ${isScifi ? 'text-cyan-400' : 'text-purple-400'}`} />

        {/* 36px Graphic Badge */}
        <div
          className={`flex-shrink-0 mt-0.5 rounded-lg overflow-hidden border bg-black/40 flex items-center justify-center shadow-xs ${
            isScifi ? 'border-cyan-400/80' : 'border-purple-400/80'
          }`}
          style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
        >
          <img
            src={isScifi ? scifiHookImg : hookScrollImg}
            alt="Hook"
            width="36"
            height="36"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-1.5 leading-none mb-1">
            <span
              className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-sm"
              style={{ color: '#ffffff' }}
            >
              HOOK
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isScifi
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'
                  : 'bg-purple-500/20 text-purple-200 border-purple-400/30'
              }`}
              style={{ color: '#ffffff' }}
            >
              {isScifi ? 'Telemetry' : 'Opportunity'}
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
