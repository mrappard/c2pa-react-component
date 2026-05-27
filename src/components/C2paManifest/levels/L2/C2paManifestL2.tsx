import React from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { ManifestEntry, PluginC2PA, VerificationOutcome } from 'c2pa-react-component-types'
import { LevelProps } from '../../types'
import {
  getIssuer,
  getGenerator,
  getDate,
  formatDate,
  buildManifestChain,
  getContentLabel,
  getSignerLogo,
  isVideo,
} from '../../shared/utils'


const COLLAPSE_THRESHOLD = 4

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getSigner(entry: ManifestEntry) {
  return getIssuer(entry) || entry.title || entry.label || 'Unknown signer'
}

function getThumb(entry: ManifestEntry) {
  return (
    (entry as any).thumbnail?.url ||
    (entry as any).thumbnail ||
    (entry as any).image ||
    undefined
  )
}

function FilmstripIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="0" y="7" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <rect x="0" y="11" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <rect x="0" y="15" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <rect x="21.5" y="7" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <rect x="21.5" y="11" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <rect x="21.5" y="15" width="2.5" height="2" rx="0.5" fill="currentColor"/>
      <line x1="2" y1="9.5" x2="22" y2="9.5" stroke="currentColor" strokeWidth="1"/>
      <line x1="2" y1="14.5" x2="22" y2="14.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  )
}

function SourceBadge({ label, logoUrl }: { label: string; logoUrl?: string }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={label} className="c2pa-signer-logo" />
  }
  const initials = label
    .split(/\s+/)
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <span className="c2pa-source-badge">
      {initials}
    </span>
  )
}

function Thumbnail({
  entry,
  showCrBadge = false,
}: {
  entry: ManifestEntry
  showCrBadge?: boolean
}) {
  const thumb = getThumb(entry)
  const video = isVideo(entry)

  return (
    <div className="c2pa-thumb">
      {thumb ? (
        <img src={thumb} alt="" />
      ) : video ? (
        <div className="c2pa-thumb-video">
          <FilmstripIcon />
        </div>
      ) : null}

      {showCrBadge && (
        <div className="c2pa-thumb-badge">
          <CRIcon size={22} />
        </div>
      )}
    </div>
  )
}

function ManifestRow({
  manifest,
  entry,
  active,
  invalid,
    plugin
}: {
  manifest: VerificationOutcome
  entry: ManifestEntry
  active?: boolean
  invalid?: boolean
    plugin?:PluginC2PA[]
}) {

  const signer = getSigner(entry)
  const generator = getGenerator(entry)
  const signerLogo = getSignerLogo(entry)
  const date = getDate(entry)
  const label = !invalid ? getContentLabel(entry) : undefined

  return (
    <div className="c2pa-manifest-row">
      <div className="c2pa-manifest-row-main">
        <Thumbnail entry={entry} />
        <div className="c2pa-manifest-row-content">
          {!invalid && <div className="c2pa-signed-by-label">Signed by</div>}
          <div className="c2pa-manifest-row-heading">
            <SourceBadge label={signer} logoUrl={signerLogo} />
            <div className="c2pa-title">
              {invalid ? 'Invalid' : signer}
            </div>

            {active && (
              <span className="c2pa-active-badge">
                Active
              </span>
            )}
          </div>

          {generator && !invalid && (
            <div className="c2pa-generator">
              {generator}
            </div>
          )}

          {label && (
            <div className="c2pa-content-label c2pa-content-label--row">
              {label}
            </div>
          )}

          {date && !invalid && (
            <div className="c2pa-date">
              {formatDate(date)}
            </div>
          )}

          {invalid && (
            <div className="c2pa-invalid-text">
              Content credentials are invalid or tampered.
            </div>
          )}

        </div>

      </div>
      <div className="c2pa-more-info">
        {
          plugin?.map((PluginComponent) => (
            <PluginComponent manifest={manifest} level={1} />
          ))

        }
      </div>
    </div>
  )
}

function Timeline({
  middleCount,
  hasOrigin,
}: {
  middleCount: number
  hasOrigin: boolean
}) {
  return (
    <div className="c2pa-timeline">
      <span className="c2pa-timeline-dot" />

      <div className="c2pa-timeline-line" />

      {middleCount > 0 && (
        <>
          <div className="c2pa-timeline-dotted" />
          <div className="c2pa-timeline-count">
            {middleCount}
          </div>
          <div className="c2pa-timeline-dotted" />
        </>
      )}

      {hasOrigin && (
        <>
          <div className="c2pa-timeline-line" />
          <span className="c2pa-timeline-dot" />
        </>
      )}
    </div>
  )
}

function ViewMoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="c2pa-button">
      View more
    </button>
  )
}

function OriginStrip({ origins }: { origins: ManifestEntry[] }) {
  if (!origins.length) return null

  return (
    <>
      <div className="c2pa-divider" />
      <div className="c2pa-section-title">
        Assets used ({origins.length})
      </div>
      <div className="c2pa-origin-list">
        {origins.map((entry, i) => (
          <Thumbnail key={i} entry={entry} showCrBadge={i === 0} />
        ))}
      </div>
    </>
  )
}

