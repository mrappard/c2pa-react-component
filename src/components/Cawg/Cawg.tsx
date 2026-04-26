import React from 'react'
import {  CAWGManifestProps } from '../../types'
import { CAWGL1 } from './levels/L1/CAWGL1'
import CAWGL2 from './levels/L2/CAWGL2';
import CAWGL3 from './levels/L3/CAWGL3';

export const CAWGManifest: React.FC<CAWGManifestProps> = ({ manifest, level = 3, className, onViewMore }) => {
  const activeManifest = manifest;

  if (!activeManifest) {
    return <div className={className}>No active manifest found.</div>
  }

  const props = { manifest, activeManifest, className, onViewMore }


  {/*return <div>{JSON.stringify(activeManifest, null, 2)}</div>*/}

  switch (level) {
    case 1: return <CAWGL1 {...props} />
    case 2: return <CAWGL2 {...props} />
    case 3: return <CAWGL3 {...props} />
  }

   return <div>{JSON.stringify(activeManifest, null, 2)}</div>
}

export default CAWGManifest
