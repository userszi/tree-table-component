export interface TreeNode {
  id: string
  name: string
  type: "company" | "dimension" | "normal" | "opportunity" | "risk" | "mark" | "forecast"
  children?: TreeNode[]
  level: number
  isExpanded?: boolean
  description?: string
  imageUrl?: string
  userNote?: string
  // 新增字段用于支持PDF跳转功能
  pdfReferences?: Array<{
    tableId: string;
    url: string;        // PDF文件的URL路径
    page?: number;      // 目标页码（可选）
    searchTerm?: string; // 需要在PDF中搜索的关键词（可选）
    coordinates?: {    // 目标位置坐标（可选）
      x: number;
      y: number;
    };
  }>;
    // 示例：
    // "pdfReferences": [
    //   {
    //     "tableId": "表 2", // 括号中标蓝的字体
    //     "url": "/pdf/恒工精密/球墨铸铁龙头，布局机器人减速器核心部件.pdf", // 引用文章
    //     "searchTerm":"表 2" // pdf搜索的关键词
    //   },
    //   {
    //     "tableId": "表 3",
    //     "url": "/pdf/恒工精密/球墨铸铁龙头，布局机器人减速器核心部件.pdf",
    //     "searchTerm":"表 3"
    //   }
    // ]
  images?: Array<{ 
    url: string;
    name: string;
    size: number;
  }>;
    //   示例
    // "images": [
    //   {
    //     "url": "/image/恒工精密/0.0.png",
    //     "name": "图 1",
    //     "size": 1000000
    //   }
    // ],
}

export interface DetailPanelData {
  node: TreeNode
  type: "user-note"
  content: string
  editable?: boolean;
  onSave?: (content: string) => void;
}

export interface ReportInfo {
  id: string
  name: string
  author: string
  date: string
  url: string
}

export interface TreeData {
  tree: TreeNode
  report: ReportInfo
}
