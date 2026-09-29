import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  LayoutGrid,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  MessageSquare,
  Image as ImageIcon,
  Sliders,
  Move,
  Settings2,
  FileDown
} from 'lucide-react';
import { ComicPage, ComicPanel, SpeechBubble, PanelLayout } from '../types/comic';
import { sampleImageGallery } from '../data/sampleProject';

interface CanvasWorkbenchProps {
  page: ComicPage;
  selectedPanelId?: string;
  onSelectPanel: (panelId: string) => void;
  onUpdatePanel: (panelId: string, updates: Partial<ComicPanel>) => void;
  onAddBubbleToPanel: (panelId: string, type: SpeechBubble['type']) => void;
  onUpdateBubble: (panelId: string, bubbleId: string, updates: Partial<SpeechBubble>) => void;
  onDeleteBubble: (panelId: string, bubbleId: string) => void;
  onOpenImageLab: (panelId: string) => void;
  onChangeLayout: (layout: PanelLayout) => void;
  onAddNewPanel: () => void;
  onDeletePanel: (panelId: string) => void;
  canvasContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const CanvasWorkbench: React.FC<CanvasWorkbenchProps> = ({
  page,
  selectedPanelId,
  onSelectPanel,
  onUpdatePanel,
  onAddBubbleToPanel,
  onUpdateBubble,
  onDeleteBubble,
  onOpenImageLab,
  onChangeLayout,
  onAddNewPanel,
  onDeletePanel,
  canvasContainerRef,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showBleedGuides, setShowBleedGuides] = useState(true);
  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null);

  // Selected panel object
  const selectedPanel = page.panels.find((p) => p.id === selectedPanelId) || page.panels[0];

  // Helper to determine panel layout CSS grid classes
  const getLayoutClasses = (layout: PanelLayout) => {
    switch (layout) {
      case 'grid-6':
        return 'grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[240px]';
      case 'grid-4':
        return 'grid grid-cols-2 gap-3 auto-rows-[280px]';
      case 'dynamic-3':
        return 'grid grid-cols-3 gap-3 auto-rows-[250px]';
      case 'webtoon-vertical':
        return 'flex flex-col gap-6 max-w-lg mx-auto';
      case 'manga-4koma':
        return 'grid grid-cols-1 gap-3 max-w-md mx-auto auto-rows-[200px]';
      case 'splash-1':
      default:
        return 'grid grid-cols-1 gap-3 min-h-[500px]';
    }
  };

  // Helper for panel individual spans in dynamic-3 layout
  const getPanelSpanClass = (panel: ComicPanel, index: number, layout: PanelLayout) => {
    if (layout === 'dynamic-3') {
      if (index === 0) return 'col-span-3 row-span-1 min-h-[220px]';
      if (index === 1) return 'col-span-1 row-span-1 min-h-[260px]';
      if (index === 2) return 'col-span-2 row-span-1 min-h-[260px]';
    }
    if (layout === 'webtoon-vertical') {
      return 'w-full min-h-[340px]';
    }
    return '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] overflow-hidden select-none">
      {/* Workbench Canvas Toolbar */}
      <div className="h-9 px-3 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between text-xs text-[#cccccc]">
        {/* Left: Layout switcher & panel tools */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1e1e1e] p-0.5 rounded border border-[#3c3c3c]">
            <button
              onClick={() => onChangeLayout('dynamic-3')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                page.layout === 'dynamic-3' ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-white'
              }`}
              title="Dynamic 3-Panel Action Layout"
            >
              Dynamic
            </button>
            <button
              onClick={() => onChangeLayout('grid-4')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                page.layout === 'grid-4' ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-white'
              }`}
              title="Classic 4-Panel Grid"
            >
              4-Grid
            </button>
            <button
              onClick={() => onChangeLayout('grid-6')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                page.layout === 'grid-6' ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-white'
              }`}
              title="Standard 6-Panel Layout"
            >
              6-Grid
            </button>
            <button
              onClick={() => onChangeLayout('webtoon-vertical')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                page.layout === 'webtoon-vertical' ? 'bg-[#007acc] text-white font-medium' : 'text-[#858585] hover:text-white'
              }`}
              title="Webtoon Vertical Scroll"
            >
              Webtoon
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#3e3e3e]" />

