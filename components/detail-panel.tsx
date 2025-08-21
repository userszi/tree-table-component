"use client"

import React, { useState } from "react"
import { DetailPanelData } from "../types/tree-table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface DetailPanelProps {
  data: DetailPanelData | null
  onClose: () => void
  onPdfReferenceClick?: (pdfRef: {url: string, page?: number, searchTerm?: string}) => void
}

export default function DetailPanel({ data, onClose, onPdfReferenceClick }: DetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  if (!data) return null

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(data.content)
  }

  const handleSave = () => {
    if (data.onSave) {
      data.onSave(editContent)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent("")
  }

  // 渲染带表格引用的描述函数
  const renderDescriptionWithTableLinks = (description: string): React.ReactNode => {
    // 匹配表和图
    const refRegex = /\[\[(表 \d+|图 \d+)\]\]/g;
    
    // 先处理PDF引用，将它们替换为按钮组件
    let processedDescription = description;
    const replacements: Record<string, React.ReactNode> = {};
    let match;
    let lastIndex = 0;
    
    // 用于生成唯一key的计数器
    let refIndex = 0;
    
    while ((match = refRegex.exec(description)) !== null) {
      const placeholder = `{{REF_${lastIndex++}}}`;
      const refId = match[1];
      replacements[placeholder] = (
        <button 
          key={refId + refIndex++}
          className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          onClick={() => handleReferenceClick(refId)}
        >
          {refId}
        </button>
      );
      processedDescription = processedDescription.replace(match[0], placeholder);
    }
    
    // 使用ReactMarkdown渲染处理后的文本
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义段落样式
          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
          // 自定义列表样式 - 调整列表项间距
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-0.5" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-0.5" {...props} />,
          // 关键修改：调整列表项之间的垂直间距
          li: ({node, ...props}) => <li className="list-item-compact" {...props} />,
          // 自定义加粗样式
          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
          // 处理内联代码
          code: ({node, ...props}) => <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props} />,
        }}
      >
        {processedDescription}
      </ReactMarkdown>
    );
  };

  const handleReferenceClick = (refId: string) => {
    // 查找对应的PDF引用
    const pdfRef = data?.node.pdfReferences?.find(ref => ref.tableId === refId);
    if (pdfRef && onPdfReferenceClick) {
      onPdfReferenceClick({
        url: pdfRef.url,
        page: pdfRef.page,
        searchTerm: pdfRef.searchTerm
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 text-slate-100 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">节点详情</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          关闭
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold mb-2">节点名称</h3>
            <p className="text-slate-300">{data.node.name}</p>
          </div>
          
          {data.content && (
            <div>
              <h3 className="text-md font-semibold mb-2">节点内容</h3>
              <div className="text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto p-3 bg-slate-700/50 border border-slate-600 rounded-md">
                {isEditing ? (
                  <Textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-32 bg-slate-700 text-slate-100 border-slate-600"
                  />
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 自定义段落样式
                      p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                      // 自定义列表样式
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-0.5" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-0.5" {...props} />,
                      // 关键修改：调整列表项之间的垂直间距
                      li: ({node, ...props}) => <li className="list-item-compact" {...props} />,
                      // 自定义加粗样式
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      // 处理内联代码
                      code: ({node, ...props}) => <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props} />,
                    }}
                  >
                    {data.content}
                  </ReactMarkdown>
                )}
                {data.editable && (
                  <div className="mt-2 flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSave}>保存</Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>取消</Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={handleEdit}>编辑</Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {data.node.description && (
            <div>
              <h3 className="text-md font-semibold mb-2">节点描述</h3>
              <div className="text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto p-3 bg-slate-700/50 border border-slate-600 rounded-md">
                {data.node.pdfReferences ? renderDescriptionWithTableLinks(data.node.description) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 自定义段落样式
                      p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                      // 自定义列表样式
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-1" {...props} />,
                      // 关键修改：调整列表项之间的垂直间距
                      li: ({node, ...props}) => <li className="list-item-compact" {...props} />,
                      // 自定义加粗样式
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      // 处理内联代码
                      code: ({node, ...props}) => <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props} />,
                    }}
                  >
                    {data.node.description}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          )}
      
          {/* 图片显示部分 */}
          {data.node.images && data.node.images.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">相关图片</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.node.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg border border-slate-600 hover:border-slate-400 transition-colors cursor-pointer"
                      onClick={() => window.open(image.url, '_blank')}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
