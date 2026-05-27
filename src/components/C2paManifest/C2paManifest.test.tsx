import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { C2paManifest } from './C2paManifest'
import { VerificationOutcome } from 'c2pa-react-component-types'

// React Flow uses ResizeObserver which is not available in jsdom
beforeEach(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const mockManifest: VerificationOutcome = {
  state: false,
  manifests: [
    {
      id: 'urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048',
      title: 'Test Document',
      claimGenerator: null,
      claimGeneratorInfo: [{ name: 'test_generator', 'org.contentauth.c2pa_rs': '0.80.0' }],
      instanceId: 'xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b',
      signatureInfo: {
        alg: 'Es256',
        issuer: 'C2PA Test Signing Cert',
        common_name: 'C2PA Signer',
        cert_serial_number: '640229841392226413189608867977836244731148734950',
      },
      assertions: {
        'c2pa.actions.v2': { actions: [{ action: 'c2pa.created' }] },
        'stds.schema-org.CreativeWork': {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          author: [{ '@type': 'Person', name: 'Matthew Rappard' }],
          publisher: { '@type': 'Organization', name: 'Example Publisher' },
          name: 'Test Document',
        },
      },
      credentials: [],
      thumbnail: null,
      ingredients: [],
    },
  ],
  manifestStore: {
    activeManifest: 'urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048',
    validation_state: 'Valid',
    manifests: {
      'urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048': {
        claimGenerator: null,
        claimGeneratorInfo: [{ name: 'test_generator', 'org.contentauth.c2pa_rs': '0.80.0' }],
        title: 'Test Document',
        instanceId: 'xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b',
        signatureInfo: {
          alg: 'Es256',
          issuer: 'C2PA Test Signing Cert',
          common_name: 'C2PA Signer',
          cert_serial_number: '640229841392226413189608867977836244731148734950',
        },
        assertions: {
          'c2pa.actions.v2': { actions: [{ action: 'c2pa.created' }] },
          'stds.schema-org.CreativeWork': {
            author: [{ name: 'Matthew Rappard' }],
            publisher: { name: 'Example Publisher' },
          },
        },
      },
    },
  },
}

describe('C2paManifest', () => {
  it('shows fallback when active manifest is missing', () => {
    const bad: VerificationOutcome = {
      ...mockManifest,
      manifestStore: {
        activeManifest: 'urn:nonexistent',
        manifests: mockManifest.manifestStore!.manifests,
      },
    }
    render(<C2paManifest manifest={bad} />)
    expect(screen.getByText(/No active manifest found/)).toBeInTheDocument()
  })

  it('L1 — renders the icon with no manifest text', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} level={1} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText('C2PA Test Signing Cert')).not.toBeInTheDocument()
    expect(screen.queryByText('test_generator')).not.toBeInTheDocument()
  })

  it('L2 — shows signer and generator', () => {
    render(<C2paManifest manifest={mockManifest} level={2} />)
    expect(screen.getByText('C2PA Test Signing Cert')).toBeInTheDocument()
    expect(screen.getByText('test_generator')).toBeInTheDocument()
  })

  it('L3 — renders the split-pane provenance graph', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} level={3} />)
    expect(container.querySelector('.c2pa-l3')).toBeInTheDocument()
    expect(container.querySelector('.c2pa-l3-graph')).toBeInTheDocument()
    expect(container.querySelector('.c2pa-l3-panel')).toBeInTheDocument()
  })

  it('L3 — assertion panel shows empty state before node selection', () => {
    render(<C2paManifest manifest={mockManifest} level={3} />)
    expect(screen.getByText(/Click a node in the graph/)).toBeInTheDocument()
  })

  it('L4 — renders forensic view with collapsed accordions', () => {
    render(<C2paManifest manifest={mockManifest} level={4} />)
    expect(screen.getByText('Forensic view')).toBeInTheDocument()
    expect(screen.getByText('Test Document')).toBeInTheDocument()
    expect(screen.getByText('Valid')).toBeInTheDocument()
    // Accordion buttons are visible
    expect(screen.getByText('Signature')).toBeInTheDocument()
    expect(screen.getByText('Software')).toBeInTheDocument()
    expect(screen.getByText('Assertions (2)')).toBeInTheDocument()
    // Content is collapsed — detail values not visible
    expect(screen.queryByText('Es256')).not.toBeInTheDocument()
  })

  it('L4 — expanding Signature reveals details', () => {
    render(<C2paManifest manifest={mockManifest} level={4} />)
    fireEvent.click(screen.getByText('Signature').closest('button')!)
    expect(screen.getByText('Es256')).toBeInTheDocument()
    expect(screen.getByText('C2PA Test Signing Cert')).toBeInTheDocument()
  })

  it('L4 — expanding Assertions reveals assertion rows with Raw toggle', () => {
    render(<C2paManifest manifest={mockManifest} level={4} />)
    fireEvent.click(screen.getByText('Assertions (2)').closest('button')!)
    expect(screen.getByText('Edits and activity')).toBeInTheDocument()
    expect(screen.getByText('Creative work')).toBeInTheDocument()
    // Raw JSON not visible until toggled
    expect(screen.queryByText(/"c2pa.created"/)).not.toBeInTheDocument()
  })

  it('L4 — Raw toggle shows full JSON', () => {
    render(<C2paManifest manifest={mockManifest} level={4} />)
    fireEvent.click(screen.getByText('Assertions (2)').closest('button')!)
    const rawBtns = screen.getAllByText('Raw')
    fireEvent.click(rawBtns[0])
    expect(screen.getByText(/"c2pa.created"/)).toBeInTheDocument()
  })

  it('defaults to level 3', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} />)
    expect(container.querySelector('.c2pa-l3')).toBeInTheDocument()
  })

  it('applies custom className at L3', () => {
    const { container } = render(<C2paManifest manifest={mockManifest} level={3} className="custom" />)
    expect(container.querySelector('.c2pa-l3.custom')).toBeInTheDocument()
  })
})
