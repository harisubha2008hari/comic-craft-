import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  Download,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  MessageSquare,
  Volume2,
  Bookmark,
  Camera
} from 'lucide-react';
import { ScriptIssue } from '../types/comic';

interface ScriptEditorProps {
  scriptContent: string;
  onChangeScript: (content: string) => void;
  onSyncToCanvas: () => void;
  issues: ScriptIssue[];
  activeLine?: number;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  scriptContent,
  onChangeScript,
  onSyncToCanvas,
  issues,
  activeLine,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHelperMenu, setShowHelperMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = scriptContent.split('\n');

  // Insert snippet helper into textarea
  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent =
      scriptContent.substring(0, start) + '\n' + snippet + '\n' + scriptContent.substring(end);
    onChangeScript(newContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + snippet.length + 2;
        textareaRef.current.selectionEnd = start + snippet.length + 2;
      }
    }, 50);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportScript = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyber_samurai_script.comicscript';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden select-none">
      {/* Script Toolbar */}
      <div className="h-9 px-3 bg-[#252526] border-b border-[#2d2d2d] flex items-center justify-between text-xs text-[#cccccc]">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSyncToCanvas}
            title="Parse script and automatically sync / update visual panels on canvas"
            className="px-2.5 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded flex items-center gap-1.5 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Canvas</span>
          </button>

          <div className="h-4 w-[1px] bg-[#3e3e3e] mx-1" />

          {/* Quick Insert Snippet Buttons */}
          <button
            onClick={() => insertSnippet('=== PAGE ' + (lines.filter((l) => l.includes('PAGE')).length + 1) + ' ===\n')}
            className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
            title="Insert new Page header"
          >
            <Bookmark className="w-3 h-3 text-[#569cd6]" />
            <span>+ Page</span>
          </button>

          <button
            onClick={() => insertSnippet('PANEL 1 [WIDE SHOT]\nDescription of the setting...\nKAI: "Dialogue goes here."')}
            className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
            title="Insert new Panel template"
          >
            <Camera className="w-3 h-3 text-[#4ec9b0]" />
            <span>+ Panel</span>
          </button>

          <button
            onClick={() => insertSnippet('HERO: "We have to break through their firewall before dawn!"')}
            className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
            title="Insert Character dialogue"
          >
            <MessageSquare className="w-3 h-3 text-[#dcdcaa]" />
            <span>+ Dialogue</span>
          </button>

          <button
            onClick={() => insertSnippet('[SFX: KRAKK-BOOOM!!]')}
            className="px-2 py-0.5 bg-[#2d2d2d] hover:bg-[#383838] rounded text-[#cccccc] hover:text-white flex items-center gap-1 text-[11px]"
            title="Insert Sound Effect"
          >
            <Volume2 className="w-3 h-3 text-[#c586c0]" />
            <span>+ SFX</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc] transition-colors"
            title="Copy script to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleExportScript}
            className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc] transition-colors"
            title="Export Script as .comicscript"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Line Numbers Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Column */}
        <div className="w-12 bg-[#1e1e1e] border-r border-[#2b2b2b] pt-3 text-right pr-2 select-none text-[#858585] font-mono text-[11px] leading-5 shrink-0 overflow-hidden">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const hasError = issues.some((i) => i.line === lineNum && i.type === 'error');
            const hasWarning = issues.some((i) => i.line === lineNum && i.type === 'warning');
            const isTarget = activeLine === lineNum;

            return (
              <div
                key={lineNum}
                className={`flex items-center justify-end gap-1 ${
                  isTarget ? 'bg-[#094771] text-white font-bold' : ''
                }`}
              >
                {hasError ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                ) : hasWarning ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                ) : null}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Main Textarea */}
        <div className="flex-1 relative overflow-auto bg-[#1e1e1e]">
          <textarea
            ref={textareaRef}
            value={scriptContent}
            onChange={(e) => onChangeScript(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 font-mono text-[12px] leading-5 bg-transparent text-[#d4d4d4] resize-none outline-none border-none whitespace-pre selection:bg-[#264f78]"
            placeholder="Type your comic screenplay here... E.g.
=== PAGE 1 ===
PANEL 1 [WIDE SHOT]
Description of the scene...
KAI: &quot;Dialogue line&quot;
[SFX: BOOM!]"
          />
        </div>
      </div>
    </div>
  );
};
