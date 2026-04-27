import { LevelProps } from '../../types'

/*
function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}
*/
export function C2paManifestL5({ }: LevelProps) {
 /* const issuer = getIssuer(activeManifest)
  const generator = getGenerator(activeManifest)
  const actions = getActions(activeManifest)
  const valState = manifest .validation_state
  const valColors = validationColor(valState)

  return (
    <div className={cx('c2pa-card', 'c2pa-card--detail', className)}>
      <div className="c2pa-header">
        <CRIcon size={20} />
        <strong className="c2pa-title">{activeManifest.title ?? activeManifest.label}</strong>
        {valState && (
          <span className="c2pa-pill" style={{ backgroundColor: valColors.bg, color: valColors.text }}>
            {valState}
          </span>
        )}
      </div>
      {issuer && <div className="c2pa-row"><span className="c2pa-label">Signed by:</span>{issuer}</div>}
      {generator && <div className="c2pa-row"><span className="c2pa-label">Generator:</span>{generator}</div>}
      {activeManifest.instance_id && (
        <div className="c2pa-row c2pa-row--muted">
          <span className="c2pa-label">Instance:</span>{activeManifest.instance_id}
        </div>
      )}
      {actions.length > 0 && (
        <div className="c2pa-pill-list">
          {actions.map((a) => (
            <span key={a} className="c2pa-pill" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>{a.replace('c2pa.', '')}</span>
          ))}
        </div>
      )}
      <AssertionList entry={activeManifest} raw={true} />
      <SignatureDetail entry={activeManifest} />
      <IngredientList entry={activeManifest} />
      {manifest.validation_results && (
        <div className="c2pa-section">
          <div className="c2pa-section-title">Validation Results</div>
          <ValidationBadges results={manifest.validation_results.activeManifest} />
        </div>
      )}
    </div>
    
  )
    */
   return <div>WIP</div>
}
