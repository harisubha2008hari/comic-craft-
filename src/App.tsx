import React, { useState, useEffect, useRef } from 'react';
import { initialProject, defaultFilter, sampleComicScript } from './data/sampleProject';
import {
  ComicProject,
  ActiveView,
  ComicPanel,
  ComicPage,
  SpeechBubble,
  PanelFilterConfig,
  PanelLayout
} from './types/comic';
import { parseScriptDiagnostics, calculateScriptStats, parseScriptToPages } from './utils/scriptParser';
import { VSCodeTitlebar } from './components/VSCodeTitlebar';
import { VSCodeActivityBar } from './components/VSCodeActivityBar';
import { VSCodeSidebar } from './components/VSCodeSidebar';
import { VSCodeStatusBar } from './components/VSCodeStatusBar';
import { VSCodeBottomDrawer } from './components/VSCodeBottomDrawer';
import { CommandPalette } from './components/CommandPalette';
import { ScriptEditor } from './components/ScriptEditor';
import { CanvasWorkbench } from './components/CanvasWorkbench';
import { ImageEditorLab } from './components/ImageEditorLab';
import { BalloonEditor } from './components/BalloonEditor';
import { ExportWorkbench } from './components/ExportWorkbench';
import { ComicReaderModal } from './components/ComicReaderModal';
import { downloadCanvasAsImage, applyFiltersToCanvas } from './utils/imageFilters';
import { FileCode, Layers, Sparkles, MessageSquare, X, Columns } from 'lucide-react';

