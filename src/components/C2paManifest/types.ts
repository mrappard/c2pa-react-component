import {  ManifestEntry, VerificationOutcome } from '../../types'

export interface LevelProps {
  manifest: VerificationOutcome
  activeManifest: ManifestEntry
  className?: string
  officalList?: boolean
  onViewMore?: () => void
}
