import { ManifestEntry, ManifestStore } from '../../../types'

export function getDate(entry: ManifestEntry): string | undefined {
  if (entry.signature_info?.time) return entry.signature_info.time
  for (const assertion of entry.assertions) {
    const d = assertion.data as { actions?: { when?: string }[] } | null
    const when = d?.actions?.find((a) => a.when)?.when
    if (when) return when
  }
  return undefined
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/**
 * Returns the manifest chain as an ordered array of levels.
 * Level 0 = active manifest, last level = origin ingredient(s).
 * Each level is an array of manifest IDs (multiple when parallel origins exist).
 */
export function buildManifestChain(manifest: ManifestStore): string[][] {
  const levels: string[][] = [[manifest.active_manifest]]
  const visited = new Set([manifest.active_manifest])
  let current = [manifest.active_manifest]

  while (current.length > 0) {
    const next: string[] = []
    for (const id of current) {
      for (const ing of manifest.manifests[id]?.ingredients ?? []) {
        if (ing.active_manifest && manifest.manifests[ing.active_manifest] && !visited.has(ing.active_manifest)) {
          next.push(ing.active_manifest)
          visited.add(ing.active_manifest)
        }
      }
    }
    if (next.length > 0) levels.push(next)
    current = next
  }

  return levels
}

export function getIssuer(entry: ManifestEntry) {
  return entry.signature_info?.issuer ?? entry.signature_info?.common_name
}

export function getGenerator(entry: ManifestEntry) {
  return entry.claim_generator_info?.[0]?.name ?? entry.claim_generator
}

export function getActions(entry: ManifestEntry): string[] {
  return entry.assertions.flatMap((a) => {
    const d = a.data as { actions?: { action: string }[] } | null
    return d?.actions?.map((act) => act.action) ?? []
  })
}

export function validationColor(state: ManifestStore['validation_state']) {
  if (state === 'Valid') return { bg: '#dcfce7', text: '#15803d' }
  if (state === 'Invalid') return { bg: '#fee2e2', text: '#b91c1c' }
  return { bg: '#fef9c3', text: '#854d0e' }
}
