import React, { useState } from 'react';
import { useComicStore } from '../stores/comicStore';
import { useAudioStore } from '../stores/audioStore';
import { STYLE_PRESETS, buildMasterGeminiPrompt } from '../utils/promptEngine';
import type { ComicStyle } from '../types/comic';

export const ComicStudio: React.FC = () => {
  const {
    selectedStyle,
    panels,
    viewMode,
    currentPageIndex,
    isGeneratingStory,
    isGeneratingImages,
    generationError,
    setStyle,
    setViewMode,
    setCurrentPageIndex,
    generatePanels,
    updatePanel,
    generateImageForPanel,
    generateAllImages,
    clearPanels,
  } = useComicStore();

  const { geminiApiKey } = useAudioStore();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeEditingPanel, setActiveEditingPanel] = useState<string | null>(null);

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
    <div className="bg-white rounded-xl shadow-md border border-parchment-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎨</span>
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              Comic & Picture Book Studio
            </h2>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${currentPreset.accentColor}`}>
              {currentPreset.icon} {currentPreset.name}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Turn your session transcript, seeds, and sparks into illustrated comic panels or a charming children's storybook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={generatePanels}
            disabled={isGeneratingStory}
            className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>✨</span>
            <span>{panels.length > 0 ? 'Rebuild Story Scenes' : 'Build Story Scenes'}</span>
          </button>

          {panels.length > 0 && (
            <>
              <button
                onClick={handleCopyMasterPrompt}
                className="bg-gray-800 hover:bg-black text-white text-xs font-semibold py-2.5 px-3.5 rounded-lg transition-colors flex items-center gap-1.5"
                title="Copy ready-to-use master prompt for Gemini Web Chat"
              >
                <span>{copiedPrompt ? '✓' : '📋'}</span>
                <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Gemini Prompt'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center gap-1"
                title="Print or Save as PDF"
              >
                <span>🖨️</span>
                <span>Print Storybook</span>
              </button>

              <button
                onClick={clearPanels}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-2 rounded-lg border border-red-200 transition-colors"
                title="Clear panels"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visual Style Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Choose Visual Art Style:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(STYLE_PRESETS) as ComicStyle[]).map((styleKey) => {
            const preset = STYLE_PRESETS[styleKey];
            const isSelected = selectedStyle === styleKey;

            return (
              <button
                key={styleKey}
                onClick={() => setStyle(styleKey)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-1 ring-purple-400'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{preset.icon}</span>
                  <span className="font-bold text-xs text-gray-900 line-clamp-1">{preset.name}</span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {generationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs flex justify-between items-center">
          <span>⚠️ {generationError}</span>
        </div>
      )}

      {/* Panels Studio Area */}
      {panels.length === 0 ? (
        <div className="border-2 border-dashed border-parchment-300 rounded-xl p-10 text-center space-y-3 bg-parchment-50/40">
          <div className="text-4xl opacity-75">📚</div>
          <h3 className="font-serif font-bold text-gray-800 text-lg">
            No Story Scenes Generated Yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Click <strong>Build Story Scenes</strong> above to automatically transform your active story seed, sparks, and audio transcript into illustrated scene panels!
          </p>
          <button
            onClick={generatePanels}
            className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all text-sm inline-flex items-center gap-2"
          >
            <span>✨</span>
            <span>Build Story Scenes Now</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sub-header: View Switcher + AI Image Generation Trigger */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-100">
            {/* View Mode Switcher */}
            <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('comic_grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'comic_grid'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🖼️</span>
                <span>Comic Strip Grid</span>
              </button>
              <button
                onClick={() => setViewMode('storybook_page')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'storybook_page'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>📖</span>
                <span>Storybook Flipbook</span>
              </button>
            </div>

            {/* Direct Gemini AI Generate Art */}
            {geminiApiKey && (
              <button
                onClick={generateAllImages}
                disabled={isGeneratingImages}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>🖼️</span>
                <span>{isGeneratingImages ? 'Generating Illustrations...' : 'Generate All AI Art (Gemini)'}</span>
              </button>
            )}
          </div>

          {/* MODE 1: Comic Strip Grid */}
          {viewMode === 'comic_grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  className="bg-parchment-50/70 border-2 border-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  {/* Panel Top Banner */}
                  <div className="bg-gray-900 text-amber-300 px-4 py-2 flex justify-between items-center text-xs font-serif font-bold uppercase tracking-wider">
                    <span>{panel.title}</span>
                    <button
                      onClick={() =>
                        setActiveEditingPanel(activeEditingPanel === panel.id ? null : panel.id)
                      }
                      className="text-gray-400 hover:text-white underline text-[11px] font-sans"
                    >
                      {activeEditingPanel === panel.id ? 'Done' : 'Edit'}
                    </button>
                  </div>

                  {/* Panel Illustration Box */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-4 overflow-hidden border-b-2 border-gray-800">
                    {panel.imageUrl ? (
                      <img
                        src={panel.imageUrl}
                        alt={panel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : panel.isGenerating ? (
                      <div className="flex flex-col items-center gap-2 text-purple-300 animate-pulse">
                        <span className="text-3xl animate-spin">🌀</span>
                        <span className="text-xs font-semibold">Painting Scene with Gemini...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                        <span className="text-3xl opacity-60">{currentPreset.icon}</span>
                        <p className="text-xs text-slate-300 font-serif max-w-xs italic line-clamp-2">
                          "{panel.visualPrompt}"
                        </p>
                        {geminiApiKey ? (
                          <button
                            onClick={() => generateImageForPanel(panel.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1 mt-1"
                          >
                            <span>🎨</span>
                            <span>Generate Art</span>
                          </button>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">
                            Paste prompt in Gemini or add API Key
                          </span>
                        )}
                      </div>
                    )}

                    {/* Speech Bubble Overlay if Dialogue exists */}
                    {panel.dialogue && !panel.isGenerating && (
                      <div className="absolute top-3 left-3 max-w-[70%] bg-white/95 text-gray-900 border-2 border-gray-900 rounded-2xl px-3 py-1.5 text-xs font-sans font-bold shadow-md">
                        <span className="text-[10px] text-purple-700 block uppercase font-semibold">
                          {panel.characterName || 'Hero'}
                        </span>
                        {panel.dialogue}
                      </div>
                    )}
                  </div>

                  {/* Panel Story Caption */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
                    {activeEditingPanel === panel.id ? (
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="font-semibold text-gray-700">Caption Story:</label>
                          <textarea
                            value={panel.caption}
                            onChange={(e) => updatePanel(panel.id, { caption: e.target.value })}
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Dialogue:</label>
                          <input
                            type="text"
                            value={panel.dialogue || ''}
                            onChange={(e) => updatePanel(panel.id, { dialogue: e.target.value })}
                            className="w-full p-1.5 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Visual Prompt:</label>
                          <textarea
                            value={panel.visualPrompt}
                            onChange={(e) =>
                              updatePanel(panel.id, { visualPrompt: e.target.value })
                            }
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-yellow-100/70 border-l-3 border-amber-500 rounded-r p-2.5 text-xs text-gray-900 font-serif leading-relaxed">
                          <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wider block">
                            Narrative Caption:
                          </span>
                          {panel.caption}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODE 2: Storybook Flipbook Reader */}
          {viewMode === 'storybook_page' && panels.length > 0 && (
            <div className="max-w-2xl mx-auto bg-parchment-50 border-4 border-amber-900/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Page Header */}
              <div className="flex justify-between items-center border-b border-amber-200/80 pb-3">
                <span className="text-xs font-serif font-bold text-amber-900 uppercase tracking-widest">
                  Page {currentPageIndex + 1} of {panels.length}
                </span>
                <span className="text-xs text-amber-800 font-serif italic">
                  {panels[currentPageIndex]?.title}
                </span>
              </div>

              {/* Big Illustration */}
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl overflow-hidden border-2 border-amber-900/30 shadow-md flex items-center justify-center relative">
                {panels[currentPageIndex]?.imageUrl ? (
                  <img
                    src={panels[currentPageIndex].imageUrl}
                    alt={panels[currentPageIndex].title}
                    className="w-full h-full object-cover"
                  />
                ) : panels[currentPageIndex]?.isGenerating ? (
                  <div className="flex flex-col items-center gap-2 text-purple-300 animate-pulse">
                    <span className="text-4xl animate-spin">🌀</span>
                    <span className="text-sm font-semibold">Creating illustration...</span>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <span className="text-4xl">{currentPreset.icon}</span>
                    <p className="text-xs text-slate-300 font-serif max-w-sm italic">
                      "{panels[currentPageIndex]?.visualPrompt}"
                    </p>
                    {geminiApiKey && (
                      <button
                        onClick={() => generateImageForPanel(panels[currentPageIndex].id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm"
                      >
                        🎨 Generate Illustration
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Story Narrative Text */}
              <div className="space-y-4 text-center">
                <p className="text-gray-900 font-serif text-lg leading-relaxed sm:text-xl">
                  {panels[currentPageIndex]?.caption}
                </p>

                {panels[currentPageIndex]?.dialogue && (
                  <div className="inline-block bg-amber-100/70 border border-amber-300/80 rounded-full px-5 py-2 text-sm font-serif italic text-amber-950 shadow-2xs">
                    <span className="font-bold font-sans not-italic text-xs text-purple-800 mr-1.5 uppercase">
                      {panels[currentPageIndex].characterName}:
                    </span>
                    {panels[currentPageIndex].dialogue}
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-amber-200/80">
                <button
                  onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                  disabled={currentPageIndex === 0}
                  className="bg-amber-800 hover:bg-amber-900 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-all"
                >
                  ← Previous Page
                </button>

                <div className="flex gap-1">
                  {panels.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentPageIndex ? 'bg-amber-800 scale-125' : 'bg-amber-300 hover:bg-amber-400'
                      }`}
                      title={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPageIndex(Math.min(panels.length - 1, currentPageIndex + 1))
                  }
                  disabled={currentPageIndex === panels.length - 1}
                  className="bg-amber-800 hover:bg-amber-900 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-all"
                >
                  Next Page →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