export default function App() {
  const [project, setProject] = useState<ComicProject>(() => {
    const saved = localStorage.getItem('comiccraft_project_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialProject;
      }
    }
    return initialProject;
  });

  const [activeView, setActiveView] = useState<ActiveView>('canvas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [targetScriptLine, setTargetScriptLine] = useState<number | undefined>();

  // CLI Terminal Logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'ComicCraft Studio v1.0.4 (VS Code Environment)',
    'Type "help" for available commands (build, lint, stats, export --webtoon)...',
  ]);

  // Persist project changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('comiccraft_project_v1', JSON.stringify(project));
  }, [project]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setIsBottomDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeChapter = project.chapters.find((c) => c.id === project.activeChapterId) || project.chapters[0];
  const activePage = activeChapter?.pages.find((p) => p.id === project.activePageId) || activeChapter?.pages[0];
  const activePanel = activePage?.panels.find((p) => p.id === project.activePanelId) || activePage?.panels[0];

  // Script diagnostics & metrics
  const scriptIssues = parseScriptDiagnostics(activeChapter.scriptContent);
  const scriptStats = calculateScriptStats(activeChapter.scriptContent);

  // Script editing handler
  const handleScriptChange = (content: string) => {
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) =>
        chap.id === prev.activeChapterId ? { ...chap, scriptContent: content } : chap
      ),
    }));
  };

  // Sync script to canvas panels
  const handleSyncScriptToCanvas = () => {
    const newPages = parseScriptToPages(activeChapter.scriptContent, activeChapter.pages);

    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) =>
        chap.id === prev.activeChapterId ? { ...chap, pages: newPages } : chap
      ),
    }));

    setTerminalLogs((prev) => [
      ...prev,
      `[ScriptSync] Synced script successfully -> ${newPages.length} pages generated/updated.`,
    ]);
  };

  // Panel updates
  const handleUpdatePanel = (panelId: string, updates: Partial<ComicPanel>) => {
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) => ({
          ...pg,
          panels: pg.panels.map((p) => (p.id === panelId ? { ...p, ...updates } : p)),
        })),
      })),
    }));
  };

  // Bubble operations
  const handleAddBubble = (panelId: string, type: SpeechBubble['type']) => {
    const newBubble: SpeechBubble = {
      id: `bub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      text: type === 'shout' ? 'LOOK OUT!' : type === 'caption' ? 'Meanwhile...' : 'New dialogue',
      x: 20 + Math.random() * 20,
      y: 20 + Math.random() * 20,
      fontFamily: type === 'shout' ? 'Bangers' : 'Comic Neue',
      fontSize: type === 'shout' ? 18 : 13,
      fontColor: type === 'shout' ? '#ffffff' : '#000000',
      bgColor: type === 'shout' ? '#ef4444' : type === 'caption' ? '#fef08a' : '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
    };

    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) => ({
          ...pg,
          panels: pg.panels.map((p) =>
            p.id === panelId ? { ...p, bubbles: [...p.bubbles, newBubble] } : p
          ),
        })),
      })),
    }));
  };

  const handleUpdateBubble = (panelId: string, bubbleId: string, updates: Partial<SpeechBubble>) => {
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) => ({
          ...pg,
          panels: pg.panels.map((p) =>
            p.id === panelId
              ? {
                  ...p,
                  bubbles: p.bubbles.map((b) => (b.id === bubbleId ? { ...b, ...updates } : b)),
                }
              : p
          ),
        })),
      })),
    }));
  };

  const handleDeleteBubble = (panelId: string, bubbleId: string) => {
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) => ({
          ...pg,
          panels: pg.panels.map((p) =>
            p.id === panelId ? { ...p, bubbles: p.bubbles.filter((b) => b.id !== bubbleId) } : p
          ),
        })),
      })),
    }));
  };

  // Add new page
  const handleAddNewPage = () => {
    const newPageNum = activeChapter.pages.length + 1;
    const newPage: ComicPage = {
      id: `page-${Date.now()}`,
      pageNumber: newPageNum,
      title: `Page ${newPageNum}`,
      layout: 'dynamic-3',
      gutterSize: 8,
      pageBgColor: '#000000',
      panels: [
        {
          id: `panel-${Date.now()}-1`,
          order: 1,
          shotType: 'WIDE SHOT',
          description: 'New scene establishing view...',
          borderWidth: 3,
          borderColor: '#ffffff',
          backgroundColor: '#0a0a0a',
          filter: { ...defaultFilter },
          bubbles: [],
        },
      ],
    };

    setProject((prev) => ({
      ...prev,
      activePageId: newPage.id,
      chapters: prev.chapters.map((chap) =>
        chap.id === prev.activeChapterId ? { ...chap, pages: [...chap.pages, newPage] } : chap
      ),
    }));
    setActiveView('canvas');
  };

  // Add panel to current page
  const handleAddNewPanel = () => {
    if (!activePage) return;
    const newOrder = activePage.panels.length + 1;
    const newPanel: ComicPanel = {
      id: `panel-${Date.now()}-${newOrder}`,
      order: newOrder,
      shotType: 'MEDIUM SHOT',
      description: 'Action follows here...',
      borderWidth: 3,
      borderColor: '#ffffff',
      backgroundColor: '#0a0a0a',
      filter: { ...defaultFilter },
      bubbles: [],
    };

    setProject((prev) => ({
      ...prev,
      activePanelId: newPanel.id,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) =>
          pg.id === activePage.id ? { ...pg, panels: [...pg.panels, newPanel] } : pg
        ),
      })),
    }));
  };

  // Delete panel
  const handleDeletePanel = (panelId: string) => {
    if (!activePage || activePage.panels.length <= 1) return;
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) =>
          pg.id === activePage.id
            ? {
                ...pg,
                panels: pg.panels.filter((p) => p.id !== panelId),
              }
            : pg
        ),
      })),
    }));
  };

  // Switch Layout
  const handleChangeLayout = (layout: PanelLayout) => {
    if (!activePage) return;
    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) => ({
        ...chap,
        pages: chap.pages.map((pg) => (pg.id === activePage.id ? { ...pg, layout } : pg)),
      })),
    }));
  };

  // Image Lab filter saving
  const handleSaveFilter = (panelId: string, filter: PanelFilterConfig, newImageUrl?: string) => {
    handleUpdatePanel(panelId, {
      filter,
      ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
    });
  };

  // Assign image from asset gallery
  const handleAssignImageToActivePanel = (imageUrl: string) => {
    if (!activePanel) return;
    handleUpdatePanel(activePanel.id, { imageUrl });
  };

  // Export page to canvas PNG
  const handleExportPagePNG = () => {
    if (!activePage) return;

    // Create an offscreen high-res canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 2200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill page background
    ctx.fillStyle = activePage.pageBgColor || '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw comic header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${project.title.toUpperCase()} — ISSUE #01`, 60, 60);

    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#71717a';
    ctx.fillText(`PAGE ${activePage.pageNumber} · 300 DPI RASTER`, canvas.width - 340, 60);

    // Render panels sequentially
    const panelCount = activePage.panels.length;
    const padding = 60;
    const availableHeight = canvas.height - 180;
    const panelHeight = (availableHeight - (panelCount - 1) * 20) / Math.max(1, panelCount);

    let loadedImages = 0;
    const totalToLoad = activePage.panels.filter((p) => p.imageUrl).length;

    const renderRemaining = () => {
      activePage.panels.forEach((p, idx) => {
        const py = 100 + idx * (panelHeight + 20);
        const px = padding;
        const pw = canvas.width - padding * 2;
        const ph = panelHeight;

        // Draw panel border
        ctx.strokeStyle = p.borderColor || '#ffffff';
        ctx.lineWidth = p.borderWidth * 2;
        ctx.strokeRect(px, py, pw, ph);

        // Draw bubbles
        p.bubbles.forEach((b) => {
          const bx = px + (b.x / 100) * pw;
          const by = py + (b.y / 100) * ph;
          ctx.save();
          ctx.font = `${b.fontSize * 1.5}px "${b.fontFamily}", sans-serif`;
          ctx.fillStyle = b.bgColor === 'transparent' ? '#facc15' : b.bgColor;
          if (b.bgColor !== 'transparent') {
            ctx.fillRect(bx - 10, by - 24, Math.max(120, b.text.length * 14), 40);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeRect(bx - 10, by - 24, Math.max(120, b.text.length * 14), 40);
          }
          ctx.fillStyle = b.fontColor;
          ctx.fillText(b.text, bx, by);
          ctx.restore();
        });
      });

      downloadCanvasAsImage(canvas, `${project.title.toLowerCase().replace(/\s+/g, '_')}_page_${activePage.pageNumber}.png`);
    };

    if (totalToLoad === 0) {
      renderRemaining();
    } else {
      activePage.panels.forEach((p, idx) => {
        if (!p.imageUrl) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = p.imageUrl;
        img.onload = () => {
          const py = 100 + idx * (panelHeight + 20);
          const px = padding;
          const pw = canvas.width - padding * 2;
          const ph = panelHeight;

          ctx.drawImage(img, px, py, pw, ph);
          loadedImages++;
          if (loadedImages === totalToLoad) {
            renderRemaining();
          }
        };
      });
    }
  };

  // Project JSON export & import
  const handleExportProjectJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'comiccraft_project.json';
    link.click();
  };

  const handleImportProjectJSON = (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    if (parsed.chapters && parsed.title) {
      setProject(parsed);
    }
  };

  // Run simulated ComicCraft Terminal commands
  const handleRunTerminalCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    const newLogs = [...terminalLogs, `$ ${command}`];

    if (cmd === 'help') {
      newLogs.push('Available ComicCraft commands:');
      newLogs.push('  build             - Compiles print-ready 300 DPI pages');
      newLogs.push('  lint              - Checks script pacing, word overflows & shot variety');
      newLogs.push('  stats             - Displays word count and camera angle breakdown');
      newLogs.push('  export --webtoon  - Packages continuous vertical scroll assets');
      newLogs.push('  clear             - Clears the console logs');
    } else if (cmd === 'build') {
      newLogs.push('[BUILD] Starting ComicCraft composite compiler...');
      newLogs.push(`[BUILD] Compiling Chapter 1 (${activeChapter.pages.length} pages, ${scriptStats.totalPanels} panels)...`);
      newLogs.push('[BUILD] Applied Manga screentone dot shaders & SVG speech tails.');
      newLogs.push('[BUILD] SUCCESS: Comic raster target built in 240ms.');
    } else if (cmd === 'lint') {
      if (scriptIssues.length === 0) {
        newLogs.push('[LINT] All panels compliant! 0 issues found.');
      } else {
        newLogs.push(`[LINT] Found ${scriptIssues.length} issues in script.comicscript:`);
        scriptIssues.forEach((iss) => newLogs.push(`  - [Line ${iss.line}] ${iss.message}`));
      }
    } else if (cmd === 'stats') {
      newLogs.push(`[STATS] Total Script Words: ${scriptStats.totalWords}`);
      newLogs.push(`[STATS] Shot Distribution: ${JSON.stringify(scriptStats.shotDistribution)}`);
      newLogs.push(`[STATS] Characters: ${Object.keys(scriptStats.characterDialogueCounts).join(', ')}`);
    } else if (cmd.includes('export')) {
      newLogs.push('[EXPORT] Generating Webtoon vertical stream manifest...');
      newLogs.push('[EXPORT] Webtoon slice 1200x8000px exported.');
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    } else {
      newLogs.push(`comiccraft: command not recognized: ${command}. Type 'help' for command list.`);
    }

    setTerminalLogs(newLogs);
  };

  // Command palette executor
  const handleExecuteCommand = (cmdId: string) => {
    switch (cmdId) {
      case 'sync-script':
        handleSyncScriptToCanvas();
        break;
      case 'toggle-split':
        setIsSplitView((prev) => !prev);
        break;
      case 'open-reader':
        setIsReaderModalOpen(true);
        break;
      case 'export-png':
        handleExportPagePNG();
        break;
      case 'open-image-lab':
        setActiveView('image-editor');
        break;
      case 'apply-halftone':
        if (activePanel) {
          handleUpdatePanel(activePanel.id, {
            filter: { ...activePanel.filter, halftone: !activePanel.filter.halftone },
          });
        }
        break;
      case 'apply-speedlines':
        if (activePanel) {
          handleUpdatePanel(activePanel.id, {
            filter: { ...activePanel.filter, speedLines: !activePanel.filter.speedLines },
          });
        }
        break;
      case 'add-panel':
        handleAddNewPanel();
        break;
      case 'add-page':
        handleAddNewPage();
        break;
      case 'layout-webtoon':
        handleChangeLayout('webtoon-vertical');
        break;
      case 'layout-grid6':
        handleChangeLayout('grid-6');
        break;
      case 'layout-dynamic':
        handleChangeLayout('dynamic-3');
        break;
      case 'add-shout-bubble':
        if (activePanel) handleAddBubble(activePanel.id, 'shout');
        break;
      case 'add-speech-bubble':
        if (activePanel) handleAddBubble(activePanel.id, 'speech');
        break;
      case 'view-terminal':
        setIsBottomDrawerOpen(true);
        break;
      default:
        break;
    }
  };

  // Tab definitions
  const editorTabs = [
    {
      id: 'script',
      title: 'chapter_01.comicscript',
      view: 'script' as ActiveView,
      icon: <FileCode className="w-3.5 h-3.5 text-[#519aba]" />,
    },
    {
      id: 'canvas',
      title: `page_${String(activePage?.pageNumber || 1).padStart(2, '0')}.comic`,
      view: 'canvas' as ActiveView,
      icon: <Layers className="w-3.5 h-3.5 text-[#e5c07b]" />,
    },
    {
      id: 'image-editor',
      title: `panel_${activePanel?.order || 1}_filter.imglab`,
      view: 'image-editor' as ActiveView,
      icon: <Sparkles className="w-3.5 h-3.5 text-[#c586c0]" />,
    },
    {
      id: 'bubbles',
      title: 'balloon_styler.sfx',
      view: 'bubbles' as ActiveView,
      icon: <MessageSquare className="w-3.5 h-3.5 text-[#4ec9b0]" />,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none">
      {/* 1. VS Code Titlebar */}
      <VSCodeTitlebar
        projectTitle={project.title}
        activeFileName={
          activeView === 'script'
            ? 'chapter_01.comicscript'
            : activeView === 'image-editor'
            ? `panel_${activePanel?.order || 1}.imglab`
            : `page_${String(activePage?.pageNumber || 1).padStart(2, '0')}.comic`
        }
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onToggleBottomDrawer={() => setIsBottomDrawerOpen((prev) => !prev)}
        onToggleSplitView={() => setIsSplitView((prev) => !prev)}
        isSplitView={isSplitView}
        onOpenReaderModal={() => setIsReaderModalOpen(true)}
        onExportPage={handleExportPagePNG}
      />

      {/* 2. Main Workbench Body (Activity Bar + Sidebar + Main Viewport) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Activity Bar */}
        <VSCodeActivityBar
          activeView={activeView}
          onSelectView={setActiveView}
          scriptIssueCount={scriptIssues.length}
        />

        {/* Primary Sidebar (Explorer / Panes) */}
        {isSidebarOpen && (
          <VSCodeSidebar
            project={project}
            activeView={activeView}
            onSelectPage={(pageId) => {
              setProject((prev) => ({ ...prev, activePageId: pageId }));
            }}
            onSelectPanel={(panelId) => {
              setProject((prev) => ({ ...prev, activePanelId: panelId }));
            }}
            onSelectView={setActiveView}
            onAddNewPage={handleAddNewPage}
            onAddNewPanel={handleAddNewPanel}
            onDeletePanel={handleDeletePanel}
            onAssignImageToActivePanel={handleAssignImageToActivePanel}
          />
        )}

        {/* Central Editor Viewport with Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Tab Bar */}
          <div className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between overflow-x-auto select-none shrink-0">
            <div className="flex items-center">
              {editorTabs.map((tab) => {
                const isActive = activeView === tab.view;
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveView(tab.view)}
                    className={`h-9 px-3.5 flex items-center gap-2 cursor-pointer border-r border-[#1e1e1e] text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                        : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#252526] hover:text-[#cccccc]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Split View Toggle in Tab Header */}
            <div className="flex items-center px-3 gap-2">
              <button
                onClick={() => setIsSplitView((s) => !s)}
                className={`p-1 rounded transition-colors ${
                  isSplitView ? 'text-[#007acc] bg-[#333333]' : 'text-[#858585] hover:text-[#cccccc]'
                }`}
                title={isSplitView ? 'Exit Split View' : 'Split Editor: Script + Canvas Side-by-Side'}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active View Container (Supports Split View!) */}
          <div className="flex-1 flex overflow-hidden">
            {isSplitView ? (
              /* DUAL PANE SPLIT VIEW: Left is Script Editor, Right is Canvas Workbench */
              <div className="flex-1 flex w-full h-full overflow-hidden">
                <div className="w-1/2 border-r border-[#2d2d2d] flex flex-col">
                  <div className="h-6 px-3 bg-[#1e1e1e] border-b border-[#2d2d2d] text-[10px] text-[#858585] flex items-center font-mono">
                    EDITOR 1: chapter_01.comicscript
                  </div>
                  <ScriptEditor
                    scriptContent={activeChapter.scriptContent}
                    onChangeScript={handleScriptChange}
                    onSyncToCanvas={handleSyncScriptToCanvas}
                    issues={scriptIssues}
                    activeLine={targetScriptLine}
                  />
                </div>
                <div className="w-1/2 flex flex-col">
                  <div className="h-6 px-3 bg-[#1e1e1e] border-b border-[#2d2d2d] text-[10px] text-[#858585] flex items-center font-mono">
                    EDITOR 2: page_{activePage?.pageNumber}.comic (Interactive Canvas)
                  </div>
                  {activePage && (
                    <CanvasWorkbench
                      page={activePage}
                      selectedPanelId={activePanel?.id}
                      onSelectPanel={(id) => setProject((prev) => ({ ...prev, activePanelId: id }))}
                      onUpdatePanel={handleUpdatePanel}
                      onAddBubbleToPanel={handleAddBubble}
                      onUpdateBubble={handleUpdateBubble}
                      onDeleteBubble={handleDeleteBubble}
                      onOpenImageLab={(id) => {
                        setProject((prev) => ({ ...prev, activePanelId: id }));
                        setActiveView('image-editor');
                      }}
                      onChangeLayout={handleChangeLayout}
                      onAddNewPanel={handleAddNewPanel}
                      onDeletePanel={handleDeletePanel}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* SINGLE PANE FULL WORKBENCH */
              <div className="flex-1 flex overflow-hidden">
                {activeView === 'script' && (
                  <ScriptEditor
                    scriptContent={activeChapter.scriptContent}
                    onChangeScript={handleScriptChange}
                    onSyncToCanvas={handleSyncScriptToCanvas}
                    issues={scriptIssues}
                    activeLine={targetScriptLine}
                  />
                )}

                {activeView === 'canvas' && activePage && (
                  <CanvasWorkbench
                    page={activePage}
                    selectedPanelId={activePanel?.id}
                    onSelectPanel={(id) => setProject((prev) => ({ ...prev, activePanelId: id }))}
                    onUpdatePanel={handleUpdatePanel}
                    onAddBubbleToPanel={handleAddBubble}
                    onUpdateBubble={handleUpdateBubble}
                    onDeleteBubble={handleDeleteBubble}
                    onOpenImageLab={(id) => {
                      setProject((prev) => ({ ...prev, activePanelId: id }));
                      setActiveView('image-editor');
                    }}
                    onChangeLayout={handleChangeLayout}
                    onAddNewPanel={handleAddNewPanel}
                    onDeletePanel={handleDeletePanel}
                  />
                )}

                {activeView === 'image-editor' && activePanel && (
                  <ImageEditorLab
                    panel={activePanel}
                    onSaveFilter={handleSaveFilter}
                    onClose={() => setActiveView('canvas')}
                  />
                )}

                {activeView === 'bubbles' && activePanel && (
                  <BalloonEditor
                    panel={activePanel}
                    onAddBubble={(bubble) => {
                      if (activePanel) {
                        const newBubble: SpeechBubble = {
                          id: `bub-${Date.now()}`,
                          type: bubble.type || 'speech',
                          text: bubble.text || 'Dialogue',
                          speaker: bubble.speaker,
                          x: bubble.x ?? 25,
                          y: bubble.y ?? 25,
                          fontFamily: bubble.fontFamily || 'Comic Neue',
                          fontSize: bubble.fontSize || 14,
                          fontColor: bubble.fontColor || '#000000',
                          bgColor: bubble.bgColor || '#ffffff',
                          borderColor: bubble.borderColor || '#000000',
                          borderWidth: bubble.borderWidth ?? 2,
                        };
                        setProject((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((chap) => ({
                            ...chap,
                            pages: chap.pages.map((pg) => ({
                              ...pg,
                              panels: pg.panels.map((p) =>
                                p.id === activePanel.id ? { ...p, bubbles: [...p.bubbles, newBubble] } : p
                              ),
                            })),
                          })),
                        }));
                      }
                    }}
                    onDeleteBubble={(bubbleId) => handleDeleteBubble(activePanel.id, bubbleId)}
                    onClose={() => setActiveView('canvas')}
                  />
                )}

                {activeView === 'characters' && (
                  <div className="flex-1 p-8 bg-[#181818] overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-6">
                      <h2 className="text-lg font-bold text-white">Character Cast & Visual Bible</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.characters.map((char) => (
                          <div key={char.id} className="bg-[#252526] p-4 rounded-lg border border-[#333333]">
                            {char.avatarUrl && (
                              <img src={char.avatarUrl} alt={char.name} className="w-full h-36 object-cover rounded mb-3" />
                            )}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: char.colorTag }} />
                              <span className="font-bold text-white text-sm">{char.name}</span>
                              <span className="text-[10px] text-[#858585] ml-auto font-mono">{char.role}</span>
                            </div>
                            <p className="text-xs text-[#999999] mb-3">{char.description}</p>
                            <div className="text-[11px] text-[#858585] font-mono">
                              Dialogue Frequency: <span className="text-white font-bold">{char.dialogueCount} lines</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'export' && (
                  <ExportWorkbench
                    project={project}
                    onUpdateProjectMeta={(updates) => setProject((prev) => ({ ...prev, ...updates }))}
                    onExportPagePNG={handleExportPagePNG}
                    onExportProjectJSON={handleExportProjectJSON}
                    onImportProjectJSON={handleImportProjectJSON}
                    onOpenReaderModal={() => setIsReaderModalOpen(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Bottom Diagnostics / Statistics / Terminal Drawer */}
          <VSCodeBottomDrawer
            isOpen={isBottomDrawerOpen}
            onClose={() => setIsBottomDrawerOpen(false)}
            scriptIssues={scriptIssues}
            scriptStats={scriptStats}
            onJumpToScriptLine={(line) => {
              setTargetScriptLine(line);
              setActiveView('script');
            }}
            onRunTerminalCommand={handleRunTerminalCommand}
            terminalLogs={terminalLogs}
            onClearTerminal={() => setTerminalLogs([])}
          />
        </div>
      </div>

      {/* 3. VS Code Status Bar */}
      <VSCodeStatusBar
        activePageNumber={activePage?.pageNumber || 1}
        totalPages={activeChapter.pages.length}
        totalPanelsOnPage={activePage?.panels.length || 0}
        activeShotType={activePanel?.shotType}
        scriptIssues={scriptIssues}
        wordCount={scriptStats.totalWords}
        onToggleBottomDrawer={() => setIsBottomDrawerOpen((prev) => !prev)}
        isBottomDrawerOpen={isBottomDrawerOpen}
        onOpenReaderModal={() => setIsReaderModalOpen(true)}
      />

      {/* 4. Fullscreen Comic Reader Modal */}
      <ComicReaderModal
        isOpen={isReaderModalOpen}
        onClose={() => setIsReaderModalOpen(false)}
        project={project}
        onExportCurrentPage={handleExportPagePNG}
      />

      {/* 5. Command Palette Modal (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onExecute={handleExecuteCommand}
      />
    </div>
  );
}
