import type { KeyboardEvent } from 'react'
import { CRIcon } from '../../../../icons/CRIcon'
import { LevelProps } from '../../types'

export function C2paManifestL1({ className, onViewMore }: LevelProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onViewMore?.()
    }
  }

  return (
    <div
      className={['c2pa-icon-only', className].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      onClick={onViewMore}
      onKeyDown={handleKeyDown}
    >
      <CRIcon size={28} />
    </div>
  )
}
