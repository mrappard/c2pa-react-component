import dagre from '@dagrejs/dagre'
import { Node, Edge } from '@xyflow/react'
import { ManifestStore } from 'c2pa-react-component-types'
import { ManifestNodeData } from './ManifestNode'

const NODE_WIDTH = 420
const NODE_HEIGHT = 180
const ROW_GAP = 80  // vertical gap between depth levels
const COL_GAP = 48  // horizontal gap between siblings

export function buildGraph(manifest: ManifestStore): { nodes: Node[]; edges: Edge[] } {
  const { manifests, activeManifest, validation_state } = manifest

  // Build edges: ingredient.active_manifest → current manifest id
  const edges: Edge[] = []

  for (const [id, entry] of Object.entries(manifests)) {
    for (const ingredient of entry.ingredients ?? []) {
      const srcId = ingredient.active_manifest ?? (ingredient as { manifestId?: string }).manifestId
      if (!srcId) continue

      edges.push({
        id: `${srcId}->${id}`,
        source: srcId,
        target: id,
        label: ingredient.relationship ?? '',
        animated: id === activeManifest,
        style: { stroke: '#94a3b8' },
        labelStyle: { fontSize: 11, fill: '#64748b' },
      })
    }
  }

  // Fallback: a manifest store only contains manifests relevant to a single asset's
  // provenance, so any manifest with no ingredient links at all must still relate to
  // the active manifest. Connect it as an (unspecified) ingredient of the active one
  // so it doesn't render as a disconnected node.
  const linkedIds = new Set<string>()
  for (const edge of edges) {
    linkedIds.add(edge.source as string)
    linkedIds.add(edge.target as string)
  }
  for (const id of Object.keys(manifests)) {
    if (id === activeManifest || linkedIds.has(id)) continue

    edges.push({
      id: `${id}->${activeManifest}`,
      source: id,
      target: activeManifest,
      animated: false,
      style: { stroke: '#94a3b8' },
      labelStyle: { fontSize: 11, fill: '#64748b' },
    })
  }

  // Layered DAG layout (Sugiyama-style): ranks by longest path, with
  // crossing-minimization and coordinate assignment handled by dagre.
  const allIds = Object.keys(manifests)
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', nodesep: COL_GAP, ranksep: ROW_GAP })

  for (const id of allIds) {
    graph.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const edge of edges) {
    graph.setEdge(edge.source as string, edge.target as string)
  }

  dagre.layout(graph)

  const nodes: Node[] = allIds.map((id) => {
    const { x, y } = graph.node(id)

    const nodeData: ManifestNodeData = {
      entry: manifests[id],
      isActive: id === activeManifest,
      validationState: id === activeManifest ? validation_state : undefined,
    }

    return {
      id,
      type: 'manifestNode',
      // dagre positions are centers; xyflow positions are top-left corners
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      data: nodeData,
    }
  })

  return { nodes, edges }
}
