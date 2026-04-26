import { ValidationResults } from '../../../types'

interface ValidationBadgesProps {
  results: ValidationResults
}

export function ValidationBadges({ results }: ValidationBadgesProps) {
  return (
    <div className="c2pa-pill-list c2pa-pill-list--compact">
      {results.success.length > 0 && (
        <span className="c2pa-pill" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>{results.success.length} passed</span>
      )}
      {results.failure.length > 0 && (
        <span className="c2pa-pill" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>{results.failure.length} failed</span>
      )}
      {results.informational.length > 0 && (
        <span className="c2pa-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{results.informational.length} info</span>
      )}
    </div>
  )
}
