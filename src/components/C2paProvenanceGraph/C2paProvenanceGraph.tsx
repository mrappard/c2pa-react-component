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
import './provenanceGraphOverrides.css'
import type { ReactNode } from 'react'
import { C2paProvenanceGraphProps } from 'c2pa-react-component-types'
import { ManifestNode } from './ManifestNode'
import { NoManifestIngredientNode } from './NoManifestIngredientNode'
import { buildGraph } from './buildGraph'
import { ProvenanceGraphContext } from './ProvenanceGraphContext'

interface SelectableGraphProps extends C2paProvenanceGraphProps {
  selectedIds?: string[]
  onNodeClick?: (id: string) => void
  resolveUri?: (uri: string, format?: string) => ReactNode
}

const nodeTypes: NodeTypes = {
  manifestNode: ManifestNode,
  noManifestIngredientNode: NoManifestIngredientNode,
}

export function C2paProvenanceGraph({
  manifest,
  className,
  height = 400,
  selectedIds = [],
  onNodeClick,
  resolveUri,
}: SelectableGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges] = useEdgesState<Edge>([])

  useEffect(() => {
    const { nodes: n, edges: e } = buildGraph(manifest)
    setNodes(n)
    setEdges(e)
  }, [manifest, setNodes, setEdges])

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
  }, [selectedIds, setNodes])

  return (
    <ProvenanceGraphContext.Provider value={{ resolveUri }}>
    <div className={className} style={{ width: '100%', height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, node) => {
          // No-manifest placeholder nodes have no manifest entry to show in the
          // detail panel — selecting one would look up an undefined entry there.
          if (node.type === 'noManifestIngredientNode') return
          onNodeClick?.(node.id)
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
    </ProvenanceGraphContext.Provider>
  )
}

export default C2paProvenanceGraph
