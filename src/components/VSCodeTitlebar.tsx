import React from 'react';
import {
  Search,
  Layout,
  PanelBottom,
  BookOpen,
  Columns,
  Share2,
  Minimize2,
  Square,
  X,
  Play
} from 'lucide-react';

interface VSCodeTitlebarProps {
  projectTitle: string;
  activeFileName: string;
  isDirty?: boolean;
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  onToggleBottomDrawer: () => void;
  onToggleSplitView: () => void;
  isSplitView: boolean;
  onOpenReaderModal: () => void;
  onExportPage: () => void;
}

export const VSCodeTitlebar: React.FC<VSCodeTitlebarProps> = ({
  projectTitle,
  activeFileName,
  isDirty = false,
  onOpenCommandPalette,
  onToggleSidebar,
  onToggleBottomDrawer,
  onToggleSplitView,
  isSplitView,
  onOpenReaderModal,
  onExportPage,
}) => {
  return (
    <header className="h-9 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center justify-between px-3 select-none text-xs text-[#cccccc] shrink-0 z-30">
      {/* Left: Window Controls / App Identity & Menu */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity" title="Close" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition-opacity" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity" title="Maximize" />
        </div>

        <div className="flex items-center gap-1 font-semibold text-[#007acc] text-xs">
          <span className="font-mono text-[13px] tracking-tight text-white flex items-center gap-1">
            <span className="text-[#007acc] font-black">⚡</span> ComicCraft
          </span>
          <span className="text-[#6e7681] text-[11px] ml-1">IDE</span>
        </div>

        {/* Menu Items */}
        <nav className="hidden lg:flex items-center gap-1 text-[#b5b5b5] text-[11px]">
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">File</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">Edit</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">Script</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">Panel</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">ImageLab</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">Terminal</span>
          <span className="px-1.5 py-0.5 rounded hover:bg-[#333333] cursor-pointer transition-colors">Help</span>
        </nav>
      </div>

      {/* Center: Command Palette / File Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-6 px-3 bg-[#2a2d2e] hover:bg-[#323638] text-[#8c8c8c] hover:text-[#cccccc] rounded border border-[#3c3c3c] flex items-center justify-between text-[11px] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#007acc]" />
            <span className="truncate">
              {projectTitle} — <span className="text-[#dcdcaa]">{activeFileName}</span>
              {isDirty && <span className="text-white ml-1">●</span>}
            </span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-[#1e1e1e] border border-[#3e3e3e] rounded text-[10px] text-[#737373] font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleSplitView}
          title={isSplitView ? 'Single Editor View' : 'Split Editor (Script + Canvas)'}
          className={`p-1.5 rounded transition-colors ${
            isSplitView ? 'bg-[#007acc]/20 text-[#007acc]' : 'text-[#8c8c8c] hover:bg-[#333333] hover:text-[#cccccc]'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleSidebar}
          title="Toggle Primary Sidebar (Ctrl+B)"
          className="p-1.5 rounded text-[#8c8c8c] hover:bg-[#333333] hover:text-[#cccccc] transition-colors"
        >
          <Layout className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleBottomDrawer}
          title="Toggle Panel Drawer (Ctrl+`)"
          className="p-1.5 rounded text-[#8c8c8c] hover:bg-[#333333] hover:text-[#cccccc] transition-colors"
        >
          <PanelBottom className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#333333] mx-1" />

        <button
          onClick={onOpenReaderModal}
          title="Launch Comic Reader (Full Preview)"
          className="px-2 py-1 bg-[#2a2d2e] hover:bg-[#007acc] text-[#cccccc] hover:text-white rounded border border-[#3e3e3e] hover:border-[#007acc] flex items-center gap-1.5 transition-all text-[11px] font-medium"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={onExportPage}
          title="Export Comic Page"
          className="px-2.5 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded flex items-center gap-1.5 transition-colors text-[11px] font-medium shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export PNG</span>
        </button>
      </div>
    </header>
  );
};
