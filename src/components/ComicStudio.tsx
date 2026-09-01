import React, { useState } from 'react';
import { useComicStore } from '../stores/comicStore';
import { useAudioStore } from '../stores/audioStore';
import { STYLE_PRESETS, buildMasterGeminiPrompt } from '../utils/promptEngine';
import type { ComicStyle } from '../types/comic';
import comicSceneDefaultImg from '../assets/comic_scene_default.webp';
import scifiSceneDefaultImg from '../assets/scifi_scene_default.webp';
import { useStoryStore } from '../stores/storyStore';

export const ComicStudio: React.FC = () => {
  const {
    selectedStyle,
    panels,
    viewMode,
    currentPageIndex,
    isGeneratingStory,
    setStyle,
    setViewMode,
    setCurrentPageIndex,
    generatePanels,
    generateImageForPanel,
  } = useComicStore();

  const { geminiApiKey } = useAudioStore();
  const currentPackId = useStoryStore((s) => s.currentPackId);
  const isScifi = currentPackId === 'scifi-frontier';
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const currentPreset = STYLE_PRESETS[selectedStyle];

  const handleCopyMasterPrompt = () => {
    if (panels.length === 0) return;
    const prompt = buildMasterGeminiPrompt(selectedStyle, panels);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-serif font-black text-xs sm:text-sm tracking-tight uppercase ${
            isScifi ? 'text-white' : 'text-gray-900'
          }`}>
            STORY PREVIEW
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
            isScifi
              ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/40'
              : 'bg-amber-200/80 text-amber-950'
          }`}>
            {currentPreset.name.split('/')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {panels.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'storybook_page' ? 'comic_grid' : 'storybook_page')}
              className={`text-[11px] font-bold underline cursor-pointer ${
                isScifi ? 'text-cyan-400 hover:text-cyan-200' : 'text-amber-900 hover:text-amber-700'
              }`}
            >
              {viewMode === 'storybook_page' ? 'View Strip' : 'View Storybook'}
            </button>
          )}

          <button
            onClick={generatePanels}
            disabled={isGeneratingStory}
            className={`btn-tactile font-serif font-bold text-xs py-1 px-3 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer text-white ${
              isScifi
                ? 'bg-cyan-700 hover:bg-cyan-600'
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            <span>{panels.length > 0 ? 'Rebuild' : 'Build Scenes'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      {panels.length === 0 ? (
        <div className={`border border-dashed rounded-xl p-5 text-center space-y-2 ${
          isScifi
            ? 'bg-[#1e293b] border-slate-700 text-slate-100'
            : 'bg-[#fcf7ec] border-[#d9c49e] text-gray-900'
        }`}>
          <h4 className={`font-serif font-bold text-xs sm:text-sm ${
            isScifi ? 'text-white' : 'text-gray-900'
          }`}>
            Storybook Scenes Ready to Illustrate
          </h4>
          <p className={`text-xs max-w-xs mx-auto ${
            isScifi ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Tap <strong>Build Scenes</strong> to transform your seeds, sparks, and speech into illustrated story panels.
          </p>
          <button
            onClick={generatePanels}
            className={`btn-tactile text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-xs cursor-pointer ${
              isScifi
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            }`}
          >
            Build Scenes Now
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Active Preview Panel Card */}
          <div className={`rounded-xl overflow-hidden shadow-sm border ${
            isScifi ? 'bg-[#1e293b] border-slate-700' : 'bg-[#fcf7ec] border-[#1f2937]'
          }`}>
            {/* Aspect-Ratio Main Stage */}
            <div className="aspect-[16/9] w-full bg-black relative flex items-center justify-center overflow-hidden">
              {panels[currentPageIndex]?.imageUrl ? (
                <img
                  src={panels[currentPageIndex].imageUrl}
                  alt={panels[currentPageIndex].title}
                  className="w-full h-full object-cover"
                />
              ) : panels[currentPageIndex]?.isGenerating ? (
                <div className="flex flex-col items-center gap-2 text-purple-300 animate-pulse p-4">
                  <span className="text-xs font-semibold">Creating Art with Gemini...</span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={isScifi ? scifiSceneDefaultImg : comicSceneDefaultImg}
                    alt="Comic Scene Adventure"
                    className="w-full h-full object-cover"
                  />
                  
                  {geminiApiKey && (
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => generateImageForPanel(panels[currentPageIndex].id)}
                        className="btn-tactile bg-gray-950/80 hover:bg-purple-700 text-white text-[10px] font-bold py-1 px-2.5 rounded-md shadow-sm backdrop-blur-xs cursor-pointer"
                      >
                        AI Paint
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Speech Bubble */}
              {panels[currentPageIndex]?.dialogue && (
                <div className={`absolute top-2.5 left-2.5 max-w-[80%] rounded-xl px-2.5 py-1 text-xs font-sans font-bold shadow-md border ${
                  isScifi
                    ? 'bg-slate-900/95 text-slate-100 border-cyan-400/80'
                    : 'bg-white text-gray-900 border-gray-900'
                }`}>
                  <span className={`text-[9px] block uppercase font-black ${
                    isScifi ? 'text-cyan-400' : 'text-purple-700'
                  }`}>
                    {panels[currentPageIndex].characterName || 'Hero'}
                  </span>
                  {panels[currentPageIndex].dialogue}
                </div>
              )}
            </div>

            {/* Narrative Story Caption & Navigation */}
            <div className={`p-2.5 space-y-2 ${
              isScifi ? 'bg-[#1e293b]' : 'bg-[#fcf7ec]'
            }`}>
              <p className={`font-serif text-xs leading-relaxed text-center ${
                isScifi ? 'text-slate-200' : 'text-gray-900'
              }`}>
                {panels[currentPageIndex]?.caption}
              </p>

              {/* Page Navigator */}
              <div className={`flex justify-between items-center pt-1.5 border-t ${
                isScifi ? 'border-slate-700' : 'border-amber-200/80'
              }`}>
                <button
                  onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                  disabled={currentPageIndex === 0}
                  className={`btn-tactile disabled:opacity-30 disabled:cursor-not-allowed text-white font-serif font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer ${
                    isScifi
                      ? 'bg-cyan-800 hover:bg-cyan-700'
                      : 'bg-amber-900 hover:bg-black'
                  }`}
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {panels.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentPageIndex
                          ? isScifi ? 'bg-cyan-400 scale-125' : 'bg-amber-900 scale-125'
                          : isScifi ? 'bg-slate-600' : 'bg-amber-300'
                      }`}
                      title={`Page ${idx + 1}`}
                    />
                  ))}
                  <span className={`text-[10px] font-serif font-bold ml-1 ${
                    isScifi ? 'text-cyan-300' : 'text-amber-950'
                  }`}>
                    {currentPageIndex + 1}/{panels.length}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPageIndex(Math.min(panels.length - 1, currentPageIndex + 1))
                  }
                  disabled={currentPageIndex === panels.length - 1}
                  className={`btn-tactile disabled:opacity-30 disabled:cursor-not-allowed text-white font-serif font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer ${
                    isScifi
                      ? 'bg-cyan-800 hover:bg-cyan-700'
                      : 'bg-amber-900 hover:bg-black'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
            <div className="flex items-center gap-1">
              {(Object.keys(STYLE_PRESETS) as ComicStyle[]).map((styleKey) => {
                const preset = STYLE_PRESETS[styleKey];
                const isSelected = selectedStyle === styleKey;
                return (
                  <button
                    key={styleKey}
                    onClick={() => setStyle(styleKey)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                      isSelected
                        ? isScifi ? 'bg-cyan-600 text-white shadow-2xs' : 'bg-amber-900 text-white shadow-2xs'
                        : isScifi ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white/80 text-gray-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {preset.name.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyMasterPrompt}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded cursor-pointer border ${
                  isScifi
                    ? 'bg-slate-800 text-cyan-200 border-slate-700 hover:bg-slate-700'
                    : 'text-gray-800 hover:text-black bg-white/90 border-amber-300'
                }`}
                title="Copy prompt for Gemini Web Chat"
              >
                <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>

              <button
                onClick={handlePrint}
                className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer border ${
                  isScifi
                    ? 'bg-slate-800 text-cyan-200 border-slate-700 hover:bg-slate-700'
                    : 'text-gray-700 hover:text-black bg-white/90 border-amber-300'
                }`}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
