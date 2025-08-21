"use client"

import TreeTable from "../components/tree-table"
import { mockTreeDataList } from "../data/mock-data"
import type { TreeNode } from "../types/tree-table"

export default function Home() {
  const handleNodeClick = (node: TreeNode) => {
    console.log("Node clicked:", node)
  }

  return <TreeTable dataList={mockTreeDataList} onNodeClick={handleNodeClick} />
}
