import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Info,
  Terminal,
  Activity,
  BarChart2,
  CheckCircle2,
  Trash2,
  Send
} from 'lucide-react';
import { ScriptIssue } from '../types/comic';
import { ScriptStats } from '../utils/scriptParser';

interface VSCodeBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scriptIssues: ScriptIssue[];
  scriptStats: ScriptStats;
  onJumpToScriptLine?: (line: number) => void;
  onRunTerminalCommand: (command: string) => void;
  terminalLogs: string[];
  onClearTerminal: () => void;
}

export const VSCodeBottomDrawer: React.FC<VSCodeBottomDrawerProps> = ({
  isOpen,
  onClose,
  scriptIssues,
  scriptStats,
  onJumpToScriptLine,
  onRunTerminalCommand,
  terminalLogs,
  onClearTerminal,
}) => {
  const [activeTab, setActiveTab] = useState<'problems' | 'output' | 'stats' | 'terminal'>('problems');
  const [cliInput, setCliInput] = useState('');

  if (!isOpen) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    onRunTerminalCommand(cliInput.trim());
    setCliInput('');
  };

  return (
    <div className="h-48 bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col text-xs text-[#cccccc] select-none shrink-0 z-20">
      {/* Tabs Header */}
      <div className="h-8 px-3 bg-[#252526] border-b border-[#2b2b2b] flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-1.5 py-1 uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'text-white border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <span>Problems</span>
            <span className="px-1.5 py-0.2 bg-[#333333] rounded-full text-[10px] text-[#9cdcfe]">
              {scriptIssues.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 py-1 uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'text-white border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Pacing & Shots</span>
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 py-1 uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'output'
                ? 'text-white border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 py-1 uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? 'text-white border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
        </div>

        {/* Right Tab Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'terminal' && (
            <button
              onClick={onClearTerminal}
              title="Clear Terminal"
              className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px]">
        {/* Problems Tab */}
        {activeTab === 'problems' && (
          <div className="space-y-1">
            {scriptIssues.length === 0 ? (
              <div className="flex items-center gap-2 text-[#4ec9b0] py-3 px-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>No script syntax or pacing errors detected. Ready for publishing!</span>
              </div>
            ) : (
              scriptIssues.map((issue, idx) => (
                <div
                  key={idx}
                  onClick={() => onJumpToScriptLine && onJumpToScriptLine(issue.line)}
                  className="flex items-start gap-2 p-1.5 rounded hover:bg-[#2a2d2e] cursor-pointer transition-colors"
                >
                  {issue.type === 'error' ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✕
                    </span>
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="text-[#cccccc]">{issue.message}</span>
                    <span className="text-[#858585] ml-2 text-[10px]">
                      [script.comicscript: line {issue.line}]
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats & Pacing Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-sans">
            <div className="bg-[#252526] p-2.5 rounded border border-[#333333]">
              <div className="text-[#858585] text-[10px] uppercase font-semibold mb-1">
                Comic Metrics
              </div>
              <div className="text-lg font-bold text-white font-mono">{scriptStats.totalWords} words</div>
              <div className="text-[11px] text-[#9cdcfe]">
                {scriptStats.totalPages} pages · {scriptStats.totalPanels} panels
              </div>
              <div className="text-[10px] text-[#858585] mt-1">
                Avg dialogue: ~{scriptStats.averageDialogueLength} words / balloon
              </div>
            </div>

            <div className="bg-[#252526] p-2.5 rounded border border-[#333333]">
              <div className="text-[#858585] text-[10px] uppercase font-semibold mb-1">
                Shot Variety Distribution
              </div>
              <div className="space-y-1">
                {Object.entries(scriptStats.shotDistribution).map(([shot, count]) => (
                  <div key={shot} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#cccccc] font-mono text-[10px]">{shot}:</span>
                    <span className="text-[#4ec9b0] font-bold font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#252526] p-2.5 rounded border border-[#333333]">
              <div className="text-[#858585] text-[10px] uppercase font-semibold mb-1">
                Character Speaking Lines
              </div>
              <div className="space-y-1">
                {Object.entries(scriptStats.characterDialogueCounts).map(([char, count]) => (
                  <div key={char} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#dcdcaa] font-semibold">{char}:</span>
                    <span className="text-white font-bold font-mono">{count} lines</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="space-y-1 text-[#858585]">
            <div>[ComicCraft Build Engine] Initialized 300 DPI rasterizer...</div>
            <div>[Screentone] Halftone dot shader matrix ready.</div>
            <div>[Speech Bubbles] SVG dynamic vector tails compiled.</div>
            <div className="text-[#4ec9b0]">[Script Parser] Sync state: OK (0 parse errors).</div>
          </div>
        )}

        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-1 overflow-y-auto mb-2 text-[#cccccc]">
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1 border-t border-[#2b2b2b]">
              <span className="text-[#4ec9b0] font-bold">comiccraft $</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="Type 'help', 'build', 'lint', 'export --webtoon'..."
                className="flex-1 bg-transparent text-white outline-none border-none text-[11px] font-mono"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-[#007acc] text-white rounded text-[10px] hover:bg-[#0062a3]"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
