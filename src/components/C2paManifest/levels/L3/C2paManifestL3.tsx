import { LevelProps } from '../../types'
import C2paProvenanceGraph from '../../../C2paProvenanceGraph/C2paProvenanceGraph'

export function C2paManifestL3({ manifest, className }: LevelProps) {
  return <C2paProvenanceGraph manifest={manifest} className={className} />
}
