import { CRIcon } from '../../../../icons/CRIcon'
import { LevelProps } from '../../types'
import { card, pill, labelStyle, section, row } from '../../shared/styles'
import { getIssuer, getGenerator, getActions, validationColor } from '../../shared/utils'

export function C2paManifestL3({ manifest, activeManifest, className }: LevelProps) {
  const issuer = getIssuer(activeManifest)
  const generator = getGenerator(activeManifest)
  const actions = getActions(activeManifest)
  const valState = manifest.validation_state
  const valColors = validationColor(valState)

  return (
    <div className={className} style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <CRIcon size={20} />
        <strong>{activeManifest.title ?? activeManifest.label}</strong>
        {valState && <span style={pill(valColors.bg, valColors.text)}>{valState}</span>}
      </div>
      {issuer && <div style={row}><span style={labelStyle}>Signed by:</span>{issuer}</div>}
      {generator && <div style={row}><span style={labelStyle}>Generator:</span>{generator}</div>}
      {actions.length > 0 && (
        <div style={{ ...section, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {actions.map((a) => (
            <span key={a} style={pill('#f1f5f9', '#334155')}>{a.replace('c2pa.', '')}</span>
          ))}
        </div>
      )}
    </div>
  )
}
