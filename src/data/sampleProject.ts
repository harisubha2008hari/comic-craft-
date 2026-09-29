import { ComicProject, PanelFilterConfig } from '../types/comic';

export const defaultFilter: PanelFilterConfig = {
  halftone: false,
  halftoneDotSize: 4,
  noirThreshold: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sepia: 0,
  speedLines: false,
  speedLinesDensity: 40,
  speedLinesCenterX: 50,
  speedLinesCenterY: 50,
};

export const sampleComicScript = `TITLE: CYBER SAMURAI: NEON DRIFT
ISSUE: #01
WRITER: K. Hari & Studio

=== PAGE 1 ===

PANEL 1 [ESTABLISHING]
WIDE SHOT of Neo-Tokyo metropolis under endless acid rain. Towering monolithic skyscrapers pierce through smoggy violet clouds. Neon billboards pulse in holographic kanji.
CAPTION: Neo-Shinjuku. Year 2142. They swore the Grid would never fail.
CAPTION: They lied.

PANEL 2 [MEDIUM SHOT]
In a subterranean alleyway lit by flickering cyan mercury lamps, KAI (24, cybernetic katana slung across woven tactical armor) kneels over a cracked optical terminal.
KAI: "Data stream is corrupted... but the signature belongs to Sector Zero."
[SFX: BZZZZT... WHIRRR]

PANEL 3 [CLOSE UP]
Shadows coalesce behind him. Out steps VECTOR (massive obsidian cybernetics, glowing crimson optic sensors, mechanical jaw).
VECTOR: "You should have stayed in the lowlands, little ghost."
KAI: "Vector. I was hoping you'd send your hounds instead."

PANEL 4 [WIDE SHOT]
ACTION: Kai lunges upward, his katana sparking with hyper-frequency plasma arc as Vector raises a heavy thermal blaster!
[SFX: SHKKLAAANG!!]
VECTOR: "Die with the old code!"
KAI: (screaming) "NOT TONIGHT!"

=== PAGE 2 ===

PANEL 1 [WIDE SHOT]
Kai leaps across rain-slicked rooftops, gravity-damping boots leaving traces of cyan ionized mist.
CAPTION: Three miles to the uplink spire. Thirty seconds before the drone fleet locks on.

PANEL 2 [CLOSE UP]
Kai's eyes glow with augmented targeting reticles. The city spreads below like a motherboard of neon light.
KAI: "Aiko, did you cut their satellite feed?"
RADIO [AIKO]: "Almost! You have three seconds to jump!"
`;

