import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Volume2,
  Type,
  Plus,
  Palette,
  Check
} from 'lucide-react';
import { BubbleType, ComicPanel, SpeechBubble } from '../types/comic';

interface BalloonEditorProps {
  panel: ComicPanel;
  onAddBubble: (bubble: Partial<SpeechBubble>) => void;
  onDeleteBubble: (bubbleId: string) => void;
  onClose?: () => void;
}

export const BalloonEditor: React.FC<BalloonEditorProps> = ({
  panel,
  onAddBubble,
  onDeleteBubble,
  onClose,
}) => {
  const [bubbleType, setBubbleType] = useState<BubbleType>('speech');
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [fontFamily, setFontFamily] = useState<SpeechBubble['fontFamily']>('Comic Neue');
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');

  const sfxPresets = [
    { label: 'POW!', color: '#ef4444', size: 28 },
    { label: 'KABOOM!', color: '#f59e0b', size: 32 },
    { label: 'SHKKLAAANG!!', color: '#facc15', size: 24 },
    { label: 'SLASH!', color: '#06b6d4', size: 30 },
    { label: 'BZZZZT...', color: '#a855f7', size: 22 },
    { label: 'WHAM!', color: '#ec4899', size: 28 },
  ];

  const handleCreateBubble = () => {
    if (!text.trim()) return;

    onAddBubble({
      type: bubbleType,
      text: text.trim(),
      speaker: speaker.trim() || undefined,
      x: 20 + Math.random() * 20,
      y: 20 + Math.random() * 20,
      fontFamily,
      fontSize,
      fontColor,
      bgColor: bubbleType === 'sfx' ? 'transparent' : bgColor,
      borderColor,
      borderWidth: bubbleType === 'sfx' ? 0 : 2,
    });

    setText('');
    setSpeaker('');
  };

  const handleAddSFXPreset = (preset: { label: string; color: string; size: number }) => {
    onAddBubble({
      type: 'sfx',
      text: preset.label,
      x: 30 + Math.random() * 15,
      y: 40 + Math.random() * 15,
      fontFamily: 'Bangers',
      fontSize: preset.size,
      fontColor: preset.color,
      bgColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 0,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] p-6 text-[#cccccc] text-xs select-none overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#2d2d2d] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#4ec9b0]" />
              <span>Speech Balloon & SFX Typography Styler</span>
            </h2>
            <p className="text-[11px] text-[#858585] mt-0.5">
              Customize comic dialogue balloons, action bursts, and sound effects for Panel {panel.order}.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#252526] hover:bg-[#333333] text-white rounded text-[11px]"
            >
              Done
            </button>
          )}
        </div>

        {/* Bubble Style Selector */}
        <div className="space-y-2">
          <label className="font-semibold text-white uppercase text-[11px] tracking-wider">
            1. Select Balloon Architecture
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { type: 'speech', label: 'Standard Speech', icon: '💬' },
              { type: 'shout', label: 'Scream / Shout', icon: '💥' },
              { type: 'thought', label: 'Thought Cloud', icon: '💭' },
              { type: 'whisper', label: 'Whisper Dashed', icon: '🤫' },
              { type: 'caption', label: 'Narrator Box', icon: '📜' },
              { type: 'sfx', label: 'Sound Effect (SFX)', icon: '⚡' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setBubbleType(item.type as BubbleType);
                  if (item.type === 'shout') {
                    setFontFamily('Bangers');
                    setFontSize(18);
                    setFontColor('#ffffff');
                    setBgColor('#ef4444');
                  } else if (item.type === 'caption') {
                    setFontFamily('Comic Neue');
                    setFontSize(13);
                    setFontColor('#000000');
                    setBgColor('#fef08a');
                  } else if (item.type === 'sfx') {
                    setFontFamily('Bangers');
                    setFontSize(26);
                    setFontColor('#facc15');
                    setBgColor('transparent');
                  } else {
                    setFontFamily('Comic Neue');
                    setFontSize(13);
                    setFontColor('#000000');
                    setBgColor('#ffffff');
                  }
                }}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  bubbleType === item.type
                    ? 'bg-[#094771] border-[#007acc] text-white font-medium ring-2 ring-[#007acc]/40'
                    : 'bg-[#252526] border-[#333333] text-[#cccccc] hover:border-[#444444]'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-[10px] leading-tight">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Text & Speaker Input */}
        <div className="space-y-3 bg-[#252526] p-4 rounded-lg border border-[#333333]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="text-[10px] text-[#858585] block mb-1">Speaker Tag (Optional)</label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="e.g. KAI, VECTOR"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#007acc]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10px] text-[#858585] block mb-1">Dialogue / SFX Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter dialogue or sound effect..."
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#007acc]"
              />
            </div>
          </div>

          {/* Typography & Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Comic Lettering Font</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1.5 text-white outline-none text-[11px]"
              >
                <option value="Comic Neue">Comic Neue (Classic)</option>
                <option value="Bangers">Bangers (Action / Manga)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta (Modern)</option>
                <option value="JetBrains Mono">JetBrains Mono (Cyber/AI)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min="10"
                max="36"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-[#007acc]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Bubble Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#333333] cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-[#858585]">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#858585] block mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#333333] cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-[#858585]">{fontColor}</span>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCreateBubble}
              disabled={!text.trim()}
              className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0062a3] disabled:opacity-40 text-white rounded flex items-center gap-1.5 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Balloon into Panel {panel.order}</span>
            </button>
          </div>
        </div>

        {/* Quick SFX Stamps */}
        <div className="space-y-2">
          <label className="font-semibold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#facc15]" />
            <span>Instant SFX Action Stamps</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {sfxPresets.map((sfx) => (
              <button
                key={sfx.label}
                onClick={() => handleAddSFXPreset(sfx)}
                style={{ color: sfx.color }}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#333333] hover:border-[#555555] rounded-lg font-['Bangers'] text-base tracking-wider text-center transition-transform hover:scale-105"
                title="Click to stamp into panel"
              >
                {sfx.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Bubbles in this panel */}
        <div className="space-y-2">
          <label className="font-semibold text-white uppercase text-[11px] tracking-wider">
            Current Balloons on Panel {panel.order} ({panel.bubbles.length})
          </label>
          <div className="space-y-1.5">
            {panel.bubbles.map((b) => (
              <div
                key={b.id}
                className="p-2.5 bg-[#252526] rounded border border-[#333333] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1e1e1e] rounded text-[#9cdcfe]">
                    {b.type.toUpperCase()}
                  </span>
                  {b.speaker && (
                    <span className="font-bold text-white text-[11px]">{b.speaker}:</span>
                  )}
                  <span className="text-white text-[12px]">"{b.text}"</span>
                </div>
                <button
                  onClick={() => onDeleteBubble(b.id)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-[#333333]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
