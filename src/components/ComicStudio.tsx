import React, { useState } from 'react';
import { useComicStore } from '../stores/comicStore';
import { useAudioStore } from '../stores/audioStore';
import { STYLE_PRESETS, buildMasterGeminiPrompt } from '../utils/promptEngine';
import type { ComicStyle } from '../types/comic';
import comicSceneDefaultImg from '../assets/comic_scene_default.webp';

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
      {/* Section Header without Emojis */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-black text-xs sm:text-sm text-gray-900 tracking-tight uppercase">
            STORY PREVIEW
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 uppercase">
            {currentPreset.name.split('/')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {panels.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'storybook_page' ? 'comic_grid' : 'storybook_page')}
              className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline cursor-pointer"
            >
              {viewMode === 'storybook_page' ? 'View Strip' : 'View Storybook'}
            </button>
          )}

          <button
            onClick={generatePanels}
            disabled={isGeneratingStory}
            className="btn-tactile bg-purple-700 hover:bg-purple-800 text-white font-serif font-bold text-xs py-1 px-3 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>{panels.length > 0 ? 'Rebuild' : 'Build Scenes'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      {panels.length === 0 ? (
        <div className="bg-[#fcf7ec] border border-dashed border-[#d9c49e] rounded-xl p-5 text-center space-y-2">
          <h4 className="font-serif font-bold text-gray-900 text-xs sm:text-sm">
            Storybook Scenes Ready to Illustrate
          </h4>
          <p className="text-xs text-gray-600 max-w-xs mx-auto">
            Tap <strong>Build Scenes</strong> to transform your seeds, sparks, and speech into illustrated story panels.
          </p>
          <button
            onClick={generatePanels}
            className="btn-tactile bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-xs cursor-pointer"
          >
            Build Scenes Now
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Active Preview Panel Card */}
          <div className="bg-[#fcf7ec] border border-[#1f2937] rounded-xl overflow-hidden shadow-sm">
            {/* Balanced Artwork Frame (Tuned 20% larger) */}
            <div className="relative h-36 sm:h-40 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-gray-900">
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
                    src={comicSceneDefaultImg}
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

              {/* Hand-Drawn Style Dialogue Speech Bubble */}
              {panels[currentPageIndex]?.dialogue && (
                <div className="absolute top-2.5 left-2.5 max-w-[80%] bg-white text-gray-900 border border-gray-900 rounded-xl px-2.5 py-1 text-xs font-sans font-bold shadow-md">
                  <span className="text-[9px] text-purple-700 block uppercase font-black">
                    {panels[currentPageIndex].characterName || 'Hero'}
                  </span>
                  {panels[currentPageIndex].dialogue}
                </div>
              )}
            </div>

            {/* Narrative Story Caption & Navigation */}
            <div className="p-2.5 space-y-2 bg-[#fcf7ec]">
              <p className="text-gray-900 font-serif text-xs leading-relaxed text-center">
                {panels[currentPageIndex]?.caption}
              </p>

              {/* Page Navigator */}
              <div className="flex justify-between items-center pt-1.5 border-t border-amber-200/80">
                <button
                  onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                  disabled={currentPageIndex === 0}
                  className="btn-tactile bg-amber-900 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white font-serif font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer"
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {panels.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentPageIndex ? 'bg-amber-900 scale-125' : 'bg-amber-300'
                      }`}
                      title={`Page ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] font-serif font-bold text-amber-950 ml-1">
                    {currentPageIndex + 1}/{panels.length}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPageIndex(Math.min(panels.length - 1, currentPageIndex + 1))
                  }
                  disabled={currentPageIndex === panels.length - 1}
                  className="btn-tactile bg-amber-900 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white font-serif font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar without Emojis */}
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
                        ? 'bg-amber-900 text-white shadow-2xs'
                        : 'bg-white/80 text-gray-700 hover:bg-amber-100 border border-amber-200'
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
                className="text-[11px] font-bold text-gray-800 hover:text-black bg-white/90 border border-amber-300 px-2.5 py-0.5 rounded cursor-pointer"
                title="Copy prompt for Gemini Web Chat"
              >
                <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="text-[11px] font-bold text-gray-700 hover:text-black bg-white/90 border border-amber-300 px-2 py-0.5 rounded cursor-pointer"
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