          <button
            onClick={onAddNewPanel}
            className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
            title="Add panel to page"
          >
            <Plus className="w-3 h-3 text-[#4ec9b0]" />
            <span>Add Panel</span>
          </button>

          {selectedPanel && (
            <button
              onClick={() => onOpenImageLab(selectedPanel.id)}
              className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
              title="Edit image filters & ink effects in ImageLab"
            >
              <Sparkles className="w-3 h-3 text-[#c586c0]" />
              <span>Image Filters</span>
            </button>
          )}
        </div>

        {/* Right: Zoom & Bleed Guides */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#858585] hover:text-[#cccccc]">
            <input
              type="checkbox"
              checked={showBleedGuides}
              onChange={(e) => setShowBleedGuides(e.target.checked)}
              className="rounded bg-[#2d2d2d] border-[#3e3e3e] text-[#007acc] focus:ring-0"
            />
            <span>Print Trim & Bleed</span>
          </label>

          <div className="h-4 w-[1px] bg-[#3e3e3e]" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] w-9 text-center text-[#cccccc]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
              title="Reset Zoom (100%)"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
        <div
          ref={canvasContainerRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            backgroundColor: page.pageBgColor || '#000000',
          }}
          className={`w-full max-w-[850px] min-h-[1100px] shadow-2xl relative p-6 transition-all ${
            showBleedGuides
              ? 'border-2 border-dashed border-red-500/40 outline outline-4 outline-cyan-500/20'
              : 'border border-[#3c3c3c]'
          }`}
        >
          {/* Safe Margins overlay tag */}
          {showBleedGuides && (
            <div className="absolute top-1 left-2 flex items-center gap-2 text-[9px] font-mono text-red-400 select-none opacity-60">
              <span>BLEED MARGIN (3mm)</span>
              <span>·</span>
              <span className="text-cyan-400">TRIM BOUNDARY</span>
            </div>
          )}

