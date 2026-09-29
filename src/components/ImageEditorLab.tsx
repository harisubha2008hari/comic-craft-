import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Paintbrush,
  RotateCcw,
  Check,
  Download,
  Image as ImageIcon,
  Zap,
  Eye,
  Eraser,
  Sun,
  Contrast,
  CircleDot
} from 'lucide-react';
import { ComicPanel, PanelFilterConfig } from '../types/comic';
import { defaultFilter } from '../data/sampleProject';
import { applyFiltersToCanvas, downloadCanvasAsImage } from '../utils/imageFilters';
import { sampleImageGallery } from '../data/sampleProject';

interface ImageEditorLabProps {
  panel: ComicPanel;
  onSaveFilter: (panelId: string, filter: PanelFilterConfig, newImageUrl?: string) => void;
  onClose: () => void;
}

export const ImageEditorLab: React.FC<ImageEditorLabProps> = ({
  panel,
  onSaveFilter,
  onClose,
}) => {
  const [filterState, setFilterState] = useState<PanelFilterConfig>({
    ...defaultFilter,
    ...panel.filter,
  });

  const [activeImage, setActiveImage] = useState<string>(
    panel.imageUrl || sampleImageGallery[0].url
  );

  // Brush drawing state
  const [brushMode, setBrushMode] = useState<'none' | 'ink' | 'white' | 'accent' | 'eraser'>('none');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawLayerRef = useRef<HTMLCanvasElement>(null);

  // Redraw canvas whenever filterState or activeImage changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeImage;

    img.onload = () => {
      canvas.width = 640;
      canvas.height = 420;

      // Draw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply comic filter pipeline
      applyFiltersToCanvas(ctx, canvas.width, canvas.height, filterState);

      // Overlay user drawing layer if any
      if (drawLayerRef.current) {
        ctx.drawImage(drawLayerRef.current, 0, 0);
      }
    };
  }, [filterState, activeImage]);

  // Preset Filters
  const applyPreset = (preset: 'manga' | 'noir' | 'speedlines' | 'vintage' | 'reset') => {
    switch (preset) {
      case 'manga':
        setFilterState({
          ...defaultFilter,
          halftone: true,
          halftoneDotSize: 4,
          contrast: 25,
          brightness: 5,
        });
        break;
      case 'noir':
        setFilterState({
          ...defaultFilter,
          noirThreshold: 128,
          contrast: 40,
        });
        break;
      case 'speedlines':
        setFilterState({
          ...defaultFilter,
          speedLines: true,
          speedLinesDensity: 55,
          contrast: 15,
          saturation: 10,
        });
        break;
      case 'vintage':
        setFilterState({
          ...defaultFilter,
          sepia: 45,
          contrast: 15,
          brightness: -5,
        });
        break;
      case 'reset':
      default:
        setFilterState({ ...defaultFilter });
        break;
    }
  };

  // Drawing Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (brushMode === 'none') return;
    setIsDrawing(true);
    draw(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || brushMode === 'none') return;
    draw(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brushMode === 'ink') {
      ctx.strokeStyle = '#000000';
    } else if (brushMode === 'white') {
      ctx.strokeStyle = '#ffffff';
    } else if (brushMode === 'accent') {
      ctx.strokeStyle = '#00f2fe';
    } else if (brushMode === 'eraser') {
      // Draw with source image sampling or transparent
      ctx.strokeStyle = '#ffffff';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleApplyToPanel = () => {
    onSaveFilter(panel.id, filterState, activeImage);
    onClose();
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasAsImage(canvasRef.current, `panel-${panel.order}-filtered.png`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-9 px-4 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between text-xs text-[#cccccc]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c586c0]" />
          <span className="font-semibold text-white">Integrated Image Lab</span>
          <span className="text-[#858585]">· Editing Panel {panel.order} ({panel.shotType})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-2.5 py-1 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={handleApplyToPanel}
            className="px-3 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded flex items-center gap-1.5 transition-colors font-medium shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to Panel</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#111111] overflow-auto">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mb-4 bg-[#1e1e1e] p-1 rounded-lg border border-[#333333]">
            <span className="text-[11px] text-[#858585] px-2 font-medium">Presets:</span>
            <button
              onClick={() => applyPreset('manga')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterState.halftone ? 'bg-[#007acc] text-white font-medium' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Manga Screentone
            </button>
            <button
              onClick={() => applyPreset('noir')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterState.noirThreshold > 0 ? 'bg-[#007acc] text-white font-medium' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Sin City Noir
            </button>
            <button
              onClick={() => applyPreset('speedlines')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterState.speedLines ? 'bg-[#007acc] text-white font-medium' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Speed-Lines Burst
            </button>
            <button
              onClick={() => applyPreset('vintage')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterState.sepia > 0 ? 'bg-[#007acc] text-white font-medium' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Pulp Vintage
            </button>
            <button
              onClick={() => applyPreset('reset')}
              className="px-2 py-1 rounded text-[11px] text-[#858585] hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Canvas */}
          <div className="relative border-4 border-white shadow-2xl rounded-sm overflow-hidden bg-black max-w-full">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`cursor-${brushMode !== 'none' ? 'crosshair' : 'default'} max-w-full h-auto`}
            />

            {/* Inking brush active banner */}
            {brushMode !== 'none' && (
              <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-400">
                Ink Brush Active: {brushMode} ({brushSize}px)
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#71717a] mt-3 font-mono">
            Output resolution: 640 × 420 px · 300 DPI CMYK Emulation
          </div>
        </div>

        {/* Right Tools & Parameters Drawer */}
        <div className="w-80 bg-[#1e1e1e] border-l border-[#2d2d2d] flex flex-col p-4 overflow-y-auto custom-scrollbar text-xs text-[#cccccc] space-y-5">
          {/* Section: Artwork Selector */}
          <div>
            <div className="font-semibold text-white mb-2 flex items-center gap-1.5 text-[11px]">
              <ImageIcon className="w-3.5 h-3.5 text-[#4ec9b0]" />
              <span>SOURCE ARTWORK</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sampleImageGallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`p-1 rounded cursor-pointer border transition-all ${
                    activeImage === img.url
                      ? 'border-[#007acc] ring-2 ring-[#007acc]/40'
                      : 'border-[#333333] hover:border-[#555555]'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-14 object-cover rounded" />
                  <div className="text-[10px] text-[#cccccc] truncate mt-1">{img.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Comic Screentone / Halftone */}
          <div className="p-3 bg-[#252526] rounded border border-[#333333] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.halftone}
                  onChange={(e) =>
                    setFilterState((prev) => ({ ...prev, halftone: e.target.checked }))
                  }
                  className="rounded bg-[#1e1e1e] border-[#444] text-[#007acc] focus:ring-0"
                />
                <span>Manga Screentone / Halftone</span>
              </label>
              {filterState.halftone && (
                <span className="text-[10px] text-[#e5c07b] font-mono">
                  {filterState.halftoneDotSize}px dots
                </span>
              )}
            </div>

            {filterState.halftone && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#858585]">
                  <span>Dot Raster Pitch</span>
                  <span>{filterState.halftoneDotSize}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={filterState.halftoneDotSize}
                  onChange={(e) =>
                    setFilterState((prev) => ({
                      ...prev,
                      halftoneDotSize: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-[#007acc]"
                />
              </div>
            )}
          </div>

          {/* Section: High-Contrast Noir Threshold */}
          <div className="p-3 bg-[#252526] rounded border border-[#333333] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Sin City Noir Threshold</span>
              <span className="text-[10px] font-mono text-[#4ec9b0]">
                {filterState.noirThreshold === 0 ? 'OFF' : filterState.noirThreshold}
              </span>
            </div>
            <p className="text-[10px] text-[#858585]">
              Converts color artwork into stark graphic novel black & white ink.
            </p>
            <input
              type="range"
              min="0"
              max="240"
              value={filterState.noirThreshold}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  noirThreshold: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-[#007acc]"
            />
          </div>

          {/* Section: Action Speed Lines */}
          <div className="p-3 bg-[#252526] rounded border border-[#333333] space-y-2">
            <label className="font-semibold text-white flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filterState.speedLines}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, speedLines: e.target.checked }))
                }
                className="rounded bg-[#1e1e1e] border-[#444] text-[#007acc] focus:ring-0"
              />
              <span>Action Speed-Lines Burst</span>
            </label>

            {filterState.speedLines && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#858585]">
                  <span>Burst Density</span>
                  <span>{filterState.speedLinesDensity} lines</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={filterState.speedLinesDensity}
                  onChange={(e) =>
                    setFilterState((prev) => ({
                      ...prev,
                      speedLinesDensity: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-[#007acc]"
                />
              </div>
            )}
          </div>

          {/* Section: Tone & Color Adjustments */}
          <div className="p-3 bg-[#252526] rounded border border-[#333333] space-y-3">
            <div className="font-semibold text-white flex items-center gap-1 text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-[#9cdcfe]" />
              <span>COLOR & EXPOSURE</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#858585]">
                <span>Brightness</span>
                <span>{filterState.brightness}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={filterState.brightness}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, brightness: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-[#007acc]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#858585]">
                <span>Contrast</span>
                <span>{filterState.contrast}%</span>
              </div>
              <input
                type="range"
                min="-40"
                max="80"
                value={filterState.contrast}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, contrast: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-[#007acc]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#858585]">
                <span>Sepia (Vintage Paper)</span>
                <span>{filterState.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filterState.sepia}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, sepia: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-[#007acc]"
              />
            </div>
          </div>

          {/* Section: Inking & Touch-up Brush */}
          <div className="p-3 bg-[#252526] rounded border border-[#333333] space-y-2.5">
            <div className="font-semibold text-white flex items-center gap-1 text-[11px]">
              <Paintbrush className="w-3.5 h-3.5 text-[#ce9178]" />
              <span>INKING & TOUCH-UP BRUSH</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBrushMode(brushMode === 'ink' ? 'none' : 'ink')}
                className={`flex-1 py-1 rounded text-[10px] transition-colors border ${
                  brushMode === 'ink'
                    ? 'bg-black text-white border-white'
                    : 'bg-[#1e1e1e] text-[#ccc] border-[#333]'
                }`}
              >
                ● Black Ink
              </button>
              <button
                onClick={() => setBrushMode(brushMode === 'white' ? 'none' : 'white')}
                className={`flex-1 py-1 rounded text-[10px] transition-colors border ${
                  brushMode === 'white'
                    ? 'bg-white text-black border-cyan-400 font-bold'
                    : 'bg-[#1e1e1e] text-[#ccc] border-[#333]'
                }`}
              >
                ○ White Highlight
              </button>
              <button
                onClick={() => setBrushMode(brushMode === 'accent' ? 'none' : 'accent')}
                className={`flex-1 py-1 rounded text-[10px] transition-colors border ${
                  brushMode === 'accent'
                    ? 'bg-cyan-500 text-black font-bold border-white'
                    : 'bg-[#1e1e1e] text-[#ccc] border-[#333]'
                }`}
              >
                ⚡ Cyan Neon
              </button>
            </div>

            {brushMode !== 'none' && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-[#858585]">
                  <span>Brush Width</span>
                  <span>{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                  className="w-full accent-[#007acc]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
