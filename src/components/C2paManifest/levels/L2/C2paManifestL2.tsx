import React from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { ManifestEntry, ManifestStore } from '../../../../types'
import { LevelProps } from '../../types'
import { card, pill, labelStyle, row } from '../../shared/styles'
import { getIssuer, getGenerator, getDate, formatDate, validationColor, buildManifestChain } from '../../shared/utils'

// ── sub-components ────────────────────────────────────────────────────────────

const COLLAPSE_THRESHOLD = 4

interface ManifestCardProps {
  id: string
  entry: ManifestEntry
  manifest: ManifestStore
  isActive: boolean
  role: 'active' | 'ingredient' | 'origin'
}

function ManifestCard({ id, entry, manifest, isActive, role }: ManifestCardProps) {
  const issuer = getIssuer(entry)
  const generator = getGenerator(entry)
  const date = getDate(entry)
  const valState = id === manifest.active_manifest ? manifest.validation_state : undefined
  const valColors = validationColor(valState)

  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: 8,
      border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
      background: '#fff',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>
        {role}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.title ?? entry.label}
          </div>
          {issuer && (
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 2 }}>
              <span style={{ color: '#94a3b8' }}>Signed by </span>{issuer}
            </div>
          )}
          {(generator || date) && (
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {generator}{generator && date ? ' · ' : ''}{date ? formatDate(date) : ''}
            </div>
          )}
        </div>
        {valState && (
          <span style={{ ...pill(valColors.bg, valColors.text), flexShrink: 0, marginTop: 2 }}>
            {valState}
          </span>
        )}
      </div>
    </div>
  )
}

function ChainConnector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
      <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
    </div>
  )
}

function CollapsedConnector({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
      <div style={{ width: 1, height: 8, background: '#cbd5e1' }} />
      <div style={{
        fontSize: 11, color: '#64748b', background: '#f1f5f9',
        border: '1px solid #e2e8f0', borderRadius: 10, padding: '2px 10px', margin: '2px 0',
      }}>
        +{count} more
      </div>
      <div style={{ width: 1, height: 8, background: '#cbd5e1' }} />
    </div>
  )
}

function ViewMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 10, background: 'none', border: 'none', padding: 0,
        color: '#3b82f6', fontSize: 12, cursor: 'pointer',
        fontFamily: 'inherit', textDecoration: 'underline', display: 'block',
      }}
    >
      View full provenance →
    </button>
  )
}

// ── invalid state ─────────────────────────────────────────────────────────────

