import React, { useState } from 'react';
import {
  Download,
  Share2,
  FileCode,
  Layers,
  Settings,
  Printer,
  Upload,
  Check,
  BookOpen
} from 'lucide-react';
import { ComicProject } from '../types/comic';

interface ExportWorkbenchProps {
  project: ComicProject;
  onUpdateProjectMeta: (updates: Partial<ComicProject>) => void;
  onExportPagePNG: () => void;
  onExportProjectJSON: () => void;
  onImportProjectJSON: (jsonStr: string) => void;
  onOpenReaderModal: () => void;
}

export const ExportWorkbench: React.FC<ExportWorkbenchProps> = ({
  project,
  onUpdateProjectMeta,
  onExportPagePNG,
  onExportProjectJSON,
  onImportProjectJSON,
  onOpenReaderModal,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImportSubmit = () => {
    try {
      onImportProjectJSON(jsonInput);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2500);
    } catch (e) {
      alert('Invalid ComicCraft Project JSON file.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] p-6 text-[#cccccc] text-xs select-none overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="border-b border-[#2d2d2d] pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-[#007acc]" />
            <span>Comic Publishing & Studio Export Hub</span>
          </h2>
          <p className="text-[11px] text-[#858585] mt-1">
            Export comic assets, print-ready pages at 300 DPI, screenplay files, or backup your studio project.
          </p>
        </div>

        {/* Export Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: High-Res PNG */}
          <div className="bg-[#252526] p-4 rounded-lg border border-[#333333] flex flex-col justify-between hover:border-[#007acc] transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-[#007acc]/20 text-[#007acc] flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Export High-Res PNG</h3>
              <p className="text-[11px] text-[#858585] mt-1">
                Renders active page panels, speech bubbles, and custom screentones into a lossless PNG image.
              </p>
            </div>
            <button
              onClick={onExportPagePNG}
              className="mt-4 w-full py-2 bg-[#007acc] hover:bg-[#0062a3] text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Active Page</span>
            </button>
          </div>

          {/* Card 2: Interactive Reader Preview */}
          <div className="bg-[#252526] p-4 rounded-lg border border-[#333333] flex flex-col justify-between hover:border-[#4ec9b0] transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-[#4ec9b0]/20 text-[#4ec9b0] flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Interactive Reader</h3>
              <p className="text-[11px] text-[#858585] mt-1">
                Full-screen reading experience with page flip simulation or continuous vertical Webtoon scroll.
              </p>
            </div>
            <button
              onClick={onOpenReaderModal}
              className="mt-4 w-full py-2 bg-[#2d2d2d] hover:bg-[#383838] text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#3e3e3e]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4ec9b0]" />
              <span>Launch Reader Mode</span>
            </button>
          </div>

          {/* Card 3: Project Backup JSON */}
          <div className="bg-[#252526] p-4 rounded-lg border border-[#333333] flex flex-col justify-between hover:border-[#e5c07b] transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-[#e5c07b]/20 text-[#e5c07b] flex items-center justify-center mb-3">
                <FileCode className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Project Workspace JSON</h3>
              <p className="text-[11px] text-[#858585] mt-1">
                Save complete workspace state including chapters, scripts, panel dimensions, and filters.
              </p>
            </div>
            <button
              onClick={onExportProjectJSON}
              className="mt-4 w-full py-2 bg-[#2d2d2d] hover:bg-[#383838] text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#3e3e3e]"
            >
              <Download className="w-3.5 h-3.5 text-[#e5c07b]" />
              <span>Export Project (.json)</span>
            </button>
          </div>
        </div>

        {/* Project Metadata Settings */}
        <div className="bg-[#252526] p-5 rounded-lg border border-[#333333] space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#9cdcfe]" />
            <span>Comic Title & Metadata</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Comic Book Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => onUpdateProjectMeta({ title: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-white outline-none focus:border-[#007acc]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Creator / Writer / Studio</label>
              <input
                type="text"
                value={project.author}
                onChange={(e) => onUpdateProjectMeta({ author: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-white outline-none focus:border-[#007acc]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Genre</label>
              <input
                type="text"
                value={project.genre}
                onChange={(e) => onUpdateProjectMeta({ genre: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-white outline-none focus:border-[#007acc]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Print Resolution Target</label>
              <select
                value={project.resolutionDPI}
                onChange={(e) => onUpdateProjectMeta({ resolutionDPI: parseInt(e.target.value, 10) })}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-white outline-none text-xs"
              >
                <option value={300}>300 DPI (Standard Print Graphic Novel)</option>
                <option value={600}>600 DPI (Manga Black & White Master)</option>
                <option value={150}>150 DPI (Web & Screen Optimized)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Import / Restore */}
        <div className="bg-[#252526] p-5 rounded-lg border border-[#333333] space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-[#4ec9b0]" />
            <span>Restore / Import Project JSON</span>
          </h3>
          <p className="text-[11px] text-[#858585]">
            Paste project JSON data below to load a saved comic creation session.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={3}
            placeholder="Paste ComicCraft JSON here..."
            className="w-full p-2.5 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-white font-mono text-[11px] outline-none"
          />
          <div className="flex justify-end gap-2">
            {importSuccess && (
              <span className="text-[#4ec9b0] text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Project loaded successfully!
              </span>
            )}
            <button
              onClick={handleImportSubmit}
              disabled={!jsonInput.trim()}
              className="px-4 py-1.5 bg-[#2d2d2d] hover:bg-[#383838] disabled:opacity-30 text-white rounded text-xs transition-colors border border-[#444]"
            >
              Load Project JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
