import React from 'react'
import {  CAWGManifestProps } from '../../types'
import { CAWGL1 } from './levels/L1/CAWGL1'
import CAWGL2 from './levels/L2/CAWGL2';
import CAWGL3 from './levels/L3/CAWGL3';

export const CAWGManifest: React.FC<CAWGManifestProps> = ({ manifest, level, className }) => {
  const activeManifest = manifest;

  if (!activeManifest) {
    return <div className={className}>No active manifest found.</div>
  }

  const [levelOfDetail, setLevelOfDetail] = React.useState(level || 1)

  {/*return <div>{JSON.stringify(activeManifest, null, 2)}</div>*/}

  switch (levelOfDetail) {
    case 1: return <CAWGL1 manifest={manifest} moreInfo={()=>{
      setLevelOfDetail(2);
    }} />
    case 2: return <CAWGL2 manifest={manifest} moreInfo={()=>{
      setLevelOfDetail(3);
    }}  />
    case 3: return <CAWGL3 manifest={manifest} moreInfo={()=>{
      setLevelOfDetail(1);
    }}/>
  }

   return <div>{JSON.stringify(activeManifest, null, 2)}</div>
}

export default CAWGManifest
