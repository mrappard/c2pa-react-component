import dagre from '@dagrejs/dagre'
import { Node, Edge } from '@xyflow/react'
import { ManifestStore } from 'c2pa-react-component-types'
import { ManifestNodeData } from './ManifestNode'
import { NoManifestIngredientNodeData } from './NoManifestIngredientNode'

const NODE_WIDTH = 420
const NODE_HEIGHT = 180
const NO_MANIFEST_NODE_HEIGHT = 110
const ROW_GAP = 80  // vertical gap between depth levels
const COL_GAP = 48  // horizontal gap between siblings

export function buildGraph(manifest: ManifestStore): { nodes: Node[]; edges: Edge[] } {
  const { manifests, activeManifest, validation_state } = manifest

  // Build edges: ingredient.active_manifest → current manifest id.
  // An ingredient with no active_manifest/manifestId has no manifest at all — per
  // Ingredient.adoc ("Existing manifests"), that's a normal, spec-sanctioned state,
  // not something to drop from the graph. It gets its own grey placeholder node
  // instead of a real manifest node.
  const edges: Edge[] = []
  const noManifestNodeIds: Record<string, NoManifestIngredientNodeData> = {}

  for (const [id, entry] of Object.entries(manifests)) {
    ;(entry.ingredients ?? []).forEach((ingredient, index) => {
      const srcId = ingredient.active_manifest ?? (ingredient as { manifestId?: string }).manifestId

      if (srcId) {
        edges.push({
          id: `${srcId}->${id}`,
          source: srcId,
          target: id,
          label: ingredient.relationship ?? '',
          animated: id === activeManifest,
          style: { stroke: '#94a3b8' },
          labelStyle: { fontSize: 11, fill: '#64748b' },
        })
        return
      }

      const noManifestId = `${id}::no-manifest-ingredient::${index}`
      noManifestNodeIds[noManifestId] = {
        title: ingredient.title ?? ingredient.label ?? 'Untitled ingredient',
        relationship: ingredient.relationship,
      }
      edges.push({
        id: `${noManifestId}->${id}`,
        source: noManifestId,
        target: id,
        label: ingredient.relationship ?? '',
        animated: false,
        style: { stroke: '#cbd5e1', strokeDasharray: '4 3' },
        labelStyle: { fontSize: 11, fill: '#94a3b8' },
      })
    })
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
  const manifestIds = Object.keys(manifests)
  const noManifestIds = Object.keys(noManifestNodeIds)
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', nodesep: COL_GAP, ranksep: ROW_GAP })

  for (const id of manifestIds) {
    graph.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const id of noManifestIds) {
    graph.setNode(id, { width: NODE_WIDTH, height: NO_MANIFEST_NODE_HEIGHT })
  }
  for (const edge of edges) {
    graph.setEdge(edge.source as string, edge.target as string)
  }

  dagre.layout(graph)

  const manifestNodes: Node[] = manifestIds.map((id) => {
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

  const noManifestNodes: Node[] = noManifestIds.map((id) => {
    const { x, y } = graph.node(id)

    return {
      id,
      type: 'noManifestIngredientNode',
      position: { x: x - NODE_WIDTH / 2, y: y - NO_MANIFEST_NODE_HEIGHT / 2 },
      data: noManifestNodeIds[id],
    }
  })

  return { nodes: [...manifestNodes, ...noManifestNodes], edges }
}
