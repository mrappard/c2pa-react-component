export interface AssertionSummary {
  label: string
  summary: string
  isUnknown: boolean
}

function unwrap(raw: unknown): unknown {
  if (typeof raw === 'object' && raw !== null && 'data' in raw) {
    return (raw as { data: unknown }).data
  }
  return raw
}

function formatActions(raw: unknown): string {
  const data = unwrap(raw) as { actions?: { action: string; softwareAgent?: { name: string } | string }[] } | undefined
  const actions = data?.actions ?? []
  if (!actions.length) return 'No actions recorded'
  return actions
    .map((act) => {
      const verb = act.action.replace('c2pa.', '')
      const agent =
        typeof act.softwareAgent === 'object' ? act.softwareAgent?.name : act.softwareAgent
      return agent ? `${verb} with ${agent}` : verb
    })
    .join(', ')
}

function formatCreativeWork(raw: unknown): string {
  const data = unwrap(raw) as {
    author?: { name?: string }[]
    publisher?: { name?: string }
  } | undefined
  const parts: string[] = []
  const author = data?.author?.[0]?.name
  if (author) parts.push(`Author: ${author}`)
  const publisher = data?.publisher?.name
  if (publisher) parts.push(`Publisher: ${publisher}`)
  return parts.join(' · ') || 'Creative work'
}

function formatThumbnail(raw: unknown): string {
  const data = unwrap(raw) as { format?: string } | undefined
  return data?.format ? `${data.format}` : 'Embedded thumbnail'
}

function formatIngredient(raw: unknown): string {
  const data = unwrap(raw) as { title?: string; relationship?: string } | undefined
  const rel = data?.relationship ? ` (${data.relationship})` : ''
  return data?.title ? `${data.title}${rel}` : `Ingredient reference${rel}`
}

function truncateJson(raw: unknown): string {
  try {
    const str = JSON.stringify(raw)
    return str.length > 80 ? str.slice(0, 80) + '…' : str
  } catch {
    return '…'
  }
}

const LABELS: Record<string, string> = {
  'c2pa.actions.v2': 'Edits and activity',
  'c2pa.actions': 'Edits and activity',
  'stds.schema-org.CreativeWork': 'Creative work',
  'c2pa.thumbnail': 'Thumbnail',
  'c2pa.hash.data': 'Content hash',
  'c2pa.hash.bmff': 'Content hash (BMFF)',
  'c2pa.hash.bmff.v2': 'Content hash (BMFF v2)',
  'c2pa.ingredient': 'Ingredient',
  'c2pa.ingredient.v2': 'Ingredient',
  'c2pa.soft-binding': 'Soft binding',
  'c2pa.cloud-data': 'Cloud data',
}

const FORMATTERS: Record<string, (raw: unknown) => string> = {
  'c2pa.actions.v2': formatActions,
  'c2pa.actions': formatActions,
  'stds.schema-org.CreativeWork': formatCreativeWork,
  'c2pa.thumbnail': formatThumbnail,
  'c2pa.hash.data': () => 'SHA-256 content hash',
  'c2pa.hash.bmff': () => 'BMFF hash',
  'c2pa.hash.bmff.v2': () => 'BMFF v2 hash',
  'c2pa.ingredient': formatIngredient,
  'c2pa.ingredient.v2': formatIngredient,
}

function humanizeKey(key: string): string {
  return key
    .replace(/^(c2pa|stds|org)\./i, '')
    .replace(/\./g, ' ')
    .replace(/-/g, ' ')
    .replace(/\bv\d+\b/g, '')
    .trim()
}

export function formatAssertion(key: string, raw: unknown): AssertionSummary {
  const label = LABELS[key] ?? humanizeKey(key)
  const formatter = FORMATTERS[key]
  const isUnknown = !formatter
  let summary: string
  try {
    summary = formatter ? formatter(raw) : truncateJson(unwrap(raw))
  } catch {
    summary = '…'
  }
  return { label, summary, isUnknown }
}
