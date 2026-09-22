import { Handle, Position, NodeProps } from '@xyflow/react'

export interface NoManifestIngredientNodeData {
  title: string
  relationship?: string
  [key: string]: unknown
}

export function NoManifestIngredientNode({ data }: NodeProps) {
  const { title, relationship } = data as NoManifestIngredientNodeData

  return (
    <div className="c2pa-card c2pa-graph-node c2pa-graph-node--no-manifest" style={{ cursor: 'default' }}>
      <div className="c2pa-manifest-row-main">
        <div className="c2pa-manifest-row-content">
          <div className="c2pa-manifest-row-heading">
            <div className="c2pa-title">{title}</div>
          </div>
          <div className="c2pa-content-label c2pa-content-label--row">No manifest present</div>
          {relationship && (
            <div className="c2pa-row c2pa-graph-row">
              <span className="c2pa-label">Relationship:</span>{relationship}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