          {/* Panels Grid */}
          <div className={getLayoutClasses(page.layout)}>
            {page.panels.map((panel, idx) => {
              const isSelected = panel.id === selectedPanelId;
              const hasHalftone = panel.filter.halftone;
              const hasNoir = panel.filter.noirThreshold > 0;
              const hasSpeedlines = panel.filter.speedLines;

              return (
                <div
                  key={panel.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPanel(panel.id);
                  }}
                  className={`relative group rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all ${getPanelSpanClass(
                    panel,
                    idx,
                    page.layout
                  )} ${
                    isSelected
                      ? 'ring-2 ring-[#007acc] ring-offset-2 ring-offset-black shadow-lg z-10'
                      : 'hover:ring-1 hover:ring-white/50'
                  }`}
                  style={{
                    backgroundColor: panel.backgroundColor || '#0a0a0a',
                    border: `${panel.borderWidth}px solid ${panel.borderColor || '#ffffff'}`,
                  }}
                >
                  {/* Panel Artwork Image Layer */}
                  {panel.imageUrl ? (
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={panel.imageUrl}
                        alt={`Panel ${idx + 1}`}
                        className={`w-full h-full object-cover select-none transition-all ${
                          hasNoir ? 'contrast-200 grayscale' : ''
                        }`}
                        style={{
                          filter: `
                            brightness(${100 + panel.filter.brightness}%)
                            contrast(${100 + panel.filter.contrast}%)
                            saturate(${100 + panel.filter.saturation}%)
                            sepia(${panel.filter.sepia}%)
                          `,
                          transform: `scale(${panel.imageScale || 1}) translate(${panel.imageOffsetX || 0}px, ${panel.imageOffsetY || 0}px)`,
                        }}
                      />

                      {/* Halftone / Screentone Texture Overlay */}
                      {hasHalftone && (
                        <div
                          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
                          style={{
                            backgroundImage:
                              'radial-gradient(#000000 1.5px, transparent 1.5px)',
                            backgroundSize: `${(panel.filter.halftoneDotSize || 4) * 2}px ${(panel.filter.halftoneDotSize || 4) * 2}px`,
                          }}
                        />
                      )}

                      {/* Action Speedlines Overlay */}
                      {hasSpeedlines && (
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.4)_100%)] opacity-70" />
                      )}
                    </div>
                  ) : (
                    /* Empty panel placeholder */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#151515] text-[#858585] gap-2">
                      <ImageIcon className="w-8 h-8 opacity-40 text-white" />
                      <span className="text-xs font-medium text-[#cccccc]">Empty Comic Panel</span>
                      <span className="text-[10px] text-[#71717a]">
                        Assign art from the Explorer asset drawer or click below
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePanel(panel.id, {
                            imageUrl: sampleImageGallery[idx % sampleImageGallery.length].url,
                          });
                        }}
                        className="px-2 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-[10px] transition-colors"
                      >
                        Assign Sample Artwork
                      </button>
                    </div>
                  )}

                  {/* Panel Header & Badge Overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20 pointer-events-none">
                    <span className="px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded font-bold border border-white/20">
                      P.{idx + 1}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#007acc]/80 text-white text-[9px] font-mono rounded">
                      {panel.shotType}
                    </span>
                  </div>

                  {/* Speech Bubbles on this Panel */}
                  <div className="absolute inset-0 pointer-events-auto overflow-hidden">
                    {panel.bubbles.map((bubble) => {
                      const isBubbleActive = activeBubbleId === bubble.id;

                      return (
                        <div
                          key={bubble.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBubbleId(bubble.id);
                          }}
                          style={{
                            left: `${bubble.x}%`,
                            top: `${bubble.y}%`,
                            color: bubble.fontColor,
                            backgroundColor: bubble.bgColor,
                            borderColor: bubble.borderColor,
                            borderWidth: `${bubble.borderWidth}px`,
                            fontSize: `${bubble.fontSize}px`,
                            fontFamily: bubble.fontFamily,
                          }}
                          className={`absolute max-w-[220px] p-2 text-center transition-shadow shadow-md cursor-move ${
                            bubble.type === 'shout'
                              ? 'clip-starburst font-bold uppercase tracking-wider'
                              : bubble.type === 'thought'
                              ? 'rounded-3xl border-dashed'
                              : bubble.type === 'whisper'
                              ? 'rounded-xl border-dashed opacity-85'
                              : bubble.type === 'caption'
                              ? 'rounded-none font-sans text-left'
                              : bubble.type === 'sfx'
                              ? 'bg-transparent border-none font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                              : 'rounded-2xl border-solid'
                          } ${
                            isBubbleActive
                              ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-black'
                              : ''
                          }`}
                        >
                          {bubble.speaker && (
                            <div className="text-[9px] font-bold uppercase tracking-wider opacity-75 mb-0.5">
                              {bubble.speaker}
                            </div>
                          )}

                          {/* Editable text inline */}
                          <input
                            type="text"
                            value={bubble.text}
                            onChange={(e) => {
                              onUpdateBubble(panel.id, bubble.id, { text: e.target.value });
                            }}
                            className="bg-transparent text-center w-full outline-none border-none font-inherit"
                            style={{ color: bubble.fontColor }}
                          />

                          {/* Tail for speech bubbles */}
                          {bubble.type === 'speech' && (
                            <div
                              className="absolute -bottom-2 left-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]"
                              style={{ borderTopColor: bubble.bgColor }}
                            />
                          )}

                          {/* Active bubble delete affordance */}
                          {isBubbleActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteBubble(panel.id, bubble.id);
                              }}
                              className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                              title="Delete bubble"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Panel Hover Controls Overlay (Bottom Right) */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-1 rounded border border-[#333333]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBubbleToPanel(panel.id, 'speech');
                      }}
                      title="Add Speech Bubble"
                      className="px-1.5 py-0.5 bg-[#2a2d2e] hover:bg-[#007acc] text-white rounded text-[10px]"
                    >
                      + Speech
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBubbleToPanel(panel.id, 'shout');
                      }}
                      title="Add Shout Bubble"
                      className="px-1.5 py-0.5 bg-[#2a2d2e] hover:bg-[#ef4444] text-white rounded text-[10px]"
                    >
                      + Shout
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImageLab(panel.id);
                      }}
                      title="Image Filter Lab"
                      className="p-1 hover:bg-[#333333] rounded text-[#c586c0]"
                    >
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page Footer Issue & Page Number */}
          <div className="mt-8 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>CYBER SAMURAI #01</span>
            <span className="font-bold text-white text-xs">PAGE {page.pageNumber}</span>
            <span>COMICCRAFT STUDIO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
