
import { Manifest, ManifestEntry, ManifestStore, VerificationOutcome } from 'c2pa-react-component-types'
import { CAWGManifest } from 'c2pa-react-cawg-component'
import { DIACCManifest } from 'c2pa-react-diacc-component'
import carEsExample from '../../examples/car-es-Ps-Cr.json'
import chatGptImage from '../../examples/ChatGPT_Image.json'
import cloudscapeAca from '../../examples/cloudscape-ACA-Cr.json'
import craterLake from '../../examples/crater-lake-cr.json'
import createdExample from '../../examples/createdExample.json'
import diaccExample from '../../examples/diacc-pctf-example.json'
import fireflyTabby from '../../examples/Firefly_tabby_cat.json'
import { useState } from 'react';
import C2paManifest from '../components/C2paManifest/C2paManifest';

import "c2pa-react-cawg-component/style.css";
import "c2pa-react-diacc-component/style.css";

function normalize(raw: unknown): VerificationOutcome {
  const data = raw as Record<string, unknown>
  if (Array.isArray(data.manifests)) {
    return data as unknown as VerificationOutcome
  }
  const store = data as unknown as ManifestStore
  const manifests = Object.entries(store.manifests).map(([id, entry]: [string, ManifestEntry]) => ({
    id,
    title: entry.title ?? id,
    claimGenerator: entry.claimGenerator ?? null,
    claimGeneratorInfo: entry.claimGeneratorInfo ?? [],
    instanceId: entry.instanceId ?? '',
    signatureInfo: entry.signatureInfo ?? {},
    assertions: entry.assertions ?? {},
    credentials: entry.credentials ?? [],
    thumbnail: entry.thumbnail ?? null,
    ingredients: entry.ingredients ?? [],
  }))
  return { state: true, manifests: manifests as unknown as Manifest[], manifestStore: store }
}

const examples: { label: string; data: VerificationOutcome }[] = [
  { label: 'Car (Edited + Signed)', data: normalize(carEsExample) },
  { label: 'ChatGPT Image', data: normalize(chatGptImage) },
  { label: 'Cloudscape ACA', data: normalize(cloudscapeAca) },
  { label: 'Crater Lake', data: normalize(craterLake) },
  { label: 'Created Example', data: normalize(createdExample) },
  { label: 'DIACC PCTF Conformance', data: normalize(diaccExample) },
  { label: 'Firefly Tabby Cat', data: normalize(fireflyTabby) },
]




export default function App() {

   const [selectedIndex, setSelectedIndex] = useState(0)
  const example = examples[selectedIndex]

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>C2PA React Components – Dev Playground</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
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


      <h2>Provenance Graph</h2>
      {/*<C2paProvenanceGraph manifest={sampleManifest} height={400} />*/}
      <h2 style={{ marginTop: '2rem' }}>Disclosure Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {([1, 2, 3, 4, 5] as const).map((l) => (
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