function InvalidState({ entry, className }: { entry: ManifestEntry; className?: string }) {
  const issuer = getIssuer(entry)
  const failures = entry.assertions.flatMap(() => []) // visual only, no raw data per spec

  return (
    <div className={className} style={{ ...card, display: 'block', minWidth: 280, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <CRIcon size={20} />
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.title ?? entry.label}
        </span>
        <span style={pill('#fee2e2', '#b91c1c')}>Invalid</span>
      </div>
      <div style={{
        fontSize: 12, color: '#b91c1c', background: '#fff1f2',
        border: '1px solid #fecdd3', borderRadius: 6, padding: '6px 10px', marginBottom: 8,
      }}>
        Content credentials could not be verified. No prior provenance data can be displayed.
      </div>
      {issuer && (
        <div style={{ ...row, fontSize: 12, color: '#475569' }}>
          <span style={labelStyle}>Signed by:</span>{issuer}
        </div>
      )}
      {void failures}
    </div>
  )
}

// ── single manifest summary (depth) ──────────────────────────────────────────

function ManifestSummary({ manifest, activeManifest, className, onViewMore }: LevelProps) {
  const issuer = getIssuer(activeManifest)
  const generator = getGenerator(activeManifest)
  const date = getDate(activeManifest)
  const valState = manifest.validation_state
  const valColors = validationColor(valState)

  return (
    <div className={className} style={{ ...card, display: 'block', minWidth: 280, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <CRIcon size={20} />
        <span style={{ fontWeight: 700, fontSize: 14, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeManifest.title ?? activeManifest.label}
        </span>
        {valState && <span style={pill(valColors.bg, valColors.text)}>{valState}</span>}
      </div>
      {issuer && (
        <div style={{ ...row, fontSize: 13 }}>
          <span style={labelStyle}>Signed by:</span><strong>{issuer}</strong>
        </div>
      )}
      {generator && (
        <div style={{ ...row, fontSize: 13 }}>
          <span style={labelStyle}>Generator:</span>{generator}
        </div>
      )}
      {date && (
        <div style={{ ...row, fontSize: 13 }}>
          <span style={labelStyle}>Date:</span>{formatDate(date)}
        </div>
      )}
      {onViewMore && <ViewMoreButton onClick={onViewMore} />}
    </div>
  )
}

// ── provenance summary (breadth) ─────────────────────────────────────────────

function ProvenanceSummary({ manifest, className, onViewMore }: { manifest: ManifestStore; className?: string; onViewMore?: () => void }) {
  const chain = buildManifestChain(manifest)
  const totalManifests = chain.reduce((sum, lvl) => sum + lvl.length, 0)
  const shouldCollapse = totalManifests > COLLAPSE_THRESHOLD

  const firstLevel = chain[0]
  const lastLevel = chain[chain.length - 1]
  const middleLevels = chain.slice(1, chain.length - 1)
  const middleCount = middleLevels.reduce((sum, lvl) => sum + lvl.length, 0)

  const valState = manifest.validation_state
  const valColors = validationColor(valState)

  const getRole = (levelIndex: number): 'active' | 'ingredient' | 'origin' => {
    if (levelIndex === 0) return 'active'
    if (levelIndex === chain.length - 1) return 'origin'
    return 'ingredient'
  }

  return (
    <div className={className} style={{ ...card, display: 'block', minWidth: 280, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <CRIcon size={18} />
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1, color: '#475569' }}>Content Credentials</span>
        {valState && <span style={pill(valColors.bg, valColors.text)}>{valState}</span>}
      </div>

      {/* Active manifest(s) */}
      {firstLevel.map((id) => (
        <ManifestCard
          key={id} id={id}
          entry={manifest.manifests[id]}
          manifest={manifest}
          isActive={true}
          role={getRole(0)}
        />
      ))}

      {/* Middle levels or collapse indicator */}
      {chain.length > 2 && (
        shouldCollapse ? (
          <CollapsedConnector count={middleCount} />
        ) : (
          middleLevels.map((level, i) => (
            <React.Fragment key={i}>
              <ChainConnector />
              {level.map((id) => (
                <ManifestCard
                  key={id} id={id}
                  entry={manifest.manifests[id]}
                  manifest={manifest}
                  isActive={false}
                  role={getRole(i + 1)}
                />
              ))}
            </React.Fragment>
          ))
        )
      )}

      {/* Origin manifest(s) */}
      {chain.length > 1 && (
        <>
          <ChainConnector />
          {lastLevel.map((id) => (
            <ManifestCard
              key={id} id={id}
              entry={manifest.manifests[id]}
              manifest={manifest}
              isActive={false}
              role={getRole(chain.length - 1)}
            />
          ))}
        </>
      )}

      {onViewMore && <ViewMoreButton onClick={onViewMore} />}
    </div>
  )
}

// ── main L2 component ─────────────────────────────────────────────────────────

export function C2paManifestL2({ manifest, activeManifest, className, onViewMore }: LevelProps) {
  const isInvalid = manifest.validation_state === 'Invalid'

  if (isInvalid) {
    return <InvalidState entry={activeManifest} className={className} />
  }

  const chain = buildManifestChain(manifest)
  const hasProvenance = chain.length > 1

  if (hasProvenance) {
    return <ProvenanceSummary manifest={manifest} className={className} onViewMore={onViewMore} />
  }

  return <ManifestSummary manifest={manifest} activeManifest={activeManifest} className={className} onViewMore={onViewMore} />
}
