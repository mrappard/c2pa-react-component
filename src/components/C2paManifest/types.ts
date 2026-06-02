import { ManifestEntry, PluginC2PA, VerificationOutcome } from 'c2pa-react-component-types'
import type { ReactNode } from 'react'

export interface LevelProps {
  manifest: VerificationOutcome
  activeManifest: ManifestEntry
  className?: string
  officialList?: boolean
  onViewMore?: () => void
  plugin?: PluginC2PA[]
  resolveUri?: (uri: string, format?: string) => ReactNode
}
