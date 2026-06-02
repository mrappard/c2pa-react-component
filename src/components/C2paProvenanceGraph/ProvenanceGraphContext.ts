import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

interface ProvenanceGraphContextValue {
  resolveUri?: (uri: string, format?: string) => ReactNode
}

export const ProvenanceGraphContext = createContext<ProvenanceGraphContextValue>({})

export function useProvenanceGraphContext() {
  return useContext(ProvenanceGraphContext)
}
