import React from 'react'
import { C2paManifestProps } from '../../types'
import { C2paManifestL1 } from './levels/L1/C2paManifestL1'
import { C2paManifestL2 } from './levels/L2/C2paManifestL2'
import { C2paManifestL3 } from './levels/L3/C2paManifestL3'
import { C2paManifestL4 } from './levels/L4/C2paManifestL4'
import { C2paManifestL5 } from './levels/L5/C2paManifestL5'

export const C2paManifest: React.FC<C2paManifestProps> = ({ manifest, level = 3, className, onViewMore }) => {
  
  
 
  const activeManifest = manifest.manifestStore.manifests[manifest.manifestStore.activeManifest]


  if (!activeManifest) {
    return <div className={className}>No active manifest found.</div>
  }

  const props = { manifest, activeManifest, className, onViewMore }


  switch (level) {
    case 1: return <C2paManifestL1 manifest={manifest} activeManifest={activeManifest}  />
    case 2: return <C2paManifestL2  manifest={manifest} activeManifest={activeManifest}  />
    //case 3: return <C2paManifestL3 {...props} />
    //case 4: return <C2paManifestL4 {...props} />
    //case 5: return <C2paManifestL5 {...props} />
  }
  return undefined;
}

export default C2paManifest
