import React from 'react'
import { C2paManifestProps, DisclosureLevel } from "c2pa-react-component-types"
import { C2paManifestL1 } from './levels/L1/C2paManifestL1'
import { C2paManifestL2 } from './levels/L2/C2paManifestL2'
import { C2paManifestL3 } from './levels/L3/C2paManifestL3'
import { C2paManifestL4 } from './levels/L4/C2paManifestL4'
import { C2paManifestL5 } from './levels/L5/C2paManifestL5'
import './styles/c2paManifest.css'

export const C2paManifest: React.FC<C2paManifestProps> = ({ manifest, level = 3, className, onViewMore,   defaultViewMore, plugin }) => {
  
  
 
  const activeManifest = manifest.manifestStore?.manifests[manifest.manifestStore.activeManifest];


  const [levelOfDetail, setLevelOfDetail] = React.useState(level || 1)

  const updateLevelOfDetail = () => {
    setLevelOfDetail((prev) => {
      if (prev >= 5) {
        return 1;
      }
      return (prev + 1) as DisclosureLevel;
    })
  }


  if (!activeManifest || !manifest.manifestStore) {
    return <div className={className}>No active manifest found.</div>
  }

  switch (levelOfDetail) {
    case 1: return <C2paManifestL1 manifest={manifest} activeManifest={activeManifest} className={className} plugin={plugin} onViewMore={onViewMore ?? (defaultViewMore ? updateLevelOfDetail : undefined)} />
    case 2: return <C2paManifestL2 manifest={manifest} activeManifest={activeManifest} className={className} plugin={plugin} onViewMore={onViewMore ?? (defaultViewMore ? updateLevelOfDetail : undefined)} />
    case 3: return <C2paManifestL3 manifest={manifest} activeManifest={activeManifest} className={className} plugin={plugin} />
    case 4: return <C2paManifestL4 manifest={manifest} activeManifest={activeManifest} className={className} />
    case 5: return <C2paManifestL5 manifest={manifest} activeManifest={activeManifest} className={className} />
  }
  return undefined;
}

export default C2paManifest
