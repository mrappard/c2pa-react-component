import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap, NodeTypes } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { C2paProvenanceGraphProps } from '../../types'
import { ManifestNode } from './ManifestNode'
import { buildGraph } from './buildGraph'

const nodeTypes: NodeTypes = {
  manifestNode: ManifestNode,
}

export function C2paProvenanceGraph({
  manifest,
  className,
  height = 400,
}: C2paProvenanceGraphProps) {
  const { nodes, edges } = useMemo(() => buildGraph(manifest), [manifest])

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={() => '#3b82f6'} maskColor="rgba(0,0,0,0.05)" />
      </ReactFlow>
    </div>
  )
}

export default C2paProvenanceGraph
