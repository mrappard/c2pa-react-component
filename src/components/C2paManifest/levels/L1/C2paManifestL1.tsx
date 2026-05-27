import type { KeyboardEvent } from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { LevelProps } from '../../types'
import { getContentLabel } from '../../shared/utils'

export function C2paManifestL1({ className, manifest, activeManifest, onViewMore }: LevelProps) {
  const label = getContentLabel(activeManifest)
  const isInvalid = manifest.manifestStore?.validation_state === 'Invalid'

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onViewMore?.()
    }
  }

  const ariaLabel = [
    'Content Credentials',
    label,
    isInvalid ? '— Invalid' : undefined,
  ].filter(Boolean).join(' — ')

  return (
    <button
      className={['c2pa-icon-only', className].filter(Boolean).join(' ')}
      onClick={onViewMore}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
    >
      <span className="c2pa-icon-wrapper">
        <CRIcon size={28} aria-hidden="true" />
        {isInvalid && <span className="c2pa-invalid-badge" aria-hidden="true">!</span>}
      </span>
      {label && <span className="c2pa-content-label">{label}</span>}
    </button>
  )
}
