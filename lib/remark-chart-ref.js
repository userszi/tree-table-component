// remark插件用于识别和标记图表引用
import { visit } from 'unist-util-visit'

function plugin() {
  function transformer(tree) {
    visit(tree, 'text', function (node) {
      // 检查文本节点是否包含图表引用
      if (/(图表|表)\s*\d+/g.test(node.value)) {
        // 分割文本节点
      const chartRefRegex = /(图表|表)\s*\d+/g
      const parts = []
      let lastIndex = 0
      let match
      
      while ((match = chartRefRegex.exec(node.value)) !== null) {
          // 添加匹配前的文本
          if (match.index > lastIndex) {
            parts.push({
              type: 'text',
              value: node.value.substring(lastIndex, match.index)
            })
          }
          
          // 添加图表引用节点
          parts.push({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['chart-ref']
            },
            children: [
              {
                type: 'text',
                value: match[0]
              }
            ]
          })
          
          lastIndex = match.index + match[0].length
        }
        
        // 添加剩余文本
        if (lastIndex < node.value.length) {
          parts.push({
            type: 'text',
            value: node.value.substring(lastIndex)
          })
        }
        
        // 替换当前节点
        node.type = 'paragraph'
        node.children = parts
      }
    })
  }
  
  return transformer
}

export default plugin