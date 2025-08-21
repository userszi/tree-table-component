"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { TreeNode as TreeNodeType, DetailPanelData } from "../types/tree-table"
import { ChevronDown, ChevronRight, Edit, Trash2, Sparkles, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import DetailPanel from "./detail-panel"

interface TreeNodeProps {
  node: TreeNodeType
  onNodeClick: (node: TreeNodeType) => void
  onNodeDoubleClick: (node: TreeNodeType) => void
  selectedNodeId?: string
  onAddNode?: (parentId: string) => void
  onDeleteNode?: (nodeId: string) => void
  activePanelNodeId?: string | null
  detailPanelData?: DetailPanelData | null
  allDetailPanelsData?: Record<string, DetailPanelData>
  isAllExpanded?: boolean
  onClosePanel?: () => void
  onPdfReferenceClick?: (pdfRef: {url: string, page?: number, searchTerm?: string}) => void
}

const getNodeStyle = (type: TreeNodeType["type"], level: number, isSelected: boolean) => {
  const baseStyle =
    "relative px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg min-w-[120px]"

  let style = ""

  // 根据节点类型设置颜色
  if (type === "opportunity") {
    // 机会节点 - 绿色
    style = `${baseStyle} bg-gradient-to-r from-green-600 to-green-700 border-green-500 text-white shadow-xl`
  } else if (type === "risk") {
    // 风险节点 - 红色
    style = `${baseStyle} bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-xl`
  } else if (type === "mark") {
    // 标记节点 - 黄色
    style = `${baseStyle} bg-gradient-to-r from-indigo-800 to-indigo-900 border-indigo-600 text-white shadow-xl`
  } else if (type === "forecast") {
    // 预测节点 - 紫色
    style = `${baseStyle} bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 text-white shadow-xl`
  } else if (level === 0) {
    // 股票ID - 深蓝色
    style = `${baseStyle} bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600`
  } else {
    // 其他节点
    style = `${baseStyle} bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600`
  }

  return `${style} ${isSelected ? "ring-2 ring-blue-400 ring-opacity-75" : ""}`
}

const getNodeIcon = (type: TreeNodeType["type"]) => {
  return null
}

export default function TreeNode({
  node,
  onNodeClick,
  onNodeDoubleClick,
  selectedNodeId,
  onAddNode,
  onDeleteNode,
  activePanelNodeId,
  detailPanelData,
  allDetailPanelsData,
  isAllExpanded,
  onClosePanel,
  onPdfReferenceClick,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(node.isExpanded ?? true)
  const [isHovered, setIsHovered] = useState(false)

  // 添加timeout清理逻辑
  useEffect(() => {
    return () => {
      // 清理逻辑已移除
    };
  }, []);

  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedNodeId === node.id
  const showSingleDetailPanel = activePanelNodeId === node.id && detailPanelData;
  const showAllDetailPanel = isAllExpanded && allDetailPanelsData && allDetailPanelsData[node.id];
  const showDetailPanel = showSingleDetailPanel || showAllDetailPanel;
  const canDelete = false

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false)
    }, 200)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNodeClick(node)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleAddNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddNode?.(node.id)
  }

  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteNode?.(node.id)
  }

  // 计算子节点容器的左边距，用于在全部展开时避免阶梯状排列
  const getChildContainerStyle = () => {
    if (isAllExpanded && showDetailPanel) {
      // 当全部展开且显示详情面板时，增加左边距以容纳详情面板的宽度
      return "flex flex-col space-y-4 ml-96"; // 96是根据max-w-4xl调整的值，可根据需要修改
    }
    return "flex flex-col space-y-4 ml-2";
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className={getNodeStyle(node.type, node.level, isSelected)} onClick={handleClick}>
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <button onClick={handleToggle} className="p-1 hover:bg-white/10 rounded">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}

              {getNodeIcon(node.type)}

              <div className="flex flex-col">
                <span className="font-medium text-sm">{node.name}</span>
              </div>
            </div>
          </div>

          {/* Action buttons - 调整位置更贴近节点 */}
          {isHovered && canDelete && (
            <div
              className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex space-x-1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 border-red-500 hover:bg-red-700 bg-red-800/90 text-red-300"
                onClick={handleDeleteNode}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="w-8 h-px bg-gradient-to-r from-slate-600 to-transparent ml-4"></div>
        )}

        {hasChildren && isExpanded && (
          <div className={getChildContainerStyle()}>
            {node.children!.map((child, index) => (
              <div key={child.id} className="flex items-center">
                {index > 0 && (
                  <div
                    className="absolute w-px bg-slate-600"
                    style={{
                      height: `${index * 80}px`,
                      left: "-4px",
                      top: `-${index * 80}px`,
                    }}
                  />
                )}

                <TreeNode
                  node={child}
                  onNodeClick={onNodeClick}
                  onNodeDoubleClick={onNodeDoubleClick}
                  selectedNodeId={selectedNodeId}
                  onAddNode={onAddNode}
                  onDeleteNode={onDeleteNode}
                  activePanelNodeId={activePanelNodeId}
                  detailPanelData={detailPanelData}
                  allDetailPanelsData={allDetailPanelsData}
                  isAllExpanded={isAllExpanded}
                  onClosePanel={onClosePanel}
                  onPdfReferenceClick={onPdfReferenceClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetailPanel && (
        <div className="mt-4 w-full max-w-4xl">
          <DetailPanel 
            data={isAllExpanded && allDetailPanelsData ? allDetailPanelsData[node.id] : detailPanelData} 
            onClose={onClosePanel!} 
            onPdfReferenceClick={onPdfReferenceClick} 
          />
        </div>
      )}
    </div>
  )
}
