import { Handle, Position, NodeProps } from '@xyflow/react'
import { ManifestEntry } from '../../types'

export interface ManifestNodeData {
  entry: ManifestEntry
  isActive: boolean
  validationState: 'Valid' | 'Invalid' | 'Unknown' | undefined
  [key: string]: unknown
}

const stateColors: Record<string, string> = {
  Valid: '#16a34a',
  Invalid: '#dc2626',
  Unknown: '#ca8a04',
}

const styles: Record<string, React.CSSProperties> = {
  node: {
    background: '#fff',
    border: '2px solid #e2e8f0',
    borderRadius: 10,
    padding: '12px 16px',
    minWidth: 200,
    fontFamily: 'sans-serif',
    fontSize: 13,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  activeNode: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59,130,246,0.2)',
  },
  badge: {
    display: 'inline-block',
    borderRadius: 4,
    padding: '1px 6px',
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 6,
  },
  title: {
    fontWeight: 700,
    marginBottom: 4,
    color: '#0f172a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 200,
  },
  row: {
    color: '#475569',
    marginBottom: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 200,
  },
  actions: {
    marginTop: 6,
    paddingTop: 6,
    borderTop: '1px solid #f1f5f9',
    color: '#64748b',
    fontSize: 11,
  },
}

export function ManifestNode({ data }: NodeProps) {
  const { entry, isActive, validationState } = data as ManifestNodeData

  const generator = entry.claim_generator_info?.[0]?.name ?? entry.claim_generator
  const issuer = entry.signature_info?.issuer

  const actions = entry.assertions
    .flatMap((a) => {
      const d = a.data as { actions?: { action: string }[] } | null
      return d?.actions?.map((act) => act.action) ?? []
    })
    .slice(0, 3)

  const stateColor = validationState ? stateColors[validationState] : '#94a3b8'
  const nodeStyle = isActive
    ? { ...styles.node, ...styles.activeNode }
    : styles.node

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {isActive && (
          <span style={{ ...styles.badge, background: '#dbeafe', color: '#1d4ed8' }}>
            Active
          </span>
        )}
        {validationState && (
          <span style={{ ...styles.badge, background: `${stateColor}20`, color: stateColor }}>
            {validationState}
          </span>
        )}
      </div>

      <div style={styles.title}>{entry.title ?? entry.label}</div>

      {generator && <div style={styles.row}>Generator: {generator}</div>}
      {issuer && <div style={styles.row}>Issuer: {issuer}</div>}

      {actions.length > 0 && (
        <div style={styles.actions}>
          {actions.map((a) => (
            <div key={a}>{a.replace('c2pa.', '')}</div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
