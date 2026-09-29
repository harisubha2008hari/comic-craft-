import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Share2,
  Printer,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { ComicProject, ComicPage } from '../types/comic';

interface ComicReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ComicProject;
  onExportCurrentPage: () => void;
}

export const ComicReaderModal: React.FC<ComicReaderModalProps> = ({
  isOpen,
  onClose,
  project,
  onExportCurrentPage,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [readingMode, setReadingMode] = useState<'page-by-page' | 'webtoon-scroll'>('page-by-page');

  if (!isOpen) return null;

  const activeChapter = project.chapters.find((c) => c.id === project.activeChapterId) || project.chapters[0];
  const pages = activeChapter?.pages || [];
  const currentPage = pages[currentPageIndex] || pages[0];

  const handlePrev = () => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex((i) => Math.min(pages.length - 1, i + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] flex flex-col text-white select-none animate-in fade-in duration-150">
      {/* Top Reader Bar */}
      <header className="h-12 bg-[#181818] border-b border-[#2a2a2a] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#007acc]" />
          <div>
            <div className="font-bold text-sm tracking-tight">{project.title}</div>
            <div className="text-[11px] text-[#888888]">
              {activeChapter?.title} · Page {currentPageIndex + 1} of {pages.length}
            </div>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#242424] p-1 rounded-lg border border-[#383838]">
          <button
            onClick={() => setReadingMode('page-by-page')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              readingMode === 'page-by-page'
                ? 'bg-[#007acc] text-white font-medium'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            Page Flip
          </button>
          <button
            onClick={() => setReadingMode('webtoon-scroll')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              readingMode === 'webtoon-scroll'
                ? 'bg-[#007acc] text-white font-medium'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            Webtoon Vertical
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCurrentPage}
            className="px-2.5 py-1.5 bg-[#252526] hover:bg-[#333333] rounded text-xs flex items-center gap-1.5 text-[#cccccc] hover:text-white transition-colors border border-[#3e3e3e]"
            title="Download high-resolution comic page"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save PNG</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors"
            title="Print Comic Page"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#333333] rounded text-[#888888] hover:text-white transition-colors ml-2"
            title="Close Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Reader Viewport */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 relative custom-scrollbar">
        {readingMode === 'page-by-page' ? (
          <div className="flex items-center gap-6 max-w-5xl w-full justify-center">
            {/* Prev Page Button */}
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Comic Page Surface */}
            <div className="w-full max-w-2xl bg-black border-4 border-white shadow-2xl p-6 rounded-sm min-h-[750px] flex flex-col justify-between">
              <div className="space-y-4">
                {currentPage?.panels.map((panel, idx) => (
                  <div
                    key={panel.id}
                    className="relative rounded overflow-hidden min-h-[190px] border-2 border-white bg-zinc-950"
                  >
                    {panel.imageUrl && (
                      <img
                        src={panel.imageUrl}
                        alt={`Panel ${idx + 1}`}
                        className={`w-full h-full object-cover max-h-[260px] ${
                          panel.filter.noirThreshold > 0 ? 'contrast-200 grayscale' : ''
                        }`}
                        style={{
                          filter: `
                            brightness(${100 + panel.filter.brightness}%)
                            contrast(${100 + panel.filter.contrast}%)
                            saturate(${100 + panel.filter.saturation}%)
                            sepia(${panel.filter.sepia}%)
                          `,
                        }}
                      />
                    )}

                    {/* Speech Bubbles */}
                    {panel.bubbles.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          left: `${b.x}%`,
                          top: `${b.y}%`,
                          color: b.fontColor,
                          backgroundColor: b.bgColor,
                          borderColor: b.borderColor,
                          borderWidth: `${b.borderWidth}px`,
                          fontSize: `${b.fontSize}px`,
                          fontFamily: b.fontFamily,
                        }}
                        className={`absolute max-w-[200px] p-2 text-center shadow-lg pointer-events-none ${
                          b.type === 'shout'
                            ? 'font-bold uppercase tracking-wider'
                            : b.type === 'thought'
                            ? 'rounded-3xl border-dashed'
                            : b.type === 'sfx'
                            ? 'font-black bg-transparent border-none'
                            : 'rounded-2xl border-solid'
                        }`}
                      >
                        {b.speaker && (
                          <div className="text-[9px] font-bold opacity-75">{b.speaker}</div>
                        )}
                        <div>{b.text}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-500 font-mono">
                <span>{project.title}</span>
                <span className="text-white font-bold">Page {currentPageIndex + 1}</span>
                <span>{project.author}</span>
              </div>
            </div>

            {/* Next Page Button */}
            <button
              onClick={handleNext}
              disabled={currentPageIndex === pages.length - 1}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          /* Webtoon Vertical Continuous Stream */
          <div className="max-w-lg w-full py-8 space-y-6">
            {pages.map((pg) => (
              <div key={pg.id} className="space-y-4">
                <div className="text-center font-mono text-xs text-zinc-600 uppercase tracking-widest">
                  —— Page {pg.pageNumber} ——
                </div>
                {pg.panels.map((panel, idx) => (
                  <div
                    key={panel.id}
                    className="relative border-4 border-white bg-black rounded shadow-2xl overflow-hidden min-h-[300px]"
                  >
                    {panel.imageUrl && (
                      <img
                        src={panel.imageUrl}
                        alt={`Panel ${idx + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    )}
                    {panel.bubbles.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          left: `${b.x}%`,
                          top: `${b.y}%`,
                          color: b.fontColor,
                          backgroundColor: b.bgColor,
                          borderColor: b.borderColor,
                          borderWidth: `${b.borderWidth}px`,
                          fontSize: `${b.fontSize}px`,
                          fontFamily: b.fontFamily,
                        }}
                        className="absolute max-w-[200px] p-2 text-center rounded-2xl border shadow-lg"
                      >
                        {b.speaker && (
                          <div className="text-[9px] font-bold opacity-75">{b.speaker}</div>
                        )}
                        <div>{b.text}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
