import { Handle, Position, NodeProps } from '@xyflow/react'
import type { ReactNode } from 'react'
import { ManifestEntry } from 'c2pa-react-component-types'
import { formatDate, getDate, getGenerator, getIssuer, getSignerLogo, type SignerLogo } from '../C2paManifest/shared/utils'
import { useProvenanceGraphContext } from './ProvenanceGraphContext'
import '../C2paManifest/styles/c2paManifest.css'

export interface ManifestNodeData {
  entry: ManifestEntry
  isActive: boolean
  validationState: 'Valid' | 'Invalid' | 'Unknown' | undefined
  isSelected?: boolean
  isCompared?: boolean
  isComparingMode?: boolean
  [key: string]: unknown
}

const validationColors: Record<string, { bg: string; text: string }> = {
  Valid: { bg: '#dcfce7', text: '#15803d' },
  Invalid: { bg: '#fee2e2', text: '#b91c1c' },
  Unknown: { bg: '#fef9c3', text: '#854d0e' },
}

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

function getTitle(entry: ManifestEntry) {
  return getGenerator(entry) || getIssuer(entry) || entry.title || entry.label || 'Unknown source'
}

function getThumb(entry: ManifestEntry) {
  return (
    (entry as any).thumbnail?.url ||
    (entry as any).thumbnail ||
    (entry as any).image ||
    undefined
  )
}

function SourceBadge({ label, logo, resolveUri }: { label: string; logo?: SignerLogo; resolveUri?: (uri: string, format?: string) => ReactNode }) {
  if (logo) {
    if (resolveUri) return <>{resolveUri(logo.uri, logo.format)}</>
    return <img src={logo.uri} alt={label} className="c2pa-signer-logo" />
  }
  const initials = label
    .split(/\s+/)
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return <span className="c2pa-source-badge">{initials}</span>
}

function Thumbnail({ entry }: { entry: ManifestEntry }) {
  const thumb = getThumb(entry)

  return (
    <div className="c2pa-thumb">
      {thumb ? <img src={thumb} alt="" /> : null}
    </div>
  )
}

export function ManifestNode({ data }: NodeProps) {
  const { entry, isActive, validationState, isSelected, isCompared, isComparingMode } = data as ManifestNodeData
  const { resolveUri } = useProvenanceGraphContext()
  const selectionLabel = isSelected ? 'A' : isCompared ? 'B' : undefined
  const isDimmed = isComparingMode && !isSelected && !isCompared

  const title = getTitle(entry)
  const issuer = getIssuer(entry)
  const generator = getGenerator(entry)
  const date = getDate(entry)
  const signerLogo = getSignerLogo(entry)

  const actions = Object.values(entry.assertions || {})
    .flatMap((assertion) => {
      const data =
        typeof assertion === 'object' && assertion !== null && 'data' in assertion
          ? assertion.data
          : assertion
      const actionData = data as { actions?: { action: string }[] } | null
      return actionData?.actions?.map((act) => act.action) ?? []
    })
    .slice(0, 3)

  const validationColor = validationState ? validationColors[validationState] : undefined

  return (
    <div className={cx(
      'c2pa-card',
      'c2pa-graph-node',
      isActive && 'c2pa-graph-node--active',
      isSelected && 'c2pa-graph-node--selected',
      isCompared && 'c2pa-graph-node--compared',
      isDimmed && 'c2pa-graph-node--dimmed',
    )} style={{ cursor: 'pointer' }}>
      {selectionLabel && (
        <div className={`c2pa-graph-selection-badge c2pa-graph-selection-badge--${selectionLabel.toLowerCase()}`}>
          {selectionLabel}
        </div>
      )}
      <Handle type="target" position={Position.Top} />

      <div className="c2pa-manifest-row-main">
        <Thumbnail entry={entry} />
        <div className="c2pa-manifest-row-content">
          <div className="c2pa-manifest-row-heading">
            <SourceBadge label={title} logo={signerLogo} resolveUri={resolveUri} />
            <div className="c2pa-title">{title}</div>
            {isActive && <span className="c2pa-active-badge">Active</span>}
          </div>

          {date && <div className="c2pa-date">{formatDate(date)}</div>}

          {validationState && validationColor && (
            <div className="c2pa-graph-validation">
              <span
                className="c2pa-pill"
                style={{ backgroundColor: validationColor.bg, color: validationColor.text }}
              >
                {validationState}
              </span>
            </div>
          )}
        </div>
      </div>

      {issuer && <div className="c2pa-row c2pa-graph-row"><span className="c2pa-label">Signed by:</span>{issuer}</div>}
      {generator && <div className="c2pa-row c2pa-graph-row"><span className="c2pa-label">Generator:</span>{generator}</div>}

      {actions.length > 0 && (
        <div className="c2pa-section c2pa-pill-list">
          {actions.map((a) => (
            <span key={a} className="c2pa-pill c2pa-graph-action">
              {a.replace('c2pa.', '')}
            </span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
