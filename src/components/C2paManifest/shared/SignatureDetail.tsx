import { ManifestEntry } from '../../../types'
import { section, row, labelStyle } from './styles'

interface SignatureDetailProps {
  entry: ManifestEntry
}

export function SignatureDetail({ entry }: SignatureDetailProps) {
  const si = entry.signature_info
  if (!si) return null
  return (
    <div style={section}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Signature</div>
      {si.issuer && <div style={row}><span style={labelStyle}>Issuer:</span>{si.issuer}</div>}
      {si.common_name && <div style={row}><span style={labelStyle}>Common name:</span>{si.common_name}</div>}
      {si.alg && <div style={row}><span style={labelStyle}>Algorithm:</span>{si.alg}</div>}
      {si.cert_serial_number && (
        <div style={{ ...row, fontSize: 11, color: '#94a3b8', wordBreak: 'break-all' }}>
          <span style={labelStyle}>Serial:</span>{si.cert_serial_number}
        </div>
      )}
    </div>
  )
}
