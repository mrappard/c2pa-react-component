import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { C2paManifest } from './C2paManifest'
import {  VerificationOutcome } from '../../types'

const mockManifest:VerificationOutcome ={
  "state": false,
  "manifests": [
    {
      "id": "urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048",
      "title": "Test Document",
      "claimGenerator": null,
      "claimGeneratorInfo": [
        {
          "name": "test_generator",
          "org.contentauth.c2pa_rs": "0.80.0"
        }
      ],
      "instanceId": "xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b",
      "signatureInfo": {
        "alg": "Es256",
        "issuer": "C2PA Test Signing Cert",
        "common_name": "C2PA Signer",
        "cert_serial_number": "640229841392226413189608867977836244731148734950"
      },
      "assertions": {
        "c2pa.actions.v2": {
          "actions": [
            {
              "action": "c2pa.created"
            }
          ]
        },
        "stds.schema-org.CreativeWork": {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "author": [
            {
              "@type": "Person",
              "name": "Matthew Rappard"
            }
          ],
          "publisher": {
            "@type": "Organization",
            "name": "Example Publisher"
          },
          "name": "Test Document"
        }
      },
      "credentials": [],
      "thumbnail": null,
      "ingredients": []
    }
  ],
  "manifestStore": {
    "activeManifest": "urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048",
    "manifests": {
      "urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048": {
        "claimGenerator": null,
        "claimGeneratorInfo": [
          {
            "name": "test_generator",
            "org.contentauth.c2pa_rs": "0.80.0"
          }
        ],
        "title": "Test Document",
        "instanceId": "xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b",
        "signatureInfo": {
          "alg": "Es256",
          "issuer": "C2PA Test Signing Cert",
          "common_name": "C2PA Signer",
          "cert_serial_number": "640229841392226413189608867977836244731148734950"
        }
      }
    }
  }
}

describe('C2paManifest', () => {
  it('shows fallback when active manifest is missing', () => {
    const bad: VerificationOutcome ={
  "state": false,
  "manifests": [
    {
      "id": "urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048",
      "title": "Test Document",
      "claimGenerator": null,
      "claimGeneratorInfo": [
        {
          "name": "test_generator",
          "org.contentauth.c2pa_rs": "0.80.0"
        }
      ],
      "instanceId": "xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b",
      "signatureInfo": {
        "alg": "Es256",
        "issuer": "C2PA Test Signing Cert",
        "common_name": "C2PA Signer",
        "cert_serial_number": "640229841392226413189608867977836244731148734950"
      },
      "assertions": {
        "c2pa.actions.v2": {
          "actions": [
            {
              "action": "c2pa.created"
            }
          ]
        },
        "stds.schema-org.CreativeWork": {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "author": [
            {
              "@type": "Person",
              "name": "Matthew Rappard"
            }
          ],
          "publisher": {
            "@type": "Organization",
            "name": "Example Publisher"
          },
          "name": "Test Document"
        }
      },
      "credentials": [],
      "thumbnail": null,
      "ingredients": []
    }
  ],
  "manifestStore": {
    "activeManifest": "urn:12345:nonexistent",
    "manifests": {
      "urn:c2pa:0d166542-7288-4833-9662-9487f3dbd048": {
        "claimGenerator": null,
        "claimGeneratorInfo": [
          {
            "name": "test_generator",
            "org.contentauth.c2pa_rs": "0.80.0"
          }
        ],
        "title": "Test Document",
        "instanceId": "xmp:iid:888e39d4-945c-4dbc-9c20-799265e8123b",
        "signatureInfo": {
          "alg": "Es256",
          "issuer": "C2PA Test Signing Cert",
          "common_name": "C2PA Signer",
          "cert_serial_number": "640229841392226413189608867977836244731148734950"
        }
      }
    }
  }
}
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
