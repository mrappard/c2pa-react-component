import { Node, Edge } from '@xyflow/react'
import { ManifestStore } from '../../types'
import { ManifestNodeData } from './ManifestNode'

const NODE_WIDTH = 240
const NODE_HEIGHT = 140
const ROW_GAP = 80  // vertical gap between depth levels
const COL_GAP = 40  // horizontal gap between siblings

export function buildGraph(manifest: ManifestStore): { nodes: Node[]; edges: Edge[] } {
  const { manifests, active_manifest, validation_state } = manifest

  // Build adjacency: which manifests are ingredients of which
  // ingredient.active_manifest → current manifest id
  const childOf: Record<string, string[]> = {} // parent → [children that reference it]
  const edges: Edge[] = []

  for (const [id, entry] of Object.entries(manifests)) {
    for (const ingredient of entry.ingredients ?? []) {
      const srcId = ingredient.active_manifest
      if (!srcId) continue
      if (!childOf[srcId]) childOf[srcId] = []
      childOf[srcId].push(id)

      edges.push({
        id: `${srcId}->${id}`,
        source: srcId,
        target: id,
        label: ingredient.relationship ?? '',
        animated: id === active_manifest,
        style: { stroke: '#94a3b8' },
        labelStyle: { fontSize: 11, fill: '#64748b' },
      })
    }
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
      isActive: id === active_manifest,
      validationState: id === active_manifest ? validation_state : undefined,
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
