import React from 'react'

export const card: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: '12px 16px',
  fontFamily: 'sans-serif',
  fontSize: 13,
  color: '#0f172a',
  background: '#fff',
  display: 'inline-block',
}

export const pill = (bg: string, text: string): React.CSSProperties => ({
  display: 'inline-block',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color: text,
})

export const labelStyle: React.CSSProperties = { color: '#64748b', marginRight: 4 }
export const section: React.CSSProperties = { marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }
export const row: React.CSSProperties = { marginBottom: 4 }
