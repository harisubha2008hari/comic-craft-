import { ComicPage, ComicPanel, ScriptIssue, SpeechBubble } from '../types/comic';
import { defaultFilter } from '../data/sampleProject';

export interface ScriptStats {
  totalPages: number;
  totalPanels: number;
  totalWords: number;
  characterDialogueCounts: Record<string, number>;
  shotDistribution: Record<string, number>;
  averageDialogueLength: number;
}

export function parseScriptDiagnostics(scriptText: string): ScriptIssue[] {
  const issues: ScriptIssue[] = [];
  const lines = scriptText.split('\n');
  let currentPanel: string | null = null;
  let panelDialogueWords = 0;
  let hasPanelShot = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineNum = index + 1;

    // Check Page markers
    if (/^(=== PAGE \d+ ===|PAGE \d+)/i.test(trimmed)) {
      currentPanel = null;
      return;
    }

    // Check Panel markers
    const panelMatch = trimmed.match(/^PANEL\s+(\d+)(?:\s*\[(.*?)\])?/i);
    if (panelMatch) {
      if (currentPanel && panelDialogueWords > 45) {
        issues.push({
          line: lineNum - 1,
          type: 'warning',
          message: `${currentPanel} dialogue count is high (${panelDialogueWords} words). May overcrowd comic panel.`,
          panelRef: currentPanel,
        });
      }

      currentPanel = `Panel ${panelMatch[1]}`;
      panelDialogueWords = 0;
      hasPanelShot = Boolean(panelMatch[2]);

      if (!hasPanelShot) {
        issues.push({
          line: lineNum,
          type: 'info',
          message: `${currentPanel} has no camera shot tag (e.g. [WIDE SHOT], [CLOSE UP]).`,
          panelRef: currentPanel,
        });
      }
      return;
    }

    // Check Dialogue lines
    const dialogueMatch = trimmed.match(/^([A-Z0-9\s_\-]+):\s*(.*)$/);
    if (dialogueMatch) {
      const speaker = dialogueMatch[1].trim();
      const speech = dialogueMatch[2].replace(/"/g, '').trim();
      const words = speech.split(/\s+/).filter(Boolean).length;
      panelDialogueWords += words;

      if (!currentPanel) {
        issues.push({
          line: lineNum,
          type: 'error',
          message: `Dialogue for "${speaker}" placed outside of any PANEL definition.`,
        });
      }

      if (speech.length === 0) {
        issues.push({
          line: lineNum,
          type: 'warning',
          message: `Empty dialogue line for speaker ${speaker}.`,
        });
      }
    }
  });

  return issues;
}

export function calculateScriptStats(scriptText: string): ScriptStats {
  const lines = scriptText.split('\n');
  let totalPages = 0;
  let totalPanels = 0;
  let totalWords = 0;
  let dialogueWordSum = 0;
  let dialogueLineCount = 0;
  const characterDialogueCounts: Record<string, number> = {};
  const shotDistribution: Record<string, number> = {};

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (/^(=== PAGE \d+ ===|PAGE \d+)/i.test(trimmed)) {
      totalPages++;
    } else if (/^PANEL\s+\d+/i.test(trimmed)) {
      totalPanels++;
      const shotMatch = trimmed.match(/\[(.*?)\]/);
      const shot = shotMatch ? shotMatch[1].toUpperCase() : 'UNSPECIFIED';
      shotDistribution[shot] = (shotDistribution[shot] || 0) + 1;
    } else {
      const dialogueMatch = trimmed.match(/^([A-Z0-9\s_\-]+):\s*(.*)$/);
      if (dialogueMatch && !trimmed.startsWith('CAPTION') && !trimmed.startsWith('SFX') && !trimmed.startsWith('TITLE')) {
        const char = dialogueMatch[1].trim();
        const speech = dialogueMatch[2];
        const words = speech.split(/\s+/).filter(Boolean).length;
        characterDialogueCounts[char] = (characterDialogueCounts[char] || 0) + 1;
        dialogueWordSum += words;
        dialogueLineCount++;
      }
    }

    if (trimmed.length > 0) {
      totalWords += trimmed.split(/\s+/).filter(Boolean).length;
    }
  });

  return {
    totalPages: Math.max(1, totalPages),
    totalPanels: Math.max(1, totalPanels),
    totalWords,
    characterDialogueCounts,
    shotDistribution,
    averageDialogueLength: dialogueLineCount > 0 ? Math.round(dialogueWordSum / dialogueLineCount) : 0,
  };
}

