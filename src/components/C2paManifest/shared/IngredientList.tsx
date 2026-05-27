import { ManifestEntry } from 'c2pa-react-component-types'
import { ValidationBadges } from './ValidationBadges'

interface IngredientListProps {
  entry: ManifestEntry
}

export function IngredientList({ entry }: IngredientListProps) {
  if (!entry.ingredients?.length) return null
  return (
    <div className="c2pa-section">
      <div className="c2pa-section-title">Ingredients</div>
      {entry.ingredients.map((ing, i) => {
        const results = ing.validation_results?.activeManifest
        return (
          <div key={i} className="c2pa-row c2pa-list-item">
            <div className="c2pa-list-item-title">{ing.title ?? ing.label ?? 'Ingredient'}</div>
            {ing.format && <div><span className="c2pa-label">Format:</span>{ing.format}</div>}
            {ing.relationship && <div><span className="c2pa-label">Relationship:</span>{ing.relationship}</div>}
            {results && <ValidationBadges results={results} />}
          </div>
        )
      })}
    </div>
  )
}
