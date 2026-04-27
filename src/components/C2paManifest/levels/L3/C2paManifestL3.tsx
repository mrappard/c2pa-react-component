import { LevelProps } from '../../types'
import C2paProvenanceGraph from '../../../C2paProvenanceGraph/C2paProvenanceGraph'

export function C2paManifestL3({ manifest, className }: LevelProps) {
  if (!manifest.manifestStore) {
    return <div className={className}>No manifest store found.</div>
  }
  return <C2paProvenanceGraph manifest={manifest.manifestStore} className={className} />
}
