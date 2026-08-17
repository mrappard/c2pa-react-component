import { useState } from 'react'
import { ManifestEntry, PluginC2PA, VerificationOutcome } from 'c2pa-react-component-types'
import { formatAssertion } from './formatAssertion'
import { getIssuer, getGenerator, getDate, formatDate } from '../../shared/utils'

interface Props {
  selectedIds: string[]
  manifests: Record<string, ManifestEntry>
  manifest: VerificationOutcome
  plugins?: PluginC2PA[]
}

function buildPluginMap(plugins: PluginC2PA[] | undefined): Map<string, PluginC2PA> {
  const map = new Map<string, PluginC2PA>()
  for (const plugin of plugins ?? []) {
    for (const key of plugin.knownAssertions ?? []) {
      map.set(key, plugin)
    }
  }
  return map
}

function getRelevantPlugins(assertionKeys: string[], pluginMap: Map<string, PluginC2PA>): PluginC2PA[] {
  const seen = new Set<PluginC2PA>()
  for (const key of assertionKeys) {
    const p = pluginMap.get(key)
    if (p) seen.add(p)
  }
  return Array.from(seen)
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

function AssertionRow({ assertionKey, raw }: { assertionKey: string; raw: unknown }) {
  const [expanded, setExpanded] = useState(false)
  const { label, summary, isUnknown } = formatAssertion(assertionKey, raw)

  return (
    <div className="c2pa-panel-assertion-row">
      <div className="c2pa-panel-assertion-label">{label}</div>
      {isUnknown ? (
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
      ) : (
        <div className="c2pa-panel-assertion-summary">{summary}</div>
      )}
    </div>
  )
}

function SingleView({
  id,
  entry,
  manifest,
  pluginMap,
}: {
  id: string
  entry: ManifestEntry
  manifest: VerificationOutcome
  pluginMap: Map<string, PluginC2PA>
}) {
  const assertions = entry.assertions ?? {}
  const keys = Object.keys(assertions).sort()
  const standardKeys = keys.filter((k) => !pluginMap.has(k))
  const relevantPlugins = getRelevantPlugins(keys, pluginMap)

  return (
    <div>
      <div className="c2pa-panel-heading">Manifest details</div>
      <div className="c2pa-panel-field">
        <span className="c2pa-panel-field-label">ID</span>
        <span className="c2pa-panel-id">{id}</span>
      </div>
      <ManifestMeta entry={entry} />
      <div className="c2pa-panel-divider" />
      <div className="c2pa-panel-section-label">Information</div>
      {standardKeys.length === 0 && relevantPlugins.length === 0 && (
        <p className="c2pa-panel-muted">No assertions found</p>
      )}
      {standardKeys.map((key) => (
        <AssertionRow key={key} assertionKey={key} raw={assertions[key]} />
      ))}
      {relevantPlugins.map((Plugin, i) => (
        <Plugin key={i} manifest={manifest} entry={entry} />
      ))}
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
  manifest,
  pluginMap,
}: {
  entryA: ManifestEntry
  entryB: ManifestEntry
  labelA: string
  labelB: string
  manifest: VerificationOutcome
  pluginMap: Map<string, PluginC2PA>
}) {
  const assertionsA = entryA.assertions ?? {}
  const assertionsB = entryB.assertions ?? {}
  const allKeys = Array.from(new Set([...Object.keys(assertionsA), ...Object.keys(assertionsB)])).sort()
  const standardKeys = allKeys.filter((k) => !pluginMap.has(k))
  const relevantPlugins = getRelevantPlugins(allKeys, pluginMap)

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

      {standardKeys.map((key) => {
        const inA = key in assertionsA
        const inB = key in assertionsB
        const same =
          inA && inB && JSON.stringify(assertionsA[key]) === JSON.stringify(assertionsB[key])
        const { label } = formatAssertion(key, assertionsA[key] ?? assertionsB[key])

        return (
          <div key={key} className="c2pa-panel-compare-row">
            <div className="c2pa-panel-assertion-label">{label}</div>
            {same ? (
              <div className="c2pa-panel-same">✓ Same in both</div>
            ) : (
              <div className="c2pa-panel-diff">
                <div className="c2pa-panel-diff-row">
                  <SelectionBadge letter="A" />
                  <span className="c2pa-panel-diff-value">
                    {inA ? formatAssertion(key, assertionsA[key]).summary : 'Not present'}
                  </span>
                </div>
                <div className="c2pa-panel-diff-row">
                  <SelectionBadge letter="B" />
                  <span className="c2pa-panel-diff-value">
                    {inB ? formatAssertion(key, assertionsB[key]).summary : 'Not present'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {relevantPlugins.length > 0 && (
        <>
          <div className="c2pa-panel-divider" />
          <div className="c2pa-panel-section-label">Plugin data</div>
          {relevantPlugins.map((Plugin, i) => (
            <Plugin key={i} manifest={manifest} entry={entryA} />
          ))}
        </>
      )}
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

export function AssertionPanel({ selectedIds, manifests, manifest, plugins }: Props) {
  const pluginMap = buildPluginMap(plugins)

  if (selectedIds.length === 0) return <EmptyState />

  const entryA = manifests[selectedIds[0]]
  if (!entryA) return <EmptyState />

  if (selectedIds.length === 1) return <SingleView id={selectedIds[0]} entry={entryA} manifest={manifest} pluginMap={pluginMap} />

  const entryB = manifests[selectedIds[1]]
  if (!entryB) return <SingleView id={selectedIds[0]} entry={entryA} manifest={manifest} pluginMap={pluginMap} />

  return (
    <CompareView
      entryA={entryA}
      entryB={entryB}
      labelA={getDisplayName(entryA, selectedIds[0])}
      labelB={getDisplayName(entryB, selectedIds[1])}
      manifest={manifest}
      pluginMap={pluginMap}
    />
  )
}
