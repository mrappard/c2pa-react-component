import { ManifestEntry } from '../../../types'

interface SignatureDetailProps {
  entry: ManifestEntry
}

export function SignatureDetail({ entry }: SignatureDetailProps) {
  const si = entry.signature_info
  if (!si) return null
  return (
    <div className="c2pa-section">
      <div className="c2pa-section-title">Signature</div>
      {si.issuer && <div className="c2pa-row"><span className="c2pa-label">Issuer:</span>{si.issuer}</div>}
      {si.common_name && <div className="c2pa-row"><span className="c2pa-label">Common name:</span>{si.common_name}</div>}
      {si.alg && <div className="c2pa-row"><span className="c2pa-label">Algorithm:</span>{si.alg}</div>}
      {si.cert_serial_number && (
        <div className="c2pa-row c2pa-row--muted">
          <span className="c2pa-label">Serial:</span>{si.cert_serial_number}
        </div>
      )}
    </div>
  )
}
