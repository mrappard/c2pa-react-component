import { ManifestEntry } from '../../../types'
import { section, row, labelStyle } from './styles'

interface AssertionListProps {
  entry: ManifestEntry
  raw: boolean
}

export function AssertionList({ entry, raw }: AssertionListProps) {
  return (
    <div style={section}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Assertions</div>
      {entry.assertions.map((a, i) => (
        <div key={`${a.label}-${i}`} style={{ ...row, paddingBottom: 6, borderBottom: '1px solid #f8fafc' }}>
          <div style={{ fontWeight: 500 }}>{a.label}</div>
          {a.kind && <div><span style={labelStyle}>Kind:</span>{a.kind}</div>}
          {raw && (
            <pre style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 4, fontSize: 11, margin: '4px 0 0', overflowX: 'auto' }}>
              {JSON.stringify(a.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
