import { Node, Edge } from '@xyflow/react'
import { ManifestStore } from 'c2pa-react-component-types'
import { ManifestNodeData } from './ManifestNode'

const NODE_WIDTH = 420
const NODE_HEIGHT = 180
const ROW_GAP = 80  // vertical gap between depth levels
const COL_GAP = 48  // horizontal gap between siblings

export function buildGraph(manifest: ManifestStore): { nodes: Node[]; edges: Edge[] } {
  const { manifests, activeManifest, validation_state } = manifest

  // Build adjacency: which manifests are ingredients of which
  // ingredient.active_manifest → current manifest id
  const childOf: Record<string, string[]> = {} // parent → [children that reference it]
  const edges: Edge[] = []

  for (const [id, entry] of Object.entries(manifests)) {
    for (const ingredient of entry.ingredients ?? []) {
      const srcId = ingredient.active_manifest ?? (ingredient as { manifestId?: string }).manifestId
      if (!srcId) continue
      if (!childOf[srcId]) childOf[srcId] = []
      childOf[srcId].push(id)

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

    if (!childOf[id]) childOf[id] = []
    childOf[id].push(activeManifest)

    edges.push({
      id: `${id}->${activeManifest}`,
      source: id,
      target: activeManifest,
      animated: false,
      style: { stroke: '#94a3b8' },
      labelStyle: { fontSize: 11, fill: '#64748b' },
    })
  }

  // Assign column depths via BFS from roots (manifests not referenced as ingredients)
  const allIds = Object.keys(manifests)
  const referenced = new Set(edges.map((e) => e.target as string))
  const roots = allIds.filter((id) => !referenced.has(id))

  const depth: Record<string, number> = {}
  const queue = [...roots]
  roots.forEach((r) => (depth[r] = 0))
  while (queue.length) {
    const id = queue.shift()!
    for (const childId of childOf[id] ?? []) {
      if (depth[childId] === undefined) {
        depth[childId] = depth[id] + 1
        queue.push(childId)
      }
    }
  }
  // Fallback for any disconnected manifests
  allIds.forEach((id) => { if (depth[id] === undefined) depth[id] = 0 })

  // Group by depth level (rows in top-down layout)
  const levels: Record<number, string[]> = {}
  for (const id of allIds) {
    const lvl = depth[id]
    if (!levels[lvl]) levels[lvl] = []
    levels[lvl].push(id)
  }

  const maxSiblings = Math.max(...Object.values(levels).map((l) => l.length))
  const totalWidth = maxSiblings * (NODE_WIDTH + COL_GAP)

  const nodes: Node[] = allIds.map((id) => {
    const lvl = depth[id]
    const col = levels[lvl].indexOf(id)
    const lvlTotal = levels[lvl].length

    const y = lvl * (NODE_HEIGHT + ROW_GAP)
    const lvlWidth = lvlTotal * (NODE_WIDTH + COL_GAP)
    const x = (totalWidth - lvlWidth) / 2 + col * (NODE_WIDTH + COL_GAP)

    const nodeData: ManifestNodeData = {
      entry: manifests[id],
      isActive: id === activeManifest,
      validationState: id === activeManifest ? validation_state : undefined,
    }

    return {
      id,
      type: 'manifestNode',
      position: { x, y },
      data: nodeData,
    }
  })

  return { nodes, edges }
}
