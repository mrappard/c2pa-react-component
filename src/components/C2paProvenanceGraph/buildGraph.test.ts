import { describe, it, expect } from 'vitest'
import { ManifestStore } from 'c2pa-react-component-types'
import { buildGraph } from './buildGraph'

describe('buildGraph', () => {
  it('connects parent/child manifests via ingredient.active_manifest', () => {
    const manifest: ManifestStore = {
      activeManifest: 'child',
      validation_state: 'Valid',
      manifests: {
        parent: { title: 'Parent' },
        child: {
          title: 'Child',
          ingredients: [{ active_manifest: 'parent', relationship: 'parentOf' }],
        },
      },
    }

    const { nodes, edges } = buildGraph(manifest)

    expect(nodes.map((n) => n.id).sort()).toEqual(['child', 'parent'])
    expect(edges).toHaveLength(1)
    expect(edges[0]).toMatchObject({ source: 'parent', target: 'child' })
  })

  it('falls back to ingredient.manifestId when active_manifest is absent', () => {
    const manifest: ManifestStore = {
      activeManifest: 'child',
      validation_state: 'Valid',
      manifests: {
        parent: { title: 'Parent' },
        child: {
          title: 'Child',
          ingredients: [{ manifestId: 'parent' } as never],
        },
      },
    }

    const { edges } = buildGraph(manifest)

    expect(edges).toHaveLength(1)
    expect(edges[0]).toMatchObject({ source: 'parent', target: 'child' })
  })

  it('connects manifests with no ingredient data to the active manifest', () => {
    // e.g. examples/ChatGPT_Image.json — two manifests, neither has `ingredients`
    const manifest: ManifestStore = {
      activeManifest: 'active',
      validation_state: 'Valid',
      manifests: {
        active: { title: 'Active manifest' },
        other: { title: 'Other manifest' },
      },
    }

    const { nodes, edges } = buildGraph(manifest)

    expect(nodes.map((n) => n.id).sort()).toEqual(['active', 'other'])
    expect(edges).toHaveLength(1)
    expect(edges[0]).toMatchObject({ source: 'other', target: 'active' })
  })

  it('does not add a fallback edge for manifests already connected', () => {
    const manifest: ManifestStore = {
      activeManifest: 'child',
      validation_state: 'Valid',
      manifests: {
        parent: { title: 'Parent' },
        child: {
          title: 'Child',
          ingredients: [{ active_manifest: 'parent', relationship: 'parentOf' }],
        },
      },
    }

    const { edges } = buildGraph(manifest)

    expect(edges).toHaveLength(1)
  })

  it('renders a single manifest with no edges', () => {
    const manifest: ManifestStore = {
      activeManifest: 'solo',
      validation_state: 'Valid',
      manifests: {
        solo: { title: 'Solo manifest' },
      },
    }

    const { nodes, edges } = buildGraph(manifest)

    expect(nodes).toHaveLength(1)
    expect(edges).toHaveLength(0)
  })
})