export const initialProject: ComicProject = {
  id: 'proj-cyber-samurai',
  title: 'Cyber Samurai: Neon Drift',
  genre: 'Cyberpunk Action / Sci-Fi Graphic Novel',
  author: 'K. Hari & Studio',
  version: '1.0.4',
  resolutionDPI: 300,
  activeChapterId: 'chap-01',
  activePageId: 'page-01',
  activePanelId: 'panel-01-1',
  characters: [
    {
      id: 'char-kai',
      name: 'KAI',
      role: 'Protagonist',
      colorTag: '#0ea5e9',
      description: 'Ex-Grid operative turned ronin. Wields a plasma katana with neural feedback.',
      dialogueCount: 4,
      avatarUrl: '/src/assets/images/comic_hero_action_1790661384864.jpg',
    },
    {
      id: 'char-vector',
      name: 'VECTOR',
      role: 'Antagonist',
      colorTag: '#ef4444',
      description: 'Heavy cybernetic enforcer of Sector Zero. Armored titanium exoskeleton.',
      dialogueCount: 2,
      avatarUrl: '/src/assets/images/comic_villain_confrontation_1790661398910.jpg',
    },
    {
      id: 'char-aiko',
      name: 'AIKO',
      role: 'Supporting',
      colorTag: '#a855f7',
      description: 'Grid hacker providing remote tactical surveillance and comms support.',
      dialogueCount: 1,
    },
    {
      id: 'char-detective',
      name: 'DETECTIVE COLE',
      role: 'Narrator',
      colorTag: '#f59e0b',
      description: 'Hard-boiled precinct detective investigating neural code thefts.',
      dialogueCount: 2,
      avatarUrl: '/src/assets/images/comic_retro_detective_1790661429162.jpg',
    },
  ],
  chapters: [
    {
      id: 'chap-01',
      title: 'Chapter 01: The Fractured Grid',
      scriptContent: sampleComicScript,
      pages: [
        {
          id: 'page-01',
          pageNumber: 1,
          title: 'Opening - Acid Rain & Sparks',
          layout: 'dynamic-3',
          gutterSize: 8,
          pageBgColor: '#000000',
          panels: [
            {
              id: 'panel-01-1',
              order: 1,
              shotType: 'ESTABLISHING',
              caption: 'Neo-Shinjuku. Year 2142. They swore the Grid would never fail.',
              description: 'Wide shot of Neo-Tokyo metropolis under endless acid rain.',
              imageUrl: '/src/assets/images/comic_city_panorama_1790661413209.jpg',
              imageScale: 1,
              imageOffsetX: 0,
              imageOffsetY: 0,
              borderWidth: 3,
              borderColor: '#ffffff',
              backgroundColor: '#111827',
              colSpan: 3,
              rowSpan: 1,
              filter: {
                ...defaultFilter,
                contrast: 15,
                saturation: 10,
              },
              bubbles: [
                {
                  id: 'bub-1-1',
                  type: 'caption',
                  text: 'Neo-Shinjuku. Year 2142. They swore the Grid would never fail.',
                  x: 8,
                  y: 12,
                  fontFamily: 'Comic Neue',
                  fontSize: 13,
                  fontColor: '#000000',
                  bgColor: '#fef08a',
                  borderColor: '#000000',
                  borderWidth: 2,
                },
                {
                  id: 'bub-1-2',
                  type: 'caption',
                  text: 'They lied.',
                  x: 75,
                  y: 70,
                  fontFamily: 'Comic Neue',
                  fontSize: 13,
                  fontColor: '#ffffff',
                  bgColor: '#18181b',
                  borderColor: '#ef4444',
                  borderWidth: 2,
                },
              ],
            },
            {
              id: 'panel-01-2',
              order: 2,
              shotType: 'CLOSE UP',
              caption: '',
              description: 'Vector steps into the flickering mercury light.',
              imageUrl: '/src/assets/images/comic_villain_confrontation_1790661398910.jpg',
              imageScale: 1,
              imageOffsetX: 0,
              imageOffsetY: 0,
              borderWidth: 3,
              borderColor: '#ffffff',
              backgroundColor: '#0a0a0a',
              colSpan: 1,
              rowSpan: 1,
              filter: {
                ...defaultFilter,
                noirThreshold: 0,
                contrast: 20,
              },
              bubbles: [
                {
                  id: 'bub-2-1',
                  type: 'speech',
                  speaker: 'VECTOR',
                  text: 'You should have stayed in the lowlands, little ghost.',
                  x: 10,
                  y: 18,
                  tailX: 18,
                  tailY: 80,
                  fontFamily: 'Bangers',
                  fontSize: 14,
                  fontColor: '#000000',
                  bgColor: '#ffffff',
                  borderColor: '#000000',
                  borderWidth: 2,
                },
              ],
            },
            {
              id: 'panel-01-3',
              order: 3,
              shotType: 'WIDE SHOT',
              caption: '',
              description: 'Kai unleashes a plasma leap across the rooftop!',
              imageUrl: '/src/assets/images/comic_hero_action_1790661384864.jpg',
              imageScale: 1,
              imageOffsetX: 0,
              imageOffsetY: 0,
              borderWidth: 3,
              borderColor: '#ffffff',
              backgroundColor: '#050505',
              colSpan: 2,
              rowSpan: 1,
              filter: {
                ...defaultFilter,
                speedLines: true,
                speedLinesDensity: 48,
                speedLinesCenterX: 50,
                speedLinesCenterY: 45,
              },
              bubbles: [
                {
                  id: 'bub-3-1',
                  type: 'shout',
                  speaker: 'KAI',
                  text: 'NOT TONIGHT!',
                  x: 52,
                  y: 18,
                  fontFamily: 'Bangers',
                  fontSize: 20,
                  fontColor: '#ffffff',
                  bgColor: '#ef4444',
                  borderColor: '#000000',
                  borderWidth: 3,
                },
                {
                  id: 'bub-3-2',
                  type: 'sfx',
                  text: 'SHKKLAAANG!!',
                  x: 15,
                  y: 65,
                  fontFamily: 'Bangers',
                  fontSize: 28,
                  fontColor: '#facc15',
                  bgColor: 'transparent',
                  borderColor: '#000000',
                  borderWidth: 0,
                },
              ],
            },
          ],
        },
        {
          id: 'page-02',
          pageNumber: 2,
          title: 'Rooftop Pursuit & Code Heist',
          layout: 'grid-4',
          gutterSize: 8,
          pageBgColor: '#000000',
          panels: [
            {
              id: 'panel-02-1',
              order: 1,
              shotType: 'MEDIUM SHOT',
              description: 'Detective Cole investigates the burnt terminal in the alley below.',
              imageUrl: '/src/assets/images/comic_retro_detective_1790661429162.jpg',
              borderWidth: 3,
              borderColor: '#ffffff',
              backgroundColor: '#18181b',
              filter: {
                ...defaultFilter,
                sepia: 25,
                contrast: 15,
              },
              bubbles: [
                {
                  id: 'bub-2-1-1',
                  type: 'thought',
                  speaker: 'COLE',
                  text: 'The plasma burns are fresh. He was here minutes ago...',
                  x: 12,
                  y: 15,
                  fontFamily: 'Comic Neue',
                  fontSize: 13,
                  fontColor: '#000000',
                  bgColor: '#ffffff',
                  borderColor: '#000000',
                  borderWidth: 2,
                },
              ],
            },
            {
              id: 'panel-02-2',
              order: 2,
              shotType: 'WIDE SHOT',
              description: 'Kai sprints over high-voltage cables above the abyss.',
              imageUrl: '/src/assets/images/comic_hero_action_1790661384864.jpg',
              borderWidth: 3,
              borderColor: '#ffffff',
              backgroundColor: '#18181b',
              filter: {
                ...defaultFilter,
                halftone: true,
                halftoneDotSize: 3,
              },
              bubbles: [
                {
                  id: 'bub-2-2-1',
                  type: 'whisper',
                  speaker: 'AIKO',
                  text: 'Jump, Kai! The drone swarm has your thermal lock!',
                  x: 10,
                  y: 18,
                  fontFamily: 'Comic Neue',
                  fontSize: 12,
                  fontColor: '#000000',
                  bgColor: '#f4f4f5',
                  borderColor: '#71717a',
                  borderWidth: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const sampleImageGallery = [
  {
    id: 'img-1',
    title: 'Cyber Ninja Rooftop Leap',
    url: '/src/assets/images/comic_hero_action_1790661384864.jpg',
    category: 'Action',
  },
  {
    id: 'img-2',
    title: 'Cyborg Vector Confrontation',
    url: '/src/assets/images/comic_villain_confrontation_1790661398910.jpg',
    category: 'Character',
  },
  {
    id: 'img-3',
    title: 'Neo-Tokyo Sprawl Panorama',
    url: '/src/assets/images/comic_city_panorama_1790661413209.jpg',
    category: 'Environment',
  },
  {
    id: 'img-4',
    title: 'Noir Detective Street Lamp',
    url: '/src/assets/images/comic_retro_detective_1790661429162.jpg',
    category: 'Character',
  },
];
