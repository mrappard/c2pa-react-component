import { useState } from 'react'
import { ManifestEntry, PluginC2PA } from 'c2pa-react-component-types'
import { formatAssertion } from './formatAssertion'
import { getIssuer, getGenerator, getDate, formatDate, getKnownAssertions } from '../../shared/utils'


interface Props {
  selectedIds: string[]
  manifests: Record<string, ManifestEntry>
  plugins?: PluginC2PA[]
}

function getDisplayName(entry: ManifestEntry, id: string): string {
  return getIssuer(entry) || entry.title || id.slice(0, 20)
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="c2pa-panel-field">
      <span className="c2pa-panel-field-label">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function ManifestMeta({ entry }: { entry: ManifestEntry }) {
  const issuer = getIssuer(entry)
  const generator = getGenerator(entry)
  const date = getDate(entry)
  return (
    <div className="c2pa-panel-meta">
      {issuer && <MetaField label="Signed by" value={issuer} />}
      {generator && <MetaField label="Created with" value={generator} />}
      {date && <MetaField label="Date" value={formatDate(date)} />}
    </div>
  )
}

function AssertionRow({
  assertionKey,
  raw,
  handledByPlugin,
}: {
  assertionKey: string
  raw: unknown
  handledByPlugin: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { label, summary, isUnknown } = formatAssertion(assertionKey, raw)

  return (
    <div className="c2pa-panel-assertion-row">
      <div className="c2pa-panel-assertion-label">{label}</div>
      {isUnknown && !handledByPlugin ? (
        expanded ? (
          <div>
            <pre className="c2pa-panel-json">{JSON.stringify(raw, null, 2)}</pre>
            <button className="c2pa-panel-explore-btn" onClick={() => setExpanded(false)}>
              Collapse
            </button>
          </div>
        ) : (
          <button className="c2pa-panel-explore-btn" onClick={() => setExpanded(true)}>
            Explore
          </button>
        )
      ) : isUnknown && handledByPlugin ? (
        <div className="c2pa-panel-assertion-summary c2pa-panel-plugin-handled">Handled by plugin</div>
      ) : (
        <div className="c2pa-panel-assertion-summary">{summary}</div>
      )}
    </div>
  )
}

function SingleView({ entry, knownAssertions }: { entry: ManifestEntry; knownAssertions: Set<string> }) {
  const assertions = entry.assertions ?? {}
  const keys = Object.keys(assertions)
  return (
    <div>
      <div className="c2pa-panel-heading">Manifest details</div>
      <ManifestMeta entry={entry} />
      <div className="c2pa-panel-divider" />
      <div className="c2pa-panel-section-label">Information</div>
      {keys.length === 0 ? (
        <p className="c2pa-panel-muted">No assertions found</p>
      ) : (
        keys.map((key) => (
          <AssertionRow key={key} assertionKey={key} raw={assertions[key]} handledByPlugin={knownAssertions.has(key)} />
        ))
      )}
    </div>
  )
}

function SelectionBadge({ letter }: { letter: 'A' | 'B' }) {
  return <span className={`c2pa-panel-legend c2pa-panel-legend-${letter.toLowerCase()}`}>{letter}</span>
}

function CompareView({
  entryA,
  entryB,
  labelA,
  labelB,
  knownAssertions,
}: {
  entryA: ManifestEntry
  entryB: ManifestEntry
  labelA: string
  labelB: string
  knownAssertions: Set<string>
}) {
  const assertionsA = entryA.assertions ?? {}
  const assertionsB = entryB.assertions ?? {}
  const allKeys = Array.from(new Set([...Object.keys(assertionsA), ...Object.keys(assertionsB)]))

  return (
    <div>
      <div className="c2pa-panel-heading">Comparing</div>
      <div className="c2pa-panel-compare-legends">
        <div className="c2pa-panel-compare-legend-row">
          <SelectionBadge letter="A" />
          <span className="c2pa-panel-compare-name">{labelA}</span>
        </div>
        <div className="c2pa-panel-compare-legend-row">
          <SelectionBadge letter="B" />
          <span className="c2pa-panel-compare-name">{labelB}</span>
        </div>
      </div>
      <div className="c2pa-panel-divider" />
      <div className="c2pa-panel-section-label">Information</div>

      {allKeys.map((key) => {
        const inA = key in assertionsA
        const inB = key in assertionsB
        const same =
          inA && inB && JSON.stringify(assertionsA[key]) === JSON.stringify(assertionsB[key])
        const { label, isUnknown } = formatAssertion(key, assertionsA[key] ?? assertionsB[key])
        const handledByPlugin = isUnknown && knownAssertions.has(key)

        function valueFor(present: boolean, raw: unknown) {
          if (!present) return 'Not present'
          if (handledByPlugin) return 'Handled by plugin'
          return formatAssertion(key, raw).summary
        }

        return (
          <div key={key} className="c2pa-panel-compare-row">
            <div className="c2pa-panel-assertion-label">{label}</div>
            {same ? (
              <div className="c2pa-panel-same">✓ Same in both</div>
            ) : (
              <div className="c2pa-panel-diff">
                <div className="c2pa-panel-diff-row">
                  <SelectionBadge letter="A" />
                  <span className="c2pa-panel-diff-value">{valueFor(inA, assertionsA[key])}</span>
                </div>
                <div className="c2pa-panel-diff-row">
                  <SelectionBadge letter="B" />
                  <span className="c2pa-panel-diff-value">{valueFor(inB, assertionsB[key])}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="c2pa-panel-empty">
      <div className="c2pa-panel-empty-hint">
        Click a node in the graph to view its details, or click two nodes to compare them.
      </div>
    </div>
  )
}

export function AssertionPanel({ selectedIds, manifests, plugins }: Props) {
  const knownAssertions = getKnownAssertions(plugins)

  if (selectedIds.length === 0) return <EmptyState />

  const entryA = manifests[selectedIds[0]]
  if (!entryA) return <EmptyState />

  if (selectedIds.length === 1) return <SingleView entry={entryA} knownAssertions={knownAssertions} />

  const entryB = manifests[selectedIds[1]]
  if (!entryB) return <SingleView entry={entryA} knownAssertions={knownAssertions} />

  return (
    <CompareView
      entryA={entryA}
      entryB={entryB}
      labelA={getDisplayName(entryA, selectedIds[0])}
      labelB={getDisplayName(entryB, selectedIds[1])}
      knownAssertions={knownAssertions}
    />
  )
}
