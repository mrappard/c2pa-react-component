import React from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { ManifestEntry, ManifestStore } from '../../../../types'
import { LevelProps } from '../../types'
import {
  getIssuer,
  getGenerator,
  getDate,
  formatDate,
  buildManifestChain,
} from '../../shared/utils'
import CAWGManifest from '../../../Cawg/Cawg'

const COLLAPSE_THRESHOLD = 4

function cx(...classes: Array<string | undefined>) {
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

function SourceBadge({ label }: { label: string }) {
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

  return (
    <div className="c2pa-thumb">
      {thumb ? (
        <img src={thumb} alt="" />
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
}: {
  manifest: ManifestStore
  entry: ManifestEntry
  active?: boolean
  invalid?: boolean
}) {

  const title = getTitle(entry)
  const date = getDate(entry)

  const seeIfMoreInfo = Object.values(manifest.manifests).find(m => m.id === entry.id);
  
  return (
    <div className="c2pa-manifest-row">
    <div className="c2pa-manifest-row-main">
      <Thumbnail entry={entry} />
      <div className="c2pa-manifest-row-content">
        <div className="c2pa-manifest-row-heading">
          <SourceBadge label={title} />
          <div className="c2pa-title">
            {invalid ? 'Invalid' : title}
          </div>

          {active && (
            <span className="c2pa-active-badge">
              Active
            </span>
          )}
        </div>

        {date && !invalid && (
          <div className="c2pa-date">
            {formatDate(date)}
          </div>
        )}

        {invalid && (
          <div className="c2pa-invalid-text">
            C2PA data could not be verified.
          </div>
        )}

      </div>
     
    </div>
    <div className="c2pa-more-info">
     {seeIfMoreInfo &&  <CAWGManifest manifest={seeIfMoreInfo as any}  />}
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
        Origins ({origins.length})
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
  manifest
}: {
  entry: ManifestEntry
  className?: string
  onViewMore?: () => void
  manifest: ManifestStore
}) {
  return (
    <div className={cx('c2pa-card', className)}>
      <ManifestRow manifest={manifest} entry={entry} invalid />

      <div className="c2pa-divider" />

      <div className="c2pa-alert">
        Invalid C2PA data. No prior provenance can be displayed because the
        manifest chain could not be trusted.
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
}: LevelProps) {

  return (
    <div className={cx('c2pa-card', className)}>
      <ManifestRow manifest={manifest} entry={activeManifest} active />

      
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
}: {
  manifest: ManifestStore
  className?: string
  onViewMore?: () => void
}) {
  const chain = buildManifestChain(manifest)

  const activeIds = chain[0] ?? []
  const originIds = chain[chain.length - 1] ?? []
  const middleLevels = chain.slice(1, -1)

  const middleCount = middleLevels.reduce((sum, level) => sum + level.length, 0)
  const totalCount = chain.reduce((sum, level) => sum + level.length, 0)
  const shouldCollapse = totalCount > COLLAPSE_THRESHOLD

  const activeEntry = manifest.manifests[activeIds[0]]
  const originEntries = originIds
    .map((id) => manifest.manifests[id])
    .filter(Boolean)

  const visibleMiddleEntries = shouldCollapse
    ? []
    : middleLevels.flat().map((id) => manifest.manifests[id]).filter(Boolean)

  return (
    <div className={cx('c2pa-card', className)}>
      <div className="c2pa-timeline-layout">
        <Timeline
          middleCount={shouldCollapse ? middleCount : 0}
          hasOrigin={originEntries.length > 0}
        />

        <div>
          {activeEntry && <ManifestRow manifest={manifest} entry={activeEntry} active />}

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
                <ManifestRow manifest={manifest} entry={entry} />
              </React.Fragment>
            ))}

          {originEntries[0] && (
            <>
              <div className="c2pa-divider" />
              <ManifestRow manifest={manifest} entry={originEntries[0]} />
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
  officalList = false,
}: LevelProps) {
  const isInvalid =
    officalList ?
      !manifest.validation_state :
      false;

  const chain = buildManifestChain(manifest)
  const hasProvenance = chain.length > 1




  if (isInvalid) {
    return (
      <InvalidState
        manifest={manifest}
        entry={activeManifest}
        className={className}
        onViewMore={onViewMore}
      />
    )
  }


  if (hasProvenance) {
    return (
      <ProvenanceSummary
        manifest={manifest}
        className={className}
        onViewMore={onViewMore}
      />
    )
  }


  return (
    <ManifestSummary
      manifest={manifest}
      activeManifest={activeManifest}
      className={className}
      onViewMore={onViewMore}
    />
  )


}