function InvalidState({
  entry,
  className,
  onViewMore,
  manifest,
}: {
  entry: ManifestEntry
  className?: string
  onViewMore?: () => void
  manifest: VerificationOutcome,
  plugin?:PluginC2PA[]
}) {
  return (
    <div className={cx('c2pa-card', className)}>
      <ManifestRow manifest={manifest} entry={entry} invalid />

      <div className="c2pa-divider" />

      <div className="c2pa-alert">
        Someone has changed or tampered with the content credentials, so the available data should be disregarded.
      </div>

      <div className="c2pa-divider" />
      <ViewMoreButton onClick={onViewMore} />
    </div>
  )
}

function ManifestSummary({
  manifest,
  activeManifest,
  className,
  onViewMore,
  plugin
}: LevelProps) {

  return (
    <div className={cx('c2pa-card', className)}>
      <ManifestRow manifest={manifest} entry={activeManifest} plugin={plugin} active />


      {onViewMore && <>
        <div className="c2pa-divider" />

        <ViewMoreButton onClick={onViewMore} />
      </>}
    </div>
  )
}

function ProvenanceSummary({
  manifest,
  className,
  onViewMore,
  plugin
}: {
  manifest: VerificationOutcome
  className?: string
  onViewMore?: () => void
    plugin?:PluginC2PA[]
}) {

  if (!manifest.manifestStore) {
    return (
      <div className={cx('c2pa-card', className)}>
        <div className="c2pa-alert">
          No provenance information available.
        </div>
      </div>
    )
  }
  const chain = buildManifestChain(manifest.manifestStore)

  const activeIds = chain[0] ?? []
  const originIds = chain[chain.length - 1] ?? []
  const middleLevels = chain.slice(1, -1)

  const middleCount = middleLevels.reduce((sum, level) => sum + level.length, 0)
  const totalCount = chain.reduce((sum, level) => sum + level.length, 0)
  const shouldCollapse = totalCount > COLLAPSE_THRESHOLD

  const activeEntry = manifest.manifestStore.manifests[activeIds[0]]
  const originEntries = originIds
    .map((id) => manifest.manifestStore!.manifests[id])
    .filter(Boolean)

  const visibleMiddleEntries = shouldCollapse
    ? []
    : middleLevels.flat().map((id) => manifest.manifestStore!.manifests[id]).filter(Boolean)

  return (
    <div className={cx('c2pa-card', className)}>
      <div className="c2pa-timeline-layout">
        <Timeline
          middleCount={shouldCollapse ? middleCount : 0}
          hasOrigin={originEntries.length > 0}
        />

        <div>
          {activeEntry && <ManifestRow manifest={manifest} entry={activeEntry} plugin={plugin} active />}

          {shouldCollapse && middleCount > 0 && (
            <>
              <div className="c2pa-divider" />
              <div className="c2pa-additional-steps">
                <span>Additional steps</span>
                <span className="c2pa-muted">⌄</span>
              </div>
            </>
          )}

          {!shouldCollapse &&
            visibleMiddleEntries.map((entry, i) => (
              <React.Fragment key={i}>
                <div className="c2pa-divider" />
                <ManifestRow manifest={manifest} entry={entry} plugin={plugin} />
              </React.Fragment>
            ))}

          {originEntries[0] && (
            <>
              <div className="c2pa-divider" />
              <ManifestRow manifest={manifest} entry={originEntries[0]} plugin={plugin} />
            </>
          )}
        </div>
      </div>

      {originEntries.length > 1 && <OriginStrip origins={originEntries} />}

      <div className="c2pa-divider" />

      <ViewMoreButton onClick={onViewMore} />

      <div className="c2pa-footnote">
        Provenance data is embedded in this asset.
      </div>
    </div>
  )
}

export function C2paManifestL2({
  manifest,
  activeManifest,
  className,
  onViewMore,
  officialList = false,
  plugin
}: LevelProps) {
  const isInvalid =
    officialList ?
      !manifest.manifestStore?.validation_state :
      false;

  if (!manifest.manifestStore) {
    return <div className={className}>No manifest store found.</div>
  }

  const chain = buildManifestChain(manifest.manifestStore!)
  const hasProvenance = chain.length > 1




  if (isInvalid) {
    return (
      <InvalidState
        manifest={manifest}
        entry={activeManifest}
        className={className}
        onViewMore={onViewMore}
        plugin={plugin}
      />
    )
  }


  if (hasProvenance) {
    return (
      <ProvenanceSummary
        manifest={manifest}
        className={className}
        onViewMore={onViewMore}
         plugin={plugin}
      />
    )
  }


  return (
    <ManifestSummary
      manifest={manifest}
      activeManifest={activeManifest}
      className={className}
      onViewMore={onViewMore}
       plugin={plugin}
    />
  )


}
