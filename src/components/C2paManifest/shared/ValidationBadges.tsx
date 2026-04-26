import { ValidationResults } from '../../../types'
import { pill } from './styles'

interface ValidationBadgesProps {
  results: ValidationResults
}

export function ValidationBadges({ results }: ValidationBadgesProps) {
  return (
    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {results.success.length > 0 && (
        <span style={pill('#dcfce7', '#15803d')}>{results.success.length} passed</span>
      )}
      {results.failure.length > 0 && (
        <span style={pill('#fee2e2', '#b91c1c')}>{results.failure.length} failed</span>
      )}
      {results.informational.length > 0 && (
        <span style={pill('#f1f5f9', '#475569')}>{results.informational.length} info</span>
      )}
    </div>
  )
}
