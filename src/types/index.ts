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
  label?: string
  claim?: string
  claimGenerator?: string | null
  claimGeneratorInfo?: ClaimGeneratorInfo[]
  claim_version?: number
  title?: string
  instanceId?: string
  id?: string
  assertions?: Record<string, any>
  signature?: string
  signatureInfo?: SignatureInfo
  credentials?: unknown[]
  thumbnail?: Thumbnail | null
  ingredients?: Ingredient[]
}

export interface IngredientDelta {
  ingredientAssertionURI: string
  validationDeltas: ValidationResults
}

export interface ManifestStore {
  activeManifest: string
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
  manifest: VerificationOutcome
  level?: DisclosureLevel
  className?: string
  onViewMore?: () => void
  defaultViewMore?: boolean
}

export interface CAWGManifestProps {
  manifest: VerificationOutcome
  level?: DisclosureLevel
  className?: string
  onViewMore?: () => void
    defaultViewMore?: boolean
}

export interface C2paProvenanceGraphProps {
  manifest: ManifestStore
  className?: string
  height?: number
}

export interface Manifest {
  id: string
  title: string
  claimGenerator: string | null
  claimGeneratorInfo: {
    name: string
    "org.contentauth.c2pa_rs": string
  }[]
  instanceId: string
  signatureInfo: {
    alg: string
    issuer: string
    common_name: string
    cert_serial_number: string
  }
  assertions: Record<string, any>
  credentials: []
  thumbnail: string | null
  ingredients: []
}


export interface VerificationOutcome {
    state: boolean;
    manifests: Manifest[];
    manifestStore:  ManifestStore| undefined;
}
