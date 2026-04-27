import { ManifestEntry, ManifestStore } from '../../../types'

export function getDate(entry: ManifestEntry): string | undefined {
  if (entry.signatureInfo?.time) return entry.signatureInfo.time
  
  const actions = entry?.assertions?.['c2pa.actions.v2'] as { actions?: { when?: string }[] } | undefined
  if (actions?.actions) {
    for (const act of actions.actions) {
      if (act.when) return act.when
    }
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
  const levels: string[][] = [[manifest.activeManifest]]
  const visited = new Set([manifest.activeManifest])
  let current = [manifest.activeManifest]

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
  return entry.signatureInfo?.issuer ?? entry.signatureInfo?.common_name
}

export function getGenerator(entry: ManifestEntry) {
  return entry.claimGeneratorInfo?.[0]?.name ?? entry.claimGenerator
}

export function getActions(entry: ManifestEntry): string[] {
  const actions = entry.assertions?.['c2pa.actions.v2'] as { actions?: { action: string }[] } | undefined
  return actions?.actions?.map((act) => act.action) ?? []
}

export function validationColor(state: ManifestStore['validation_state']) {
  if (state === 'Valid') return { bg: '#dcfce7', text: '#15803d' }
  if (state === 'Invalid') return { bg: '#fee2e2', text: '#b91c1c' }
  return { bg: '#fef9c3', text: '#854d0e' }
}
