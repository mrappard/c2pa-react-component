import { CRIcon } from '../../../../icons/CRIcon'
import { LevelProps } from '../../types'
import { card, pill, labelStyle, section, row } from '../../shared/styles'
import { getIssuer, getGenerator, getActions, validationColor } from '../../shared/utils'
import { AssertionList } from '../../shared/AssertionList'
import { SignatureDetail } from '../../shared/SignatureDetail'
import { IngredientList } from '../../shared/IngredientList'
import { ValidationBadges } from '../../shared/ValidationBadges'

export function C2paManifestL5({ manifest, activeManifest, className }: LevelProps) {
  const issuer = getIssuer(activeManifest)
  const generator = getGenerator(activeManifest)
  const actions = getActions(activeManifest)
  const valState = manifest.validation_state
  const valColors = validationColor(valState)

  return (
    <div className={className} style={{ ...card, display: 'block', minWidth: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <CRIcon size={20} />
        <strong>{activeManifest.title ?? activeManifest.label}</strong>
        {valState && <span style={pill(valColors.bg, valColors.text)}>{valState}</span>}
      </div>
      {issuer && <div style={row}><span style={labelStyle}>Signed by:</span>{issuer}</div>}
      {generator && <div style={row}><span style={labelStyle}>Generator:</span>{generator}</div>}
      {activeManifest.instance_id && (
        <div style={{ ...row, fontSize: 11, color: '#94a3b8', wordBreak: 'break-all' }}>
          <span style={labelStyle}>Instance:</span>{activeManifest.instance_id}
        </div>
      )}
      {actions.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {actions.map((a) => (
            <span key={a} style={pill('#f1f5f9', '#334155')}>{a.replace('c2pa.', '')}</span>
          ))}
        </div>
      )}
      <AssertionList entry={activeManifest} raw={true} />
      <SignatureDetail entry={activeManifest} />
      <IngredientList entry={activeManifest} />
      {manifest.validation_results && (
        <div style={section}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Validation Results</div>
          <ValidationBadges results={manifest.validation_results.activeManifest} />
        </div>
      )}
    </div>
  )
}
