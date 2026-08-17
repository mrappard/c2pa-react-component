import { useState } from 'react'
import { LevelProps } from '../../types'
import C2paProvenanceGraph from '../../../C2paProvenanceGraph/C2paProvenanceGraph'
import { AssertionPanel } from './AssertionPanel'

type SelectionMode = 'select' | 'compare'

export function C2paManifestL3({ manifest, className, plugin, resolveUri }: LevelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [mode, setMode] = useState<SelectionMode>('select')

  if (!manifest.manifestStore) {
    return <div className={className}>No manifest store found.</div>
  }

  function handleNodeClick(id: string) {
    if (mode === 'select') {
      setSelectedIds((prev) => (prev[0] === id ? [] : [id]))
      return
    }
    setSelectedIds((prev) => {
      if (prev[0] === id) return prev.slice(1)
      if (prev[1] === id) return prev.slice(0, 1)
      if (prev.length < 2) return [...prev, id]
      return [prev[0], id]
    })
  }

  function handleModeChange(next: SelectionMode) {
    setMode(next)
    setSelectedIds((prev) => prev.slice(0, 1))
  }

  return (
    <div className={['c2pa-l3', className].filter(Boolean).join(' ')}>
      <div className="c2pa-l3-graph">
        <C2paProvenanceGraph
          manifest={manifest.manifestStore}
          height={500}
          selectedIds={selectedIds}
          onNodeClick={handleNodeClick}
          resolveUri={resolveUri}
        />
      </div>
      <div className="c2pa-l3-panel">
        <div className="c2pa-l3-panel-header">
          <div className="c2pa-l3-mode-toggle">
            <button
              className={`c2pa-l3-mode-btn${mode === 'select' ? ' c2pa-l3-mode-btn--active' : ''}`}
              onClick={() => handleModeChange('select')}
            >
              Select
            </button>
            <button
              className={`c2pa-l3-mode-btn${mode === 'compare' ? ' c2pa-l3-mode-btn--active' : ''}`}
              onClick={() => handleModeChange('compare')}
            >
              Compare
            </button>
          </div>
          {selectedIds.length > 0 && (
            <button className="c2pa-l3-clear-btn" onClick={() => setSelectedIds([])} aria-label="Clear selection">
              ✕
            </button>
          )}
        </div>
        <div className="c2pa-l3-panel-content">
          <AssertionPanel
            selectedIds={selectedIds}
            manifests={manifest.manifestStore.manifests}
            manifest={manifest}
            plugins={plugin}
          />
        </div>
      </div>
    </div>
  )
}
