"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { TreeNode as TreeNodeType, DetailPanelData, TreeData } from "../types/tree-table"
import TreeNode from "./tree-node"
import CarouselControls from "./carousel-controls"
import { Button } from "@/components/ui/button"
import { Download, Settings, ZoomIn, ZoomOut, ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

// react-pdf 样式
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// 动态导入 react-pdf，避免 SSR
const Document = typeof window !== 'undefined' ? require('react-pdf').Document : null;
const Page    = typeof window !== 'undefined' ? require('react-pdf').Page    : null;

let pdfjs: any;
if (typeof window !== 'undefined') {
  pdfjs = require('react-pdf').pdfjs;
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
}

// 工具：获取窗口尺寸
function getWindowSize() {
  return (typeof window !== 'undefined')
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: 800, height: 600 };
}

// 搜索相关类型
interface SearchMatch {
  page: number;
  matchIndex: number;
  text: string;
  globalIndex: number;
}
interface SearchResult {
  page: number;
  matches: any[];
  matchCount: number;
}

interface TreeTableProps {
  dataList: TreeData[];
  onNodeClick?: (node: TreeNodeType) => void;
}

export default function TreeTable({ dataList, onNodeClick }: TreeTableProps) {
  /* -------------------- 状态 -------------------- */
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [treeData, setTreeData] = useState(dataList[0].tree);
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null);
  const [detailPanelData, setDetailPanelData] = useState<DetailPanelData | null>(null);
  const [activePanelNodeId, setActivePanelNodeId] = useState<string | null>(null);
  const [allDetailPanelsData, setAllDetailPanelsData] = useState<Record<string, DetailPanelData>>({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [scale, setScale] = useState(1.2);
  const [pdfScale, setPdfScale] = useState(0.5);

  const [indexData, setIndexData] = useState<TreeNodeType[]>([]);
  const [showIndexPanel, setShowIndexPanel] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const [pdfPanelData, setPdfPanelData] = useState<{ url: string; page?: number; searchTerm?: string } | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentGlobalMatchIndex, setCurrentGlobalMatchIndex] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* -------------------- 业务钩子 -------------------- */
  const currentData = dataList[currentDataIndex];

  useEffect(() => {
    return () => { searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current); };
  }, []);

  useEffect(() => {
    let intervalId: number;
    if (isAutoPlay) {
      intervalId = window.setInterval(() => {
        setCurrentDataIndex((prev) => (prev + 1) % dataList.length);
      }, 30000);
    }
    return () => { intervalId && clearInterval(intervalId); };
  }, [isAutoPlay, dataList.length]);

  useEffect(() => {
    setTreeData(dataList[currentDataIndex].tree);
    setActivePanelNodeId(null);
    setDetailPanelData(null);
  }, [currentDataIndex, dataList]);

  /* -------------------- 回调 -------------------- */
  const handleNodeClick = useCallback(
    (node: TreeNodeType) => {
      setSelectedNode(node);
      if (activePanelNodeId === node.id) {
        setActivePanelNodeId(null);
        setDetailPanelData(null);
        return;
      }
      setDetailPanelData({ node, type: "user-note", content: node.userNote || "" });
      setActivePanelNodeId(node.id);
      onNodeClick?.(node);
    },
    [onNodeClick, activePanelNodeId]
  );

  const handlePdfReferenceClick = (pdfRef: { url: string; page?: number; searchTerm?: string }) => {
    setPdfPanelData(pdfRef);
    if (pdfRef.searchTerm) setSearchTerm(pdfRef.searchTerm);
    if (pdfRef.page) setPageNumber(pdfRef.page); else setPageNumber(1);
  };

  const handleClosePanel = useCallback(() => {
    setActivePanelNodeId(null);
    setDetailPanelData(null);
  }, []);

  const handleAddNode = useCallback((parentId: string) => {
    const addNodeToTree = (nodes: TreeNodeType, targetParentId: string): TreeNodeType => {
      if (nodes.id === targetParentId) {
        const newNode: TreeNodeType = {
          id: `new-node-${Date.now()}`,
          name: "新节点",
          type: "normal",
          level: nodes.level + 1,
        };
        return { ...nodes, children: [...(nodes.children || []), newNode], isExpanded: true };
      }
      if (nodes.children) {
        return { ...nodes, children: nodes.children.map((c) => addNodeToTree(c, targetParentId)) };
      }
      return nodes;
    };
    setTreeData((d) => addNodeToTree(d, parentId));
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const deleteNodeFromTree = (nodes: TreeNodeType): TreeNodeType =>
        nodes.children
          ? {
              ...nodes,
              children: nodes.children
                .filter((c) => c.id !== nodeId)
                .map((c) => deleteNodeFromTree(c)),
            }
          : nodes;
      setTreeData((d) => deleteNodeFromTree(d));
      if (activePanelNodeId === nodeId) {
        setActivePanelNodeId(null);
        setDetailPanelData(null);
      }
    },
    [activePanelNodeId]
  );

  const handleExpandAllNodes = useCallback(() => {
    // 收集所有有 userNote 的节点
    const collectNodesWithDetails = (nodes: TreeNodeType, acc: TreeNodeType[] = []): TreeNodeType[] => {
      if (nodes.userNote) {
        acc.push(nodes);
      }
      nodes.children?.forEach((child) => collectNodesWithDetails(child, acc));
      return acc;
    };

    // 切换全展开状态
    const newIsAllExpanded = !isAllExpanded;
    setIsAllExpanded(newIsAllExpanded);

    // 递归展开所有节点
    const expandAllNodes = (nodes: TreeNodeType): TreeNodeType => {
      return {
        ...nodes,
        isExpanded: true,
        children: nodes.children?.map(expandAllNodes)
      };
    };

    // 更新treeData状态以展开所有节点
    setTreeData(prevTreeData => expandAllNodes(prevTreeData));

    if (newIsAllExpanded) {
      // 展开所有详情面板
      const nodesWithDetails = collectNodesWithDetails(treeData);
      const allPanelsData: Record<string, DetailPanelData> = {};
      
      nodesWithDetails.forEach(node => {
        allPanelsData[node.id] = {
          node,
          type: "user-note",
          content: node.userNote || ""
        };
      });
      
      setAllDetailPanelsData(allPanelsData);
    } else {
      // 收起所有详情面板
      setAllDetailPanelsData({});
    }
  }, [isAllExpanded, treeData]);

  const generateIndex = useCallback((node: TreeNodeType, acc: TreeNodeType[] = []): TreeNodeType[] => {
    acc.push(node);
    node.children?.forEach((c) => generateIndex(c, acc));
    return acc;
  }, []);

  useEffect(() => {
    setIndexData(generateIndex(treeData));
  }, [treeData, generateIndex]);

  /* -------------------- 缩放 & 拖拽 -------------------- */
  const handleZoomIn  = () => setScale((s) => Math.min(s + 0.1, 2));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5));

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!e.ctrlKey) return;
    setScale((s) => {
      const ns = e.deltaY < 0 ? s + 0.1 : s - 0.1;
      return Math.min(Math.max(ns, 0.5), 2);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCurrentPosition({ x: viewPosition.x + dx, y: viewPosition.y + dy });
    },
    [isDragging, dragStart, viewPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setViewPosition(currentPosition);
  }, [isDragging, currentPosition]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /* -------------------- PDF 搜索 -------------------- */
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || isSearching || !pdfjs || !pdfPanelData?.url || !numPages) return;
    setIsSearching(true);
    try {
      setSearchProgress(0);
      const results: SearchResult[] = [];
      const allMatches: SearchMatch[] = [];
      let globalIdx = 0;
      const pdf = await pdfjs.getDocument({ url: pdfPanelData.url }).promise;

      for (let p = 1; p <= numPages; p++) {
        const page = await pdf.getPage(p);
        const { items } = await page.getTextContent();
        const found = items.filter((it: any) => it.str && it.str.includes(searchTerm));
        if (found.length) {
          results.push({ page: p, matches: found, matchCount: found.length });
          found.forEach((it: any) => {
            const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            let m;
            while ((m = regex.exec(it.str))) {
              allMatches.push({ page: p, matchIndex: 0, text: it.str, globalIndex: globalIdx++ });
            }
          });
        }
        setSearchProgress(Math.round((p / numPages) * 100));
      }

      setSearchResults(results);
      setSearchMatches(allMatches);
      setTotalMatches(globalIdx);
      setCurrentGlobalMatchIndex(0);
      if (allMatches.length) setPageNumber(allMatches[0].page);
    } catch (err: any) {
      console.error(err);
      alert('搜索 PDF 时出错: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, isSearching, pdfPanelData?.url, numPages]);

  const scrollToCurrentMatch = useCallback(() => {
    setTimeout(() => {
      const marks = document.querySelectorAll('[data-search-highlight="true"]');
      if (!marks.length) return;
      const target = marks[currentGlobalMatchIndex];
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      marks.forEach((el, idx) => el.classList.toggle('current-match', idx === currentGlobalMatchIndex));
    }, 100);
  }, [currentGlobalMatchIndex]);

  const handleNextMatch = () => {
    if (!totalMatches) return;
    const next = (currentGlobalMatchIndex + 1) % totalMatches;
    const { page } = searchMatches[next];
    setCurrentGlobalMatchIndex(next);
    if (page !== pageNumber) setPageNumber(page);
    else scrollToCurrentMatch();
  };

  const handlePreviousMatch = () => {
    if (!totalMatches) return;
    const prev = (currentGlobalMatchIndex - 1 + totalMatches) % totalMatches;
    const { page } = searchMatches[prev];
    setCurrentGlobalMatchIndex(prev);
    if (page !== pageNumber) setPageNumber(page);
    else scrollToCurrentMatch();
  };

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchMatches([]);
    setCurrentGlobalMatchIndex(0);
    setTotalMatches(0);
    setSearchProgress(0);
    searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current);
  }, []);

  /* -------------------- 渲染 -------------------- */
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      {/* Header */}
      <div className="h-16 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">研报逻辑分析</h1>
        <div className="flex items-center space-x-2">
          {/* 添加展开所有节点按钮 */}
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent" 
            onClick={handleExpandAllNodes}
          >
            {isAllExpanded ? '收起所有' : '展开所有'}
          </Button>
          <div className="w-px h-4 bg-slate-600" />
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-slate-300 hover:text-white"><ZoomOut className="w-4 h-4" /></Button>
          <span className="text-sm text-slate-400 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-slate-300 hover:text-white"><ZoomIn className="w-4 h-4" /></Button>
          <div className="w-px h-4 bg-slate-600" />
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"><Download className="w-4 h-4 mr-2" />导出</Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"><Settings className="w-4 h-4 mr-2" />设置</Button>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-hidden p-8 relative" onWheel={handleWheelZoom} onMouseDown={handleMouseDown}>
        <div
          className="flex items-start"
          style={{
            transform: `scale(${scale}) translate(${currentPosition.x}px, ${currentPosition.y}px)`,
            transformOrigin: 'top left',
            cursor: isDragging ? 'grabbing' : 'grab',
            minHeight: '80vh'
          }}
        >
          <TreeNode
            node={treeData}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={() => { /* no-op */ }}
            selectedNodeId={selectedNode?.id}
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            activePanelNodeId={activePanelNodeId}
            detailPanelData={detailPanelData}
            allDetailPanelsData={allDetailPanelsData}
            isAllExpanded={isAllExpanded}
            onClosePanel={handleClosePanel}
            onPdfReferenceClick={handlePdfReferenceClick}
          />
        </div>

        {/* Report Info */}
        <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <div className="text-sm text-slate-300">
            <div className="font-medium">{currentData.report.name}</div>
            <div className="text-xs text-slate-400 mt-1">{currentData.report.author} • {currentData.report.date}</div>
            <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-400 hover:text-blue-300" onClick={() => window.open(currentData.report.url, '_blank')}>
              查看研报 <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="absolute top-28 left-4 flex items-center space-x-2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 border border-slate-600">
          <CarouselControls
            currentIndex={currentDataIndex}
            totalCount={dataList.length}
            isAutoPlay={isAutoPlay}
            onPrevious={() => setCurrentDataIndex((p) => (p - 1 + dataList.length) % dataList.length)}
            onNext={() => setCurrentDataIndex((p) => (p + 1) % dataList.length)}
            onToggleAutoPlay={() => setIsAutoPlay((p) => !p)}
            onSelect={(idx) => setCurrentDataIndex(idx)}
          />
        </div>
      </div>

      {/* 索引面板控制按钮 */}
      <Button
        variant="ghost"
        size="sm"
        className={`fixed left-2 top-1/2 -translate-y-1/2 z-10 ${showIndexPanel ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onClick={() => setShowIndexPanel(true)}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* 文档索引面板 */}
      {showIndexPanel && (
        <div className="absolute top-56 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600 w-64 max-h-[calc(100%-12rem)] overflow-y-auto transition-transform duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">文档索引</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white" onClick={() => setShowIndexPanel(false)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1 text-sm">
            {indexData.map((node) => (
              <div
                key={node.id}
                className="px-2 py-1 rounded hover:bg-slate-700 cursor-pointer text-slate-300 flex items-center"
                style={{ paddingLeft: `${8 + node.level * 12}px` }}
                onClick={() => handleNodeClick(node)}
              >
                <span className="mr-2">{node.level === 0 ? '📋' : node.level === 1 ? '📂' : '📄'}</span>
                <span className={node.level === 0 ? 'font-bold' : node.level === 1 ? 'font-medium' : ''}>{node.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF 查看面板 */}
      {pdfPanelData && (
        <div className="absolute right-0 top-16 bottom-0 w-1/3 bg-white shadow-lg z-10 flex flex-col">
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between p-2 bg-gray-100 border-b text-black">
            <h3 className="font-medium">PDF 查看器</h3>
            <div className="flex items-center space-x-1 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setPdfScale((s) => Math.max(0.1, s - 0.1))}>缩小</Button>
              <span className="text-sm">{Math.round(pdfScale * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setPdfScale((s) => Math.min(3, s + 0.1))}>放大</Button>

              <div className="w-px h-4 bg-gray-300 mx-1" />

              <input
                type="text"
                placeholder="搜索 PDF 文本..."
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  if (!val.trim()) clearSearch();
                  else {
                    searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current);
                    searchTimeoutRef.current = setTimeout(() => handleSearch(), 500);
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="px-2 py-1 text-sm border rounded w-32"
              />
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={clearSearch} className="p-1 h-6 w-6">×</Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
                {isSearching ? '搜索中...' : '搜索'}
              </Button>

              {searchProgress > 0 && searchProgress < 100 && (
                <div className="flex items-center ml-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${searchProgress}%` }} /></div>
                  <span className="ml-1 text-xs">{searchProgress}%</span>
                </div>
              )}

              {totalMatches > 0 && (
                <>
                  <span className="text-xs ml-2">{currentGlobalMatchIndex + 1} / {totalMatches}</span>
                  <Button variant="outline" size="sm" onClick={handlePreviousMatch}><ChevronUp className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" onClick={handleNextMatch}><ChevronDown className="w-3 h-3" /></Button>
                </>
              )}

              <div className="w-px h-4 bg-gray-300 mx-1" />

              <Button variant="outline" size="sm" onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1}>上一页</Button>
              <span className="text-sm">{pageNumber} / {numPages || '--'}</span>
              <Button variant="outline" size="sm" onClick={() => setPageNumber((p) => (numPages ? Math.min(p + 1, numPages) : p + 1))} disabled={!numPages || pageNumber >= numPages}>下一页</Button>

              <Button variant="ghost" size="sm" onClick={() => setPdfPanelData(null)}>关闭</Button>
            </div>
          </div>

          {/* PDF 内容区 */}
          <div className="flex-1 overflow-auto flex items-center justify-center">
            {Document && Page ? (
              <Document file={pdfPanelData.url} onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}>
                <Page
                  pageNumber={pageNumber}
                  width={getWindowSize().width * 0.6}
                  scale={pdfScale}
                  renderTextLayer
                  renderAnnotationLayer
                  customTextRenderer={(textItem: any) => {
                    const str = textItem.str;
                    if (!searchTerm || !str || !str.includes(searchTerm)) return str;
                    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    return str.replace(
                      new RegExp(`(${escaped})`, 'g'),
                      `<mark data-search-highlight="true" style="background:#ffeb3b;color:#000;padding:1px 2px;border-radius:2px;font-weight:bold">$1</mark>`
                    );
                  }}
                />
              </Document>
            ) : (
              <div className="text-black">加载中…</div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .current-match {
          background: #ff9800 !important;
          box-shadow: 0 0 5px #ff9800 !important;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 5px #ff9800; }
          50%  { box-shadow: 0 0 10px #ff9800, 0 0 15px #ff9800; }
          100% { box-shadow: 0 0 5px #ff9800; }
        }
      `}</style>
    </div>
  );
}
