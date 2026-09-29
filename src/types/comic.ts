export type PanelLayout = 'grid-6' | 'grid-4' | 'dynamic-3' | 'webtoon-vertical' | 'splash-1' | 'manga-4koma';

export type BubbleType = 'speech' | 'shout' | 'thought' | 'whisper' | 'caption' | 'sfx';

export interface SpeechBubble {
  id: string;
  type: BubbleType;
  text: string;
  speaker?: string;
  x: number; // percentage 0-100 within panel
  y: number; // percentage 0-100 within panel
  width?: number; // px or auto
  tailX?: number; // relative tail direction x
  tailY?: number; // relative tail direction y
  fontFamily: 'Comic Neue' | 'Bangers' | 'Plus Jakarta Sans' | 'JetBrains Mono';
  fontSize: number; // px
  fontColor: string;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface PanelFilterConfig {
  halftone: boolean;
  halftoneDotSize: number;
  noirThreshold: number; // 0 = off, 1-255 = threshold level
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sepia: number; // 0 to 100
  speedLines: boolean;
  speedLinesDensity: number; // 20 to 120
  speedLinesCenterX: number; // 0 to 100%
  speedLinesCenterY: number; // 0 to 100%
}

export interface ComicPanel {
  id: string;
  order: number;
  shotType: 'WIDE SHOT' | 'MEDIUM SHOT' | 'CLOSE UP' | 'EXTREME CLOSE UP' | 'ESTABLISHING' | 'BIRD EYE';
  caption?: string;
  description: string;
  imageUrl?: string;
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  filter: PanelFilterConfig;
  bubbles: SpeechBubble[];
  aspectRatio?: string; // e.g. "1/1", "16/9", "4/3", "2/1"
  colSpan?: number; // 1-3
  rowSpan?: number; // 1-2
  borderWidth: number; // px
  borderColor: string;
  backgroundColor: string;
}

export interface ComicPage {
  id: string;
  pageNumber: number;
  title: string;
  layout: PanelLayout;
  gutterSize: number; // px
  pageBgColor: string;
  panels: ComicPanel[];
}

export interface ComicChapter {
  id: string;
  title: string;
  scriptContent: string;
  pages: ComicPage[];
}

export interface ComicCharacter {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Narrator';
  colorTag: string;
  description: string;
  dialogueCount: number;
  avatarUrl?: string;
}

export interface ScriptIssue {
  line: number;
  type: 'warning' | 'info' | 'error';
  message: string;
  panelRef?: string;
}

export interface ComicProject {
  id: string;
  title: string;
  genre: string;
  author: string;
  version: string;
  resolutionDPI: number;
  chapters: ComicChapter[];
  characters: ComicCharacter[];
  activeChapterId: string;
  activePageId: string;
  activePanelId?: string;
}

export type ActiveView = 
  | 'explorer' 
  | 'script' 
  | 'canvas' 
  | 'image-editor' 
  | 'bubbles' 
  | 'characters' 
  | 'export';
