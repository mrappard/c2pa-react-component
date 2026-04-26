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

const styles = {
  card: {
    width: 420,
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: 10,
    boxShadow: '0 14px 35px rgba(0,0,0,0.16)',
    padding: 24,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#242424',
  } satisfies React.CSSProperties,

  divider: {
    height: 1,
    background: '#d4d4d4',
    margin: '20px 0',
  } satisfies React.CSSProperties,

  button: {
    width: '100%',
    height: 42,
    borderRadius: 999,
    border: '2px solid #666',
    background: '#fff',
    fontWeight: 700,
    fontSize: 16,
    color: '#666',
    cursor: 'pointer',
  } satisfies React.CSSProperties,
}

function getTitle(entry: ManifestEntry) {
  return getGenerator(entry) || getIssuer(entry) || entry.title || entry.label || 'Unknown source'
}

function getThumb(entry: ManifestEntry) {
  // Adjust these field names if your ManifestEntry type stores thumbnails elsewhere.
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
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 999,
        background: '#111',
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
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
    <div
      style={{
        position: 'relative',
        width: 68,
        height: 68,
        borderRadius: 5,
        border: '2px solid #eee',
        background: '#f3f3f3',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {thumb ? (
        <img
          src={thumb}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : null}

      {showCrBadge && (
        <div style={{ position: 'absolute', right: -2, top: -2 }}>
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

  console.log(manifest);

  const seeIfMoreInfo = manifest.manifests.find(m => m.id === manifest.manifestStore.activeManifest);

 
  const cawg = seeIfMoreInfo?.assertions["stds.schema-org.CreativeWork"];
  




  


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Thumbnail entry={entry} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SourceBadge label={title} />
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {invalid ? 'Invalid' : title}
          </div>

          {active && (
            <span
              style={{
                marginLeft: 4,
                padding: '3px 10px',
                borderRadius: 999,
                background: '#e8f5e9',
                color: '#147a2e',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Active
            </span>
          )}
        </div>

        {date && !invalid && (
          <div style={{ color: '#666', fontSize: 15, marginTop: 3 }}>
            {formatDate(date)}
          </div>
        )}

        {invalid && (
          <div style={{ color: '#b91c1c', fontSize: 14, marginTop: 3 }}>
            C2PA data could not be verified.
          </div>
        )}

      </div>
     
    </div>
    <div style={{  width: '100%'}}>
     {seeIfMoreInfo &&  <CAWGManifest manifest={seeIfMoreInfo}  />}
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
    <div
      style={{
        width: 34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 8,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          border: '4px solid #222',
          borderRadius: 999,
          background: '#fff',
        }}
      />

      <div style={{ width: 4, height: 70, background: '#222' }} />

      {middleCount > 0 && (
        <>
          <div
            style={{
              borderLeft: '4px dotted #222',
              height: 42,
            }}
          />
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: '#222',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {middleCount}
          </div>
          <div
            style={{
              borderLeft: '4px dotted #222',
              height: 42,
            }}
          />
        </>
      )}

      {hasOrigin && (
        <>
          <div style={{ width: 4, height: 70, background: '#222' }} />
          <span
            style={{
              width: 12,
              height: 12,
              border: '4px solid #222',
              borderRadius: 999,
              background: '#fff',
            }}
          />
        </>
      )}
    </div>
  )
}

function ViewMoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} style={styles.button}>
      View more
    </button>
  )
}

function OriginStrip({ origins }: { origins: ManifestEntry[] }) {
  if (!origins.length) return null

  return (
    <>
      <div style={styles.divider} />
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
        Origins ({origins.length})
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
}: {
  entry: ManifestEntry
  className?: string
  onViewMore?: () => void
}) {
  return (
    <div className={className} style={styles.card}>
      <ManifestRow entry={entry} invalid />

      <div style={styles.divider} />

      <div
        style={{
          color: '#b91c1c',
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          lineHeight: 1.45,
        }}
      >
        Invalid C2PA data. No prior provenance can be displayed because the
        manifest chain could not be trusted.
      </div>

      <div style={styles.divider} />
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
    <div className={className} style={styles.card}>
      <ManifestRow manifest={manifest} entry={activeManifest} active />

      <div style={styles.divider} />

      <ViewMoreButton onClick={onViewMore} />
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
    <div className={className} style={styles.card}>
      <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 18 }}>
        <Timeline
          middleCount={shouldCollapse ? middleCount : 0}
          hasOrigin={originEntries.length > 0}
        />

        <div>
          {activeEntry && <ManifestRow entry={activeEntry} active />}

          {shouldCollapse && middleCount > 0 && (
            <>
              <div style={styles.divider} />
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Additional steps</span>
                <span style={{ color: '#666' }}>⌄</span>
              </div>
            </>
          )}

          {!shouldCollapse &&
            visibleMiddleEntries.map((entry, i) => (
              <React.Fragment key={i}>
                <div style={styles.divider} />
                <ManifestRow entry={entry} />
              </React.Fragment>
            ))}

          {originEntries[0] && (
            <>
              <div style={styles.divider} />
              <ManifestRow entry={originEntries[0]} />
            </>
          )}
        </div>
      </div>

      {originEntries.length > 1 && <OriginStrip origins={originEntries} />}

      <div style={styles.divider} />

      <ViewMoreButton onClick={onViewMore} />

      <div style={{ marginTop: 18, fontSize: 13, color: '#666' }}>
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
      !manifest.state :
      false;

  const chain = buildManifestChain(manifest)
  const hasProvenance = chain.length > 1




  if (isInvalid) {
    return (
      <InvalidState
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