export function parseScriptToPages(scriptText: string, existingPages: ComicPage[] = []): ComicPage[] {
  const pages: ComicPage[] = [];
  const lines = scriptText.split('\n');
  let currentPage: ComicPage | null = null;
  let currentPanel: ComicPanel | null = null;
  let pageCounter = 0;
  let panelCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check page
    const pageMatch = line.match(/^(?:===\s*)?PAGE\s+(\d+)(?:\s*===)?/i);
    if (pageMatch) {
      pageCounter = parseInt(pageMatch[1], 10);
      panelCounter = 0;
      const existing = existingPages.find((p) => p.pageNumber === pageCounter);

      currentPage = {
        id: existing?.id || `page-${pageCounter}-${Date.now()}`,
        pageNumber: pageCounter,
        title: existing?.title || `Page ${pageCounter}`,
        layout: existing?.layout || 'dynamic-3',
        gutterSize: existing?.gutterSize || 8,
        pageBgColor: existing?.pageBgColor || '#000000',
        panels: [],
      };
      pages.push(currentPage);
      currentPanel = null;
      continue;
    }

    // Check panel
    const panelMatch = line.match(/^PANEL\s+(\d+)(?:\s*\[(.*?)\])?/i);
    if (panelMatch) {
      if (!currentPage) {
        pageCounter = 1;
        currentPage = {
          id: `page-1-${Date.now()}`,
          pageNumber: 1,
          title: 'Page 1',
          layout: 'dynamic-3',
          gutterSize: 8,
          pageBgColor: '#000000',
          panels: [],
        };
        pages.push(currentPage);
      }

      panelCounter++;
      const shotRaw = panelMatch[2] ? panelMatch[2].toUpperCase().trim() : 'MEDIUM SHOT';
      const validShots = ['WIDE SHOT', 'MEDIUM SHOT', 'CLOSE UP', 'EXTREME CLOSE UP', 'ESTABLISHING', 'BIRD EYE'] as const;
      const shotType = (validShots.find((s) => s === shotRaw) || 'MEDIUM SHOT') as ComicPanel['shotType'];

      // Look ahead for existing panel if updating
      const existingPage = existingPages.find((p) => p.pageNumber === currentPage?.pageNumber);
      const existingPanel = existingPage?.panels.find((p) => p.order === panelCounter);

      currentPanel = {
        id: existingPanel?.id || `panel-${currentPage.pageNumber}-${panelCounter}-${Date.now()}`,
        order: panelCounter,
        shotType,
        description: '',
        caption: existingPanel?.caption || '',
        imageUrl: existingPanel?.imageUrl,
        borderWidth: existingPanel?.borderWidth ?? 3,
        borderColor: existingPanel?.borderColor ?? '#ffffff',
        backgroundColor: existingPanel?.backgroundColor ?? '#09090b',
        colSpan: existingPanel?.colSpan ?? 1,
        rowSpan: existingPanel?.rowSpan ?? 1,
        filter: existingPanel?.filter || { ...defaultFilter },
        bubbles: existingPanel?.bubbles || [],
      };
      currentPage.panels.push(currentPanel);
      continue;
    }

    if (!currentPanel) continue;

    // Check Caption
    const captionMatch = line.match(/^CAPTION:\s*(.*)$/i);
    if (captionMatch) {
      const captionText = captionMatch[1].trim();
      currentPanel.caption = (currentPanel.caption ? currentPanel.caption + ' ' : '') + captionText;
      const bubbleExists = currentPanel.bubbles.some((b) => b.type === 'caption' && b.text === captionText);
      if (!bubbleExists) {
        const bubble: SpeechBubble = {
          id: `cap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'caption',
          text: captionText,
          x: 10,
          y: Math.min(80, 10 + currentPanel.bubbles.length * 20),
          fontFamily: 'Comic Neue',
          fontSize: 13,
          fontColor: '#000000',
          bgColor: '#fef08a',
          borderColor: '#000000',
          borderWidth: 2,
        };
        currentPanel.bubbles.push(bubble);
      }
      continue;
    }

    // Check SFX
    const sfxMatch = line.match(/^\[?SFX:\s*([^\]]+)\]?/i);
    if (sfxMatch) {
      const sfxText = sfxMatch[1].trim();
      const sfxExists = currentPanel.bubbles.some((b) => b.type === 'sfx' && b.text === sfxText);
      if (!sfxExists) {
        currentPanel.bubbles.push({
          id: `sfx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'sfx',
          text: sfxText,
          x: 40,
          y: 50,
          fontFamily: 'Bangers',
          fontSize: 26,
          fontColor: '#facc15',
          bgColor: 'transparent',
          borderColor: '#000000',
          borderWidth: 0,
        });
      }
      continue;
    }

    // Check Character dialogue
    const dialogueMatch = line.match(/^([A-Z0-9\s_\-]+?)(?:\s*\((.*?)\))?:\s*(.*)$/);
    if (dialogueMatch && !line.startsWith('ACTION:')) {
      const speaker = dialogueMatch[1].trim();
      const modifier = dialogueMatch[2]?.toLowerCase() || '';
      const text = dialogueMatch[3].replace(/^"(.*)"$/, '$1').trim();

      const isShout = modifier.includes('shout') || modifier.includes('scream') || text.includes('!') || text === text.toUpperCase();
      const isThought = modifier.includes('thought') || modifier.includes('think');
      const isWhisper = modifier.includes('whisper');

      let bubbleType: SpeechBubble['type'] = 'speech';
      if (isShout) bubbleType = 'shout';
      else if (isThought) bubbleType = 'thought';
      else if (isWhisper) bubbleType = 'whisper';

      const existingBubble = currentPanel.bubbles.find((b) => b.speaker === speaker && b.text === text);
      if (!existingBubble) {
        currentPanel.bubbles.push({
          id: `bub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: bubbleType,
          speaker,
          text,
          x: 15 + (currentPanel.bubbles.length * 15) % 60,
          y: 15 + (currentPanel.bubbles.length * 18) % 60,
          fontFamily: bubbleType === 'shout' ? 'Bangers' : 'Comic Neue',
          fontSize: bubbleType === 'shout' ? 16 : 13,
          fontColor: bubbleType === 'shout' ? '#ffffff' : '#000000',
          bgColor: bubbleType === 'shout' ? '#ef4444' : '#ffffff',
          borderColor: '#000000',
          borderWidth: 2,
        });
      }
      continue;
    }

    // Otherwise description
    if (line.length > 0 && !line.startsWith('===') && !line.startsWith('TITLE:') && !line.startsWith('ISSUE:') && !line.startsWith('WRITER:')) {
      currentPanel.description = (currentPanel.description ? currentPanel.description + ' ' : '') + line;
    }
  }

  return pages.length > 0 ? pages : existingPages;
}
