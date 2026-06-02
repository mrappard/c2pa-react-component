
import { CAWGManifest } from 'c2pa-react-cawg-component'
import { DIACCManifest } from 'c2pa-react-diacc-component'
import { useState } from 'react'
import C2paManifest from '../components/C2paManifest/C2paManifest'
import { examples } from './examples'

import "c2pa-react-cawg-component/style.css"
import "c2pa-react-diacc-component/style.css"




export default function App() {

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [testLevel, setTestLevel] = useState<1 | 2 | 3 | 4>(1)
  const example = examples[selectedIndex]

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>C2PA React Components – Dev Playground</h1>

      <h2>Level Switcher Test</h2>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>Level:</label>
        {([1, 2, 3, 4] as const).map((l) => (
          <button
            key={l}
            onClick={() => setTestLevel(l)}
            style={{
              padding: '6px 14px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: testLevel === l ? '#3b82f6' : '#fff',
              color: testLevel === l ? '#fff' : '#374151',
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <C2paManifest
        plugin={[CAWGManifest, DIACCManifest]}
        manifest={example.data}
        level={testLevel}
        defaultViewMore={testLevel === 1}
      />

      <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label htmlFor="example-select" style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>
          Example:
        </label>
        <select
          id="example-select"
          value={selectedIndex}
          onChange={e => setSelectedIndex(Number(e.target.value))}
          style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff' }}
        >
          {examples.map((ex, i) => (
            <option key={i} value={i}>{ex.label}</option>
          ))}
        </select>
      </div>


      <h2>Disclosure Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {([1, 2, 3, 4] as const).map((l) => (
          <div key={l}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#475569' }}>Level {l}</p>
            <C2paManifest
            plugin={[CAWGManifest, DIACCManifest]}
              manifest={example.data}
              level={l}
              onViewMore={undefined}
              defaultViewMore={l === 1}
            />
          </div>
        ))}
      </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {([1, 2, 3] as const).map((l) => (
          <div key={l}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#475569' }}>Level {l}</p>
            {<CAWGManifest
              manifest={example.data}
              level={l}
              onViewMore={l === 2 ? () => alert('Navigate to L3') : undefined}
            />}
          </div>
        ))}
      </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {([1, 2, 3] as const).map((l) => (
          <div key={l}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Level {l}
            </p>
            <DIACCManifest manifest={example.data} level={l} />
          </div>
        ))}
      </div>
    </div>
  )
}
