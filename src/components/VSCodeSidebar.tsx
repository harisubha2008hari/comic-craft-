import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FilePlus,
  FolderPlus,
  Image as ImageIcon,
  Layers,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
  Film,
  Camera,
  MessageSquareQuote,
  Sparkles
} from 'lucide-react';
import { ActiveView, ComicProject, ComicPanel } from '../types/comic';
import { sampleImageGallery } from '../data/sampleProject';

interface VSCodeSidebarProps {
  project: ComicProject;
  activeView: ActiveView;
  onSelectPage: (pageId: string) => void;
  onSelectPanel: (panelId: string) => void;
  onSelectView: (view: ActiveView) => void;
  onAddNewPage: () => void;
  onAddNewPanel: () => void;
  onDeletePanel: (panelId: string) => void;
  onAssignImageToActivePanel: (imageUrl: string) => void;
}

export const VSCodeSidebar: React.FC<VSCodeSidebarProps> = ({
  project,
  activeView,
  onSelectPage,
  onSelectPanel,
  onSelectView,
  onAddNewPage,
  onAddNewPanel,
  onDeletePanel,
  onAssignImageToActivePanel,
}) => {
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [panelsOutlineOpen, setPanelsOutlineOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);

  const activeChapter = project.chapters.find((c) => c.id === project.activeChapterId) || project.chapters[0];
  const activePage = activeChapter?.pages.find((p) => p.id === project.activePageId) || activeChapter?.pages[0];

  return (
    <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full select-none text-[#cccccc] text-xs shrink-0 overflow-y-auto custom-scrollbar">
      {/* Sidebar Header Title */}
      <div className="h-9 px-4 flex items-center justify-between font-semibold tracking-wider text-[11px] text-[#bbbbbb] border-b border-[#2b2b2b]">
        <span>
          {activeView === 'characters'
            ? 'CHARACTER ROSTER'
            : activeView === 'image-editor'
            ? 'IMAGE LAB ASSETS'
            : activeView === 'bubbles'
            ? 'BALLOON STYLER'
            : 'EXPLORER'}
        </span>
        <div className="flex items-center gap-1">
          {activeView === 'explorer' && (
            <>
              <button
                onClick={onAddNewPage}
                title="New Comic Page"
                className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc] transition-colors"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onAddNewPanel}
                title="New Panel in Current Page"
                className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-[#cccccc]">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explorer Tree View */}
      {activeView !== 'characters' && (
        <div className="flex-1 overflow-y-auto">
          {/* Project Root Folder */}
          <div className="py-1">
            <div
              onClick={() => setExplorerOpen(!explorerOpen)}
              className="px-2 py-1 flex items-center gap-1.5 cursor-pointer hover:bg-[#2a2d2e] font-semibold text-[11px] text-[#e0e0e0]"
            >
              {explorerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="truncate uppercase tracking-wider">{project.title}</span>
            </div>

            {explorerOpen && (
              <div className="pl-3">
                {/* Script File */}
                <div
                  onClick={() => onSelectView('script')}
                  className={`px-3 py-1 flex items-center gap-2 cursor-pointer transition-colors ${
                    activeView === 'script' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-[#519aba]" />
                  <span className="truncate">chapter_01.comicscript</span>
                </div>

                {/* Pages Folder */}
                <div className="py-0.5">
                  <div
                    onClick={() => setPagesOpen(!pagesOpen)}
                    className="px-2 py-0.5 flex items-center gap-1.5 cursor-pointer hover:bg-[#2a2d2e] text-[#cccccc]"
                  >
                    {pagesOpen ? <ChevronDown className="w-3 h-3 text-[#858585]" /> : <ChevronRight className="w-3 h-3 text-[#858585]" />}
                    <span className="text-[11px] font-medium text-[#9cdcfe]">pages/</span>
                  </div>

                  {pagesOpen && (
                    <div className="pl-4">
                      {activeChapter?.pages.map((p) => {
                        const isCurrentPage = p.id === project.activePageId;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectPage(p.id);
                              onSelectView('canvas');
                            }}
                            className={`px-2 py-1 flex items-center justify-between cursor-pointer rounded-sm my-0.5 ${
                              isCurrentPage && activeView === 'canvas'
                                ? 'bg-[#094771] text-white font-medium'
                                : isCurrentPage
                                ? 'bg-[#37373d] text-white'
                                : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Layers className="w-3 h-3 text-[#e5c07b]" />
                              <span className="truncate">page_{String(p.pageNumber).padStart(2, '0')}.comic</span>
                            </div>
                            <span className="text-[10px] text-[#858585] tabular-nums font-mono">
                              {p.panels.length}p
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Asset Gallery Quick Drawer */}
                <div className="py-0.5">
                  <div
                    onClick={() => setAssetsOpen(!assetsOpen)}
                    className="px-2 py-0.5 flex items-center gap-1.5 cursor-pointer hover:bg-[#2a2d2e] text-[#cccccc]"
                  >
                    {assetsOpen ? <ChevronDown className="w-3 h-3 text-[#858585]" /> : <ChevronRight className="w-3 h-3 text-[#858585]" />}
                    <span className="text-[11px] font-medium text-[#dcdcaa]">assets/images/</span>
                  </div>

                  {assetsOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1">
                      {sampleImageGallery.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => {
                            onAssignImageToActivePanel(img.url);
                          }}
                          className="group p-1.5 rounded hover:bg-[#333333] flex items-center gap-2 cursor-pointer transition-colors border border-transparent hover:border-[#3e3e3e]"
                          title="Click to assign to selected panel"
                        >
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-9 h-6 object-cover rounded border border-[#444444]"
                          />
                          <div className="truncate flex-1">
                            <div className="text-[11px] text-[#cccccc] group-hover:text-white truncate">
                              {img.title}
                            </div>
                            <div className="text-[9px] text-[#858585]">{img.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Outline of Active Page Panels */}
          {activePage && (
            <div className="border-t border-[#2b2b2b] mt-2 pt-1">
              <div
                onClick={() => setPanelsOutlineOpen(!panelsOutlineOpen)}
                className="px-3 py-1 flex items-center justify-between cursor-pointer hover:bg-[#2a2d2e] font-semibold text-[11px] text-[#bbbbbb]"
              >
                <div className="flex items-center gap-1.5">
                  {panelsOutlineOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>PAGE {activePage.pageNumber} PANELS</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNewPanel();
                  }}
                  title="Add panel"
                  className="hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {panelsOutlineOpen && (
                <div className="px-2 py-1 space-y-1">
                  {activePage.panels.map((panel, idx) => {
                    const isSelected = panel.id === project.activePanelId;
                    return (
                      <div
                        key={panel.id}
                        onClick={() => onSelectPanel(panel.id)}
                        className={`p-2 rounded cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-[#094771] border-[#007acc] text-white shadow-sm'
                            : 'bg-[#1e1e1e] border-[#333333] hover:border-[#444444] text-[#cccccc]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-medium text-[11px]">
                            <Camera className="w-3 h-3 text-[#4ec9b0]" />
                            <span>Panel {idx + 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] px-1 py-0.2 bg-[#2d2d2d] rounded text-[#9cdcfe] font-mono">
                              {panel.shotType}
                            </span>
                            {activePage.panels.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeletePanel(panel.id);
                                }}
                                title="Delete panel"
                                className="text-[#858585] hover:text-[#f87171] p-0.5 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {panel.description && (
                          <p className="text-[10px] text-[#9a9a9a] line-clamp-1 italic mb-1">
                            "{panel.description}"
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-[#71717a]">
                          <span className="flex items-center gap-1">
                            <MessageSquareQuote className="w-2.5 h-2.5" />
                            {panel.bubbles.length} bubbles
                          </span>
                          {panel.filter.halftone && (
                            <span className="text-[9px] text-[#e5c07b]">● Halftone</span>
                          )}
                          {panel.filter.speedLines && (
                            <span className="text-[9px] text-[#f472b6]">● SpeedLines</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Characters View in Sidebar */}
      {activeView === 'characters' && (
        <div className="p-3 space-y-3 overflow-y-auto">
          <p className="text-[11px] text-[#858585]">
            Character profiles & dialogue trackers for screenplay consistency.
          </p>
          <div className="space-y-2">
            {project.characters.map((char) => (
              <div
                key={char.id}
                className="p-2.5 bg-[#1e1e1e] border border-[#333333] rounded hover:border-[#4ec9b0] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: char.colorTag }}
                  />
                  <div className="font-bold text-[12px] text-white">{char.name}</div>
                  <span className="text-[10px] text-[#858585] ml-auto">{char.role}</span>
                </div>
                <p className="text-[10px] text-[#9ca3af] mb-2">{char.description}</p>
                <div className="flex items-center justify-between text-[10px] text-[#858585] font-mono">
                  <span>Dialogue count:</span>
                  <span className="text-white font-bold">{char.dialogueCount} lines</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
