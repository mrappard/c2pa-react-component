import { ClaimGeneratorInfo, Ingredient, ManifestEntry, VerificationOutcome } from 'c2pa-react-component-types'

/**
 * Normalises a VerificationOutcome so manifestStore.manifests entries carry the
 * ingredients/assertions/thumbnail/etc that buildGraph and the manifest panels expect.
 *
 * Some producers (e.g. wasm-bindgen based libraries) only populate this data on the
 * top-level `manifests` array, leave `manifestStore.manifests` as a Map instead of a
 * plain object, store assertions as a Map, use `manifestId` instead of
 * `active_manifest` on ingredients, and provide a scalar `claimGeneratorInfo` instead
 * of an array. This fills in any gaps from the corresponding `manifests[]` entry
 * (matched by id/label) and reshapes the values into what this library expects.
 */
export function normalizeOutcome(outcome: VerificationOutcome): VerificationOutcome {
  const { manifestStore } = outcome
  if (!manifestStore) return outcome

  const recognizedById = new Map<string, ManifestEntry>()
  for (const m of outcome.manifests ?? []) {
    recognizedById.set(m.id, m as unknown as ManifestEntry)
  }

  const rawManifests = manifestStore.manifests as unknown
  const entries: [string, ManifestEntry][] = rawManifests instanceof Map
    ? Array.from((rawManifests as Map<string, ManifestEntry>).entries())
    : Object.entries(rawManifests as Record<string, ManifestEntry>)

  const manifests: Record<string, ManifestEntry> = {}
  for (const [label, entry] of entries) {
    const recognized = recognizedById.get(label)
    manifests[label] = {
      ...entry,
      label: entry.label ?? label,
      title: entry.title ?? recognized?.title,
      instanceId: entry.instanceId ?? recognized?.instanceId,
      claimGenerator: entry.claimGenerator ?? recognized?.claimGenerator,
      claimGeneratorInfo: normalizeClaimGeneratorInfo(entry.claimGeneratorInfo ?? recognized?.claimGeneratorInfo),
      signatureInfo: entry.signatureInfo ?? recognized?.signatureInfo,
      assertions: normalizeAssertions(entry.assertions ?? recognized?.assertions),
      ingredients: normalizeIngredients(entry.ingredients ?? recognized?.ingredients),
      thumbnail: entry.thumbnail ?? recognized?.thumbnail,
      credentials: entry.credentials ?? recognized?.credentials,
    }
  }

  return {
    ...outcome,
    manifestStore: {
      ...manifestStore,
      activeManifest: manifestStore.activeManifest ?? '',
      validation_state: manifestStore.validation_state ?? (outcome.state ? 'Valid' : 'Invalid'),
      manifests,
    },
  }
}

function normalizeIngredients(ingredients: unknown): Ingredient[] {
  if (!ingredients) return []
  return (ingredients as (Ingredient & { manifestId?: string })[]).map((ingredient) => ({
    ...ingredient,
    active_manifest: ingredient.active_manifest ?? ingredient.manifestId,
  }))
}

function normalizeAssertions(assertions: unknown): Record<string, any> {
  if (!assertions) return {}
  if (assertions instanceof Map) return Object.fromEntries(assertions)
  return assertions as Record<string, any>
}

function normalizeClaimGeneratorInfo(info: unknown): ClaimGeneratorInfo[] | undefined {
  if (info == null) return undefined
  return Array.isArray(info) ? info : [info as ClaimGeneratorInfo]
}
