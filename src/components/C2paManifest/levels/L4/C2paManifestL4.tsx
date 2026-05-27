import { useState } from 'react'
import { ManifestEntry, ManifestStore } from 'c2pa-react-component-types'
import { LevelProps } from '../../types'
import { formatAssertion } from '../L3/formatAssertion'
import { validationColor } from '../../shared/utils'

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="c2pa-l4-accordion">
      <button
        className="c2pa-l4-accordion-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="c2pa-l4-chevron">{open ? '▾' : '▸'}</span>
        {label}
      </button>
      {open && <div className="c2pa-l4-accordion-content">{children}</div>}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="c2pa-l4-field">
      <span className="c2pa-l4-field-label">{label}</span>
      <span className="c2pa-l4-field-value">{value}</span>
    </div>
  )
}

function AssertionRow({ assertionKey, raw }: { assertionKey: string; raw: unknown }) {
  const [showRaw, setShowRaw] = useState(false)
  const { label, summary, isUnknown } = formatAssertion(assertionKey, raw)

  return (
    <div className="c2pa-l4-assertion">
      <div className="c2pa-l4-assertion-header">
        <div className="c2pa-l4-assertion-labels">
          <span className="c2pa-l4-assertion-label">{label}</span>
          <span className="c2pa-l4-assertion-key">{assertionKey}</span>
        </div>
        <button className="c2pa-l4-toggle-btn" onClick={() => setShowRaw((r) => !r)}>
          {showRaw ? 'Summary' : 'Raw'}
        </button>
      </div>
      {showRaw ? (
        <pre className="c2pa-l4-json">{JSON.stringify(raw, null, 2)}</pre>
      ) : (
        <div className="c2pa-l4-assertion-summary">
          {isUnknown
            ? <span className="c2pa-l4-muted">{JSON.stringify(raw).slice(0, 140)}&hellip;</span>
            : summary}
        </div>
      )}
    </div>
  )
}

function SignatureContent({ sig }: { sig: ManifestEntry['signatureInfo'] }) {
  if (!sig) return <p className="c2pa-l4-muted">No signature info</p>
  return (
    <div className="c2pa-l4-fields">
      <Field label="Algorithm" value={sig.alg} />
      <Field label="Issuer" value={sig.issuer} />
      <Field label="Common name" value={sig.common_name} />
      <Field label="Serial" value={sig.cert_serial_number} />
      <Field label="Signed at" value={sig.time} />
    </div>
  )
}

function SoftwareContent({ entry }: { entry: ManifestEntry }) {
  const info = entry.claimGeneratorInfo?.[0] as Record<string, string> | undefined
  const extra = info
    ? Object.entries(info).filter(([k]) => k !== 'name' && k !== 'version')
    : []
  return (
    <div className="c2pa-l4-fields">
      <Field label="Name" value={info?.name ?? (entry.claimGenerator as string | null | undefined)} />
      <Field label="Version" value={info?.version} />
      <Field label="Instance ID" value={entry.instanceId} />
      {extra.map(([k, v]) => <Field key={k} label={k} value={String(v)} />)}
    </div>
  )
}

function AssertionsContent({ assertions }: { assertions: Record<string, unknown> }) {
  const keys = Object.keys(assertions)
  if (!keys.length) return <p className="c2pa-l4-muted">No assertions</p>
  return (
    <div className="c2pa-l4-assertions-list">
      {keys.map((key) => (
        <AssertionRow key={key} assertionKey={key} raw={assertions[key]} />
      ))}
    </div>
  )
}

