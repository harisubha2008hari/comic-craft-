import React, { useState, useEffect } from 'react';
import {
  Search,
  FileCode,
  LayoutGrid,
  Sparkles,
  MessageSquare,
  Download,
  BookOpen,
  Plus,
  RefreshCw,
  Terminal,
  Columns
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (commandId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  icon: React.ReactNode;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onExecute,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'sync-script',
      title: 'ComicCraft: Sync Script to Visual Canvas Panels',
      category: 'Script',
      shortcut: 'Ctrl+Shift+U',
      icon: <RefreshCw className="w-4 h-4 text-[#4ec9b0]" />,
    },
    {
      id: 'toggle-split',
      title: 'View: Toggle Split Editor (Script + Visual Canvas)',
      category: 'View',
      shortcut: 'Alt+\\',
      icon: <Columns className="w-4 h-4 text-[#007acc]" />,
    },
    {
      id: 'open-reader',
      title: 'ComicCraft: Launch Fullscreen Comic Reader Preview',
      category: 'Preview',
      shortcut: 'F5',
      icon: <BookOpen className="w-4 h-4 text-[#e5c07b]" />,
    },
    {
      id: 'export-png',
      title: 'ComicCraft: Export Current Page to High-Res PNG',
      category: 'Export',
      shortcut: 'Ctrl+Shift+E',
      icon: <Download className="w-4 h-4 text-[#9cdcfe]" />,
    },
    {
      id: 'open-image-lab',
      title: 'ImageLab: Open Integrated Comic Filter & Ink Studio',
      category: 'ImageLab',
      icon: <Sparkles className="w-4 h-4 text-[#c586c0]" />,
    },
    {
      id: 'apply-halftone',
      title: 'Filter: Toggle Manga Screentone / Halftone Dots on Selected Panel',
      category: 'Filter',
      icon: <Sparkles className="w-4 h-4 text-[#ce9178]" />,
    },
    {
      id: 'apply-speedlines',
      title: 'Filter: Generate Action Speed-Lines Burst on Selected Panel',
      category: 'Filter',
      icon: <Sparkles className="w-4 h-4 text-[#dcdcaa]" />,
    },
    {
      id: 'add-panel',
      title: 'Panel: Insert New Comic Panel on Current Page',
      category: 'Panel',
      shortcut: 'Ctrl+N',
      icon: <Plus className="w-4 h-4 text-[#4ec9b0]" />,
    },
    {
      id: 'add-page',
      title: 'Project: Create New Comic Page',
      category: 'Page',
      icon: <Plus className="w-4 h-4 text-[#007acc]" />,
    },
    {
      id: 'layout-webtoon',
      title: 'Layout: Switch Page to Webtoon Vertical Scroll Format',
      category: 'Layout',
      icon: <LayoutGrid className="w-4 h-4 text-[#569cd6]" />,
    },
    {
      id: 'layout-grid6',
      title: 'Layout: Switch Page to Classic 6-Panel Grid',
      category: 'Layout',
      icon: <LayoutGrid className="w-4 h-4 text-[#569cd6]" />,
    },
    {
      id: 'layout-dynamic',
      title: 'Layout: Switch Page to Dynamic Action 3-Panel',
      category: 'Layout',
      icon: <LayoutGrid className="w-4 h-4 text-[#569cd6]" />,
    },
    {
      id: 'add-shout-bubble',
      title: 'Bubble: Insert Action Scream Bubble ("SHOUT!")',
      category: 'Typography',
      icon: <MessageSquare className="w-4 h-4 text-[#ef4444]" />,
    },
    {
      id: 'add-speech-bubble',
      title: 'Bubble: Insert Standard Speech Bubble',
      category: 'Typography',
      icon: <MessageSquare className="w-4 h-4 text-[#ffffff]" />,
    },
    {
      id: 'view-terminal',
      title: 'Terminal: Open Integrated ComicCraft CLI',
      category: 'Terminal',
      shortcut: 'Ctrl+`',
      icon: <Terminal className="w-4 h-4 text-[#4ec9b0]" />,
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onExecute(filtered[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onExecute]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16 px-4 animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#252526] rounded-lg shadow-2xl border border-[#3c3c3c] overflow-hidden text-xs select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input field */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#333333] bg-[#1e1e1e]">
          <span className="text-[#007acc] font-bold text-sm">&gt;</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action..."
            className="flex-1 bg-transparent text-[#ffffff] outline-none text-sm placeholder-[#666666]"
          />
          <kbd className="px-1.5 py-0.5 bg-[#2d2d2d] rounded border border-[#3e3e3e] text-[10px] text-[#888888] font-mono">
            ESC to close
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[#858585]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onExecute(cmd.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#094771] text-white'
                      : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {cmd.icon}
                    <span className="truncate">{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="ml-3 px-1.5 py-0.5 bg-[#1e1e1e] border border-[#3e3e3e] rounded text-[10px] text-[#888888] font-mono shrink-0">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
