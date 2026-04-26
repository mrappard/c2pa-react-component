import { ManifestStore, ManifestEntry } from '../../types'

export interface LevelProps {
  manifest: ManifestStore
  activeManifest: ManifestEntry
  className?: string
  onViewMore?: () => void
}
