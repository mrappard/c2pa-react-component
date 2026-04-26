import { ManifestEntry } from '../../../types'
import { section, row, labelStyle } from './styles'
import { ValidationBadges } from './ValidationBadges'

interface IngredientListProps {
  entry: ManifestEntry
}

export function IngredientList({ entry }: IngredientListProps) {
  if (!entry.ingredients?.length) return null
  return (
    <div style={section}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Ingredients</div>
      {entry.ingredients.map((ing, i) => {
        const results = ing.validation_results?.activeManifest
        return (
          <div key={i} style={{ ...row, paddingBottom: 6, borderBottom: '1px solid #f8fafc' }}>
            <div style={{ fontWeight: 500 }}>{ing.title ?? ing.label ?? 'Ingredient'}</div>
            {ing.format && <div><span style={labelStyle}>Format:</span>{ing.format}</div>}
            {ing.relationship && <div><span style={labelStyle}>Relationship:</span>{ing.relationship}</div>}
            {results && <ValidationBadges results={results} />}
          </div>
        )
      })}
    </div>
  )
}
