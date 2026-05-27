import { useState } from 'react'
import { LevelProps } from '../../types'
import C2paProvenanceGraph from '../../../C2paProvenanceGraph/C2paProvenanceGraph'
import { AssertionPanel } from './AssertionPanel'

export function C2paManifestL3({ manifest, className, plugin }: LevelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (!manifest.manifestStore) {
    return <div className={className}>No manifest store found.</div>
  }

  function handleNodeClick(id: string) {
    setSelectedIds((prev) => {
      if (prev[0] === id) return prev.slice(1)          // deselect A
      if (prev[1] === id) return prev.slice(0, 1)       // deselect B
      if (prev.length < 2) return [...prev, id]         // add selection
      return [prev[0], id]                               // replace B
    })
  }

  return (
    <div className={['c2pa-l3', className].filter(Boolean).join(' ')}>
      <div className="c2pa-l3-graph">
        <C2paProvenanceGraph
          manifest={manifest.manifestStore}
          height={500}
          selectedIds={selectedIds}
          onNodeClick={handleNodeClick}
        />
      </div>
      <div className="c2pa-l3-panel">
        <AssertionPanel
          selectedIds={selectedIds}
          manifests={manifest.manifestStore.manifests}
          plugins={plugin}
        />
      </div>
    </div>
  )
}
