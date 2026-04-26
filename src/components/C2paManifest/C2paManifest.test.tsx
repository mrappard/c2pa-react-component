import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { C2paManifest } from './C2paManifest'
import { ManifestStore } from '../../types'

const mockManifest: ManifestStore = {
  active_manifest: 'urn:uuid:test-1',
  manifests: {
    'urn:uuid:test-1': {
      label: 'Test Manifest',
      title: 'test-image.png',
      claim: 'Test claim text',
      claim_generator_info: [{ name: 'TestApp' }],
      signature_info: { issuer: 'Test Issuer', alg: 'Es256', cert_serial_number: '12345' },
      assertions: [
        { label: 'c2pa.actions', data: { actions: [{ action: 'c2pa.created' }] } },
      ],
      signature: 'urn:uuid:sig-1',
    },
  },
  validation_state: 'Valid',
}

describe('C2paManifest', () => {
  it('shows fallback when active manifest is missing', () => {
    const bad: ManifestStore = { active_manifest: 'urn:uuid:missing', manifests: {} }
    render(<C2paManifest manifest={bad} />)
    expect(screen.getByText(/No active manifest found/)).toBeInTheDocument()
  })

  it('L1 — renders only the icon, no text content', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} level={1} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText(/Test Issuer/)).not.toBeInTheDocument()
    expect(screen.queryByText(/test-image/)).not.toBeInTheDocument()
  })

  it('L2 — shows issuer and validation state', () => {
    render(<C2paManifest manifest={mockManifest} level={2} />)
    expect(screen.getByText('Test Issuer')).toBeInTheDocument()
    expect(screen.getByText('Valid')).toBeInTheDocument()
    expect(screen.queryByText(/c2pa.actions/)).not.toBeInTheDocument()
  })

  it('L3 — shows title, generator, and action pills', () => {
    render(<C2paManifest manifest={mockManifest} level={3} />)
    expect(screen.getByText('test-image.png')).toBeInTheDocument()
    expect(screen.getByText('TestApp')).toBeInTheDocument()
    expect(screen.getByText('created')).toBeInTheDocument()
  })

  it('L4 — shows assertion labels and signature detail', () => {
    render(<C2paManifest manifest={mockManifest} level={4} />)
    expect(screen.getByText('c2pa.actions')).toBeInTheDocument()
    expect(screen.getByText('Es256')).toBeInTheDocument()
    expect(screen.queryByText(/"c2pa.created"/)).not.toBeInTheDocument()
  })

  it('L5 — shows raw assertion JSON', () => {
    render(<C2paManifest manifest={mockManifest} level={5} />)
    expect(screen.getByText(/"c2pa.created"/)).toBeInTheDocument()
    expect(screen.getByText('12345')).toBeInTheDocument()
  })

  it('defaults to level 3', () => {
    render(<C2paManifest manifest={mockManifest} />)
    expect(screen.getByText('test-image.png')).toBeInTheDocument()
    expect(screen.queryByText(/"c2pa.created"/)).not.toBeInTheDocument()
  })

  it('applies custom className at L3', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} level={3} className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
