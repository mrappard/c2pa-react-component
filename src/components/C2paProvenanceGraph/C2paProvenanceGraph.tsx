import { useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { C2paProvenanceGraphProps } from 'c2pa-react-component-types'
import { ManifestNode } from './ManifestNode'
import { buildGraph } from './buildGraph'

interface SelectableGraphProps extends C2paProvenanceGraphProps {
  selectedIds?: string[]
  onNodeClick?: (id: string) => void
}

const nodeTypes: NodeTypes = {
  manifestNode: ManifestNode,
}

export function C2paProvenanceGraph({
  manifest,
  className,
  height = 400,
  selectedIds = [],
  onNodeClick,
}: SelectableGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges] = useEdgesState<Edge>([])

  useEffect(() => {
    const { nodes: n, edges: e } = buildGraph(manifest)
    setNodes(n)
    setEdges(e)
  }, [manifest])

  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: selectedIds[0] === n.id,
          isCompared: selectedIds[1] === n.id,
          isComparingMode: selectedIds.length === 2,
        },
      }))
    )
  }, [selectedIds])

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default C2paProvenanceGraph
