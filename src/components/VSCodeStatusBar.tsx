import React from 'react';
import {
  GitBranch,
  AlertTriangle,
  Info,
  Check,
  Maximize2,
  Bell,
  Layers,
  Sparkles,
  FileCode
} from 'lucide-react';
import { ScriptIssue } from '../types/comic';

interface VSCodeStatusBarProps {
  activePageNumber: number;
  totalPages: number;
  totalPanelsOnPage: number;
  activeShotType?: string;
  scriptIssues: ScriptIssue[];
  wordCount: number;
  onToggleBottomDrawer: () => void;
  isBottomDrawerOpen: boolean;
  onOpenReaderModal: () => void;
}

export const VSCodeStatusBar: React.FC<VSCodeStatusBarProps> = ({
  activePageNumber,
  totalPages,
  totalPanelsOnPage,
  activeShotType = 'MEDIUM SHOT',
  scriptIssues,
  wordCount,
  onToggleBottomDrawer,
  isBottomDrawerOpen,
  onOpenReaderModal,
}) => {
  const errorCount = scriptIssues.filter((i) => i.type === 'error').length;
  const warningCount = scriptIssues.filter((i) => i.type === 'warning').length;

  return (
    <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] select-none font-sans z-30 shrink-0">
      {/* Left Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Git Branch */}
        <div className="flex items-center gap-1 hover:bg-[#005a9e] px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          <GitBranch className="w-3 h-3" />
          <span className="font-mono text-[10px]">main*</span>
        </div>

        {/* Diagnostics Button (Toggles bottom problems panel) */}
        <button
          onClick={onToggleBottomDrawer}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
            isBottomDrawerOpen ? 'bg-[#005a9e]' : 'hover:bg-[#005a9e]'
          }`}
          title="Toggle Problems & Script Linter"
        >
          {errorCount > 0 ? (
            <span className="flex items-center gap-0.5 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {errorCount}
            </span>
          ) : null}
          <span className="flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3 text-yellow-200" />
            <span className="font-mono text-[10px]">{warningCount}</span>
          </span>
          <span className="hidden sm:inline text-[10px] text-blue-100">Script Linter</span>
        </button>

        {/* Page & Panel Indicators */}
        <div className="hidden md:flex items-center gap-2 text-blue-100 border-l border-white/20 pl-2">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Page {activePageNumber}/{totalPages}</span>
          </span>
          <span>·</span>
          <span>{totalPanelsOnPage} Panels</span>
          <span>·</span>
          <span className="bg-white/20 px-1 rounded text-[10px] font-mono text-white">
            {activeShotType}
          </span>
        </div>
      </div>

      {/* Right Status Indicators */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-blue-100 font-mono text-[10px]">
          {wordCount} words
        </span>

        <span className="hidden lg:inline text-blue-100 border-l border-white/20 pl-2">
          300 DPI CMYK Ready
        </span>

        <span className="hidden md:inline text-blue-100 font-mono text-[10px]">
          UTF-8
        </span>

        <div
          onClick={onOpenReaderModal}
          className="flex items-center gap-1 hover:bg-[#005a9e] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title="Fullscreen Comic Reader"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline text-[10px]">Reader</span>
        </div>

        <div className="flex items-center gap-1 hover:bg-[#005a9e] px-1 py-0.5 rounded cursor-pointer">
          <FileCode className="w-3 h-3" />
          <span className="text-[10px]">ComicScript</span>
        </div>

        <button className="hover:bg-[#005a9e] p-0.5 rounded transition-colors" title="Notifications">
          <Bell className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};
