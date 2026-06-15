import { describe, it, expect } from 'vitest'
import { VerificationOutcome } from 'c2pa-react-component-types'
import { normalizeOutcome } from './normalizeOutcome'

describe('normalizeOutcome', () => {
  it('passes through an outcome with no manifestStore', () => {
    const outcome = { state: true, manifests: [], manifestStore: undefined } as VerificationOutcome
    expect(normalizeOutcome(outcome)).toBe(outcome)
  })

  it('merges ingredients, assertions, thumbnail and claimGeneratorInfo from manifests[] into manifestStore.manifests', () => {
    const outcome: VerificationOutcome = {
      state: true,
      manifests: [
        {
          id: 'urn:c2pa:active',
          title: 'Active',
          claimGenerator: 'TestGen',
          claimGeneratorInfo: [{ name: 'TestGen', 'org.contentauth.c2pa_rs': '1.0' }],
          instanceId: 'instance-1',
          signatureInfo: { alg: 'Es256', issuer: 'Test', common_name: 'Test', cert_serial_number: '123' },
          assertions: { 'c2pa.actions.v2': { actions: [{ action: 'c2pa.edited' }] } },
          credentials: [],
          thumbnail: 'data:image/png;base64,xyz',
          ingredients: [{ active_manifest: 'urn:c2pa:parent', relationship: 'parentOf' }] as never,
        },
      ],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: {
          'urn:c2pa:active': {},
          'urn:c2pa:parent': {},
        },
      },
    }

    const normalized = normalizeOutcome(outcome)
    const active = normalized.manifestStore!.manifests['urn:c2pa:active']

    expect(active.title).toBe('Active')
    expect(active.instanceId).toBe('instance-1')
    expect(active.claimGeneratorInfo).toEqual([{ name: 'TestGen', 'org.contentauth.c2pa_rs': '1.0' }])
    expect(active.assertions).toEqual({ 'c2pa.actions.v2': { actions: [{ action: 'c2pa.edited' }] } })
    expect(active.thumbnail).toBe('data:image/png;base64,xyz')
    expect(active.ingredients).toEqual([{ active_manifest: 'urn:c2pa:parent', relationship: 'parentOf' }])
  })

  it('converts Map-based assertions to a plain object', () => {
    const assertions = new Map<string, unknown>([['c2pa.actions.v2', { actions: [] }]])
    const outcome: VerificationOutcome = {
      state: true,
      manifests: [
        {
          id: 'urn:c2pa:active',
          title: 'Active',
          claimGenerator: null,
          claimGeneratorInfo: [],
          instanceId: '',
          signatureInfo: { alg: '', issuer: '', common_name: '', cert_serial_number: '' },
          assertions: assertions as unknown as Record<string, any>,
          credentials: [],
          thumbnail: null,
          ingredients: [] as never,
        },
      ],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: { 'urn:c2pa:active': {} },
      },
    }

    const normalized = normalizeOutcome(outcome)

    expect(normalized.manifestStore!.manifests['urn:c2pa:active'].assertions).toEqual({
      'c2pa.actions.v2': { actions: [] },
    })
  })

  it('aliases ingredient.manifestId to active_manifest', () => {
    const outcome: VerificationOutcome = {
      state: true,
      manifests: [
        {
          id: 'urn:c2pa:active',
          title: 'Active',
          claimGenerator: null,
          claimGeneratorInfo: [],
          instanceId: '',
          signatureInfo: { alg: '', issuer: '', common_name: '', cert_serial_number: '' },
          assertions: {},
          credentials: [],
          thumbnail: null,
          ingredients: [{ manifestId: 'urn:c2pa:parent' }] as never,
        },
      ],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: { 'urn:c2pa:active': {}, 'urn:c2pa:parent': {} },
      },
    }

    const normalized = normalizeOutcome(outcome)

    expect(normalized.manifestStore!.manifests['urn:c2pa:active'].ingredients).toEqual([
      { manifestId: 'urn:c2pa:parent', active_manifest: 'urn:c2pa:parent' },
    ])
  })

  it('wraps a scalar claimGeneratorInfo into an array', () => {
    const outcome: VerificationOutcome = {
      state: true,
      manifests: [
        {
          id: 'urn:c2pa:active',
          title: 'Active',
          claimGenerator: null,
          claimGeneratorInfo: { name: 'TestGen', 'org.contentauth.c2pa_rs': '1.0' } as never,
          instanceId: '',
          signatureInfo: { alg: '', issuer: '', common_name: '', cert_serial_number: '' },
          assertions: {},
          credentials: [],
          thumbnail: null,
          ingredients: [] as never,
        },
      ],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: { 'urn:c2pa:active': {} },
      },
    }

    const normalized = normalizeOutcome(outcome)

    expect(normalized.manifestStore!.manifests['urn:c2pa:active'].claimGeneratorInfo).toEqual([
      { name: 'TestGen', 'org.contentauth.c2pa_rs': '1.0' },
    ])
  })

  it('handles manifestStore.manifests provided as a Map', () => {
    const manifests = new Map<string, Record<string, unknown>>([['urn:c2pa:active', { title: 'From store' }]])
    const outcome: VerificationOutcome = {
      state: true,
      manifests: [],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: manifests as never,
      },
    }

    const normalized = normalizeOutcome(outcome)

    expect(normalized.manifestStore!.manifests['urn:c2pa:active']).toMatchObject({ title: 'From store' })
  })

  it('derives validation_state from outcome.state when not set', () => {
    const outcome: VerificationOutcome = {
      state: false,
      manifests: [],
      manifestStore: {
        activeManifest: 'urn:c2pa:active',
        manifests: { 'urn:c2pa:active': {} },
      },
    }

    const normalized = normalizeOutcome(outcome)

    expect(normalized.manifestStore!.validation_state).toBe('Invalid')
  })
})
