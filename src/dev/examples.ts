import { Manifest, ManifestEntry, ManifestStore, VerificationOutcome } from 'c2pa-react-component-types'
import carEsExample from '../../examples/car-es-Ps-Cr.json'
import chatGptImage from '../../examples/ChatGPT_Image.json'
import cloudscapeAca from '../../examples/cloudscape-ACA-Cr.json'
import craterLake from '../../examples/crater-lake-cr.json'
import createdExample from '../../examples/createdExample.json'
import diaccExample from '../../examples/diacc-pctf-example.json'
import fireflyTabby from '../../examples/Firefly_tabby_cat.json'
import labelAiGenerated from '../../examples/label-ai-generated.json'
import labelAiEdited from '../../examples/label-ai-edited.json'
import labelCameraCaptured from '../../examples/label-camera-captured.json'
import llmExample from '../../examples/llm-example.json'
import musicExample from '../../examples/music-example.json'
import cawgIdentity from '../../examples/cawg-identity-example.json'
import geminiExample from '../../examples/gemini-example-image.json'
import openAiExample from '../../examples/open-ai-example.json'
import trqpAuthorizationUnverified from '../../examples/trqp-identity-example.json'
import trqpAuthorizationVerified from '../../examples/trqp-identity-verified-example.json'


function normalize(raw: unknown): VerificationOutcome {
  const data = raw as Record<string, unknown>
  if (Array.isArray(data.manifests)) {
    // New format: top-level manifests array + separate manifestStore.
    // manifestStore.manifests entries lack ingredients/assertions — merge them in from the array.
    const result = data as unknown as VerificationOutcome
    if (result.manifestStore) {
      const arrayEntries = data.manifests as Array<Record<string, unknown>>
      const enriched: ManifestStore['manifests'] = {}
      for (const [id, entry] of Object.entries(result.manifestStore.manifests)) {
        const arrayEntry = arrayEntries.find((e) => e.id === id) ?? {}
        enriched[id] = {
          ...entry,
          ingredients: (arrayEntry.ingredients as ManifestEntry['ingredients']) ?? [],
          assertions: (arrayEntry.assertions as ManifestEntry['assertions']) ?? {},
          credentials: (arrayEntry.credentials as ManifestEntry['credentials']) ?? [],
          thumbnail: (arrayEntry.thumbnail as ManifestEntry['thumbnail']) ?? null,
        }
      }
      return { ...result, manifestStore: { ...result.manifestStore, manifests: enriched } }
    }
    return result
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

export const examples: { label: string; data: VerificationOutcome }[] = [
  { label: 'Car (Edited + Signed)', data: normalize(carEsExample) },
  { label: 'ChatGPT Image', data: normalize(chatGptImage) },
  { label: 'Cloudscape ACA', data: normalize(cloudscapeAca) },
  { label: 'Crater Lake', data: normalize(craterLake) },
  { label: 'Created Example', data: normalize(createdExample) },
  { label: 'CAWG Identity', data: normalize(cawgIdentity) },
  { label: 'DIACC PCTF Conformance', data: normalize(diaccExample) },
  { label: 'Firefly Tabby Cat', data: normalize(fireflyTabby) },
  { label: 'Label — AI-generated', data: normalize(labelAiGenerated) },
  { label: 'Label — AI-edited', data: normalize(labelAiEdited) },
  { label: 'Label — Camera-captured', data: normalize(labelCameraCaptured) },
  { label: 'Gemini Example Image', data: normalize(geminiExample) },
  { label: 'OpenAI Example', data: normalize(openAiExample) },
  { label: 'LLM Example', data: normalize(llmExample) },
  { label: 'Music Example', data: normalize(musicExample) },
  { label: 'TRQP Authorization — Unverified', data: normalize(trqpAuthorizationUnverified) },
  { label: 'TRQP Authorization — Verified', data: normalize(trqpAuthorizationVerified) },
]