function IngredientsContent({ ingredients }: { ingredients: ManifestEntry['ingredients'] }) {
  if (!ingredients?.length) return <p className="c2pa-l4-muted">No ingredients</p>
  return (
    <div className="c2pa-l4-ingredients-list">
      {ingredients.map((ing, i) => (
        <div key={i} className="c2pa-l4-ingredient">
          <div className="c2pa-l4-ingredient-title">{ing.title ?? `Ingredient ${i + 1}`}</div>
          {ing.format && <div className="c2pa-l4-muted">{ing.format}</div>}
          {ing.relationship && <div className="c2pa-l4-muted">Relationship: {ing.relationship}</div>}
          {ing.active_manifest && (
            <div className="c2pa-l4-mono c2pa-l4-muted">→ {ing.active_manifest}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function ManifestBlock({
  id,
  entry,
  isActive,
}: {
  id: string
  entry: ManifestEntry
  isActive: boolean
}) {
  const assertions = (entry.assertions ?? {}) as Record<string, unknown>
  const assertionCount = Object.keys(assertions).length
  const ingredientCount = entry.ingredients?.length ?? 0

  return (
    <div className="c2pa-l4-manifest-block">
      <div className="c2pa-l4-manifest-header">
        <span className="c2pa-l4-manifest-title">{entry.title ?? id}</span>
        {isActive && <span className="c2pa-active-badge">Active</span>}
      </div>
      <div className="c2pa-l4-manifest-id">{id}</div>

      <Accordion label="Signature">
        <SignatureContent sig={entry.signatureInfo} />
      </Accordion>
      <Accordion label="Software">
        <SoftwareContent entry={entry} />
      </Accordion>
      <Accordion label={`Assertions (${assertionCount})`}>
        <AssertionsContent assertions={assertions} />
      </Accordion>
      {ingredientCount > 0 && (
        <Accordion label={`Ingredients (${ingredientCount})`}>
          <IngredientsContent ingredients={entry.ingredients} />
        </Accordion>
      )}
    </div>
  )
}

function ValidationSection({ store }: { store: ManifestStore }) {
  const results = store.validation_results?.activeManifest
  if (!results) return null
  const { success = [], informational = [], failure = [] } = results
  if (!success.length && !informational.length && !failure.length) return null

  return (
    <div className="c2pa-l4-validation">
      <div className="c2pa-l4-section-label">Validation results</div>
      {failure.map((r, i) => (
        <div key={i} className="c2pa-l4-val-item c2pa-l4-val-failure">
          <span className="c2pa-l4-val-icon">✕</span>
          <div>
            <div className="c2pa-l4-val-code">{r.code}</div>
            {r.explanation && <div className="c2pa-l4-muted">{r.explanation}</div>}
          </div>
        </div>
      ))}
      {informational.map((r, i) => (
        <div key={i} className="c2pa-l4-val-item c2pa-l4-val-info">
          <span className="c2pa-l4-val-icon">ℹ</span>
          <div>
            <div className="c2pa-l4-val-code">{r.code}</div>
            {r.explanation && <div className="c2pa-l4-muted">{r.explanation}</div>}
          </div>
        </div>
      ))}
      {success.map((r, i) => (
        <div key={i} className="c2pa-l4-val-item c2pa-l4-val-success">
          <span className="c2pa-l4-val-icon">✓</span>
          <div>
            <div className="c2pa-l4-val-code">{r.code}</div>
            {r.explanation && <div className="c2pa-l4-muted">{r.explanation}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function C2paManifestL4({ manifest, className }: LevelProps) {
  const store = manifest.manifestStore
  if (!store) return <div className={className}>No manifest store found.</div>

  const { bg, text } = validationColor(store.validation_state)
  const entries = Object.entries(store.manifests)
  const sorted = [
    ...entries.filter(([id]) => id === store.activeManifest),
    ...entries.filter(([id]) => id !== store.activeManifest),
  ]

  return (
    <div className={['c2pa-l4', className].filter(Boolean).join(' ')}>
      <div className="c2pa-l4-header">
        <span className="c2pa-l4-title">Forensic view</span>
        {store.validation_state && (
          <span className="c2pa-pill" style={{ background: bg, color: text }}>
            {store.validation_state}
          </span>
        )}
      </div>

      {sorted.map(([id, entry]) => (
        <ManifestBlock
          key={id}
          id={id}
          entry={entry}
          isActive={id === store.activeManifest}
        />
      ))}

      <ValidationSection store={store} />
    </div>
  )
}
