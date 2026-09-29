import React from 'react';
import {
  Files,
  FileText,
  LayoutGrid,
  Sparkles,
  MessageSquare,
  Users,
  Download,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ActiveView } from '../types/comic';

interface VSCodeActivityBarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  scriptIssueCount: number;
}

export const VSCodeActivityBar: React.FC<VSCodeActivityBarProps> = ({
  activeView,
  onSelectView,
  scriptIssueCount,
}) => {
  const topNavItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'explorer',
      label: 'Explorer (Ctrl+Shift+E)',
      icon: <Files className="w-5 h-5" />,
    },
    {
      id: 'script',
      label: 'Comic Script Organizer (Ctrl+Shift+S)',
      icon: <FileText className="w-5 h-5" />,
      badge: scriptIssueCount > 0 ? scriptIssueCount : undefined,
    },
    {
      id: 'canvas',
      label: 'Panel & Page Canvas (Ctrl+Shift+C)',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'image-editor',
      label: 'Integrated Image Lab (Halftone, Noir, Speedlines)',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'bubbles',
      label: 'Balloon & SFX Styler',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'characters',
      label: 'Character Roster & Cast Bible',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'export',
      label: 'Export & Comic Publishing',
      icon: <Download className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-12 bg-[#333333] border-r border-[#252526] flex flex-col justify-between items-center py-2 select-none z-20 shrink-0">
      {/* Top Navigation Group */}
      <div className="flex flex-col items-center gap-1 w-full">
        {topNavItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={item.label}
              className={`relative w-full h-11 flex items-center justify-center transition-colors cursor-pointer group ${
                isActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {/* Active Indicator Bar on left */}
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#007acc] rounded-r" />
              )}
              {item.icon}

              {/* Badge for diagnostic warnings */}
              {item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 bg-[#007acc] text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 text-center leading-3.5">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Icons (Settings, Help) */}
      <div className="flex flex-col items-center gap-1 w-full text-[#858585]">
        <button
          onClick={() => onSelectView('export')}
          title="Studio Preferences"
          className="w-full h-10 flex items-center justify-center hover:text-[#cccccc] transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            alert('ComicCraft Studio v1.0.4\nVS Code-inspired Comic & Manga IDE.\n\nShortcuts:\n⌘K / Ctrl+K : Command Palette\nCtrl+B : Toggle Sidebar\nCtrl+` : Toggle Terminal\nSync button in Script: Updates visual panels automatically.');
          }}
          title="Documentation & Shortcuts"
          className="w-full h-10 flex items-center justify-center hover:text-[#cccccc] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
