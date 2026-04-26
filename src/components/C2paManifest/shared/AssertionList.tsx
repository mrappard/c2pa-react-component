import { ManifestEntry } from '../../../types'

interface AssertionListProps {
  entry: ManifestEntry
  raw: boolean
}

export function AssertionList({ entry, raw }: AssertionListProps) {
  return (
    <div className="c2pa-section">
      <div className="c2pa-section-title">Assertions</div>
      {Object.entries(entry.assertions).map(([key, data], i) => (
        <div key={`${key}-${i}`} className="c2pa-row c2pa-list-item">
          <div className="c2pa-list-item-title">{key}</div>
          {raw && (
            <pre className="c2pa-raw">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
