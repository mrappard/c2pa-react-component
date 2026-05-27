import type { KeyboardEvent } from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { LevelProps } from '../../types'
import { getContentLabel } from '../../shared/utils'

export function C2paManifestL1({ className, activeManifest, onViewMore }: LevelProps) {
  const label = getContentLabel(activeManifest)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onViewMore?.()
    }
  }

  return (
    <button
      className={['c2pa-icon-only', className].filter(Boolean).join(' ')}
      onClick={onViewMore}
      onKeyDown={handleKeyDown}
      aria-label={label ? `Content Credentials — ${label}` : 'Content Credentials'}
      aria-haspopup="dialog"
    >
      <CRIcon size={28} aria-hidden="true" />
      {label && <span className="c2pa-content-label">{label}</span>}
    </button>
  )
}
