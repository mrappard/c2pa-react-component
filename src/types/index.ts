export interface C2paAction {
  action: string
  when?: string
  softwareAgent?: { name: string } | string
  digitalSourceType?: string
  changed?: string[]
  instanceId?: string
  parameters?: Record<string, unknown>
}

export interface Assertion {
  label: string
  data: unknown
  kind?: string
  instance?: number
  created?: boolean
}

export interface ClaimGeneratorInfo {
  name: string
  [key: string]: string
}

export interface SignatureInfo {
  alg?: string
  issuer?: string
  common_name?: string
  cert_serial_number?: string
  time?: string
}

export interface Thumbnail {
  format: string
  identifier: string
}

export interface ValidationResult {
  code: string
  url: string
  explanation: string
}

export interface ValidationResults {
  success: ValidationResult[]
  informational: ValidationResult[]
  failure: ValidationResult[]
}

export interface Ingredient {
  title?: string
  format?: string
  document_id?: string
  instance_id?: string
  relationship?: 'parentOf' | 'componentOf' | 'inputTo'
  thumbnail?: Thumbnail
  active_manifest?: string
  validation_results?: { activeManifest: ValidationResults }
  manifest_data?: { format: string; identifier: string }
  label?: string
}

export interface ManifestEntry {
  label: string
  claim?: string
  claim_generator?: string
  claim_generator_info?: ClaimGeneratorInfo[]
  claim_version?: number
  title?: string
  instance_id?: string
  assertions: Assertion[]
  signature?: string
  signature_info?: SignatureInfo
  credentials?: unknown[]
  thumbnail?: Thumbnail
  ingredients?: Ingredient[]
}

export interface IngredientDelta {
  ingredientAssertionURI: string
  validationDeltas: ValidationResults
}

export interface ManifestStore {
  active_manifest: string
  manifests: Record<string, ManifestEntry>
  validation_status?: ValidationResult[]
  validation_results?: {
    activeManifest: ValidationResults
    ingredientDeltas?: IngredientDelta[]
  }
  validation_state?: 'Valid' | 'Invalid' | 'Unknown'
}

export type DisclosureLevel = 1 | 2 | 3 | 4 | 5

export interface C2paManifestProps {
  manifest: ManifestStore
  level?: DisclosureLevel
  className?: string
  onViewMore?: () => void
}


export interface CAWGManifestProps {
  manifest: Manifest
  level?: DisclosureLevel
  className?: string
  onViewMore?: () => void
}

export interface C2paProvenanceGraphProps {
  manifest: ManifestStore
  className?: string
  height?: number
}


export interface Manifest {
  
      "id": string,
      "title": string,
      "claimGenerator": string | null,
         "claimGeneratorInfo":   {
          "name":string,
          "org.contentauth.c2pa_rs": string
        }[
      
      ],
      "instanceId": string,
      "signatureInfo": {
        "alg": string,
        "issuer": string,
        "common_name": string,
        "cert_serial_number": string
      },
      "assertions": {
        "stds.schema-org.CreativeWork": {
          "@context": string,
          "@type": "CreativeWork",
          "author": {
              "@type": "Person",
              "name": string
            }|{
              "@type": "Person",
              "name": string
            }[],
            "publisher": {
            "@type": "Organization",
            "name": string
          }|{
            "@type": "Organization",
            "name": string
          }[],
          "name": string|null|undefined
        },
        "c2pa.actions.v2": {
          "actions":  {
              "action": "c2pa.created"
            }[
          ]
        }
      },
      "credentials": [],
      "thumbnail": null,
      "ingredients": []
    
}