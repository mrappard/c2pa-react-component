export interface Assertion {
  label: string;
  data: any;
  kind?: string;
  instance?: number;
}

export interface Manifest {
  active_manifest: string;
  manifests: {
    [key: string]: {
      label: string;
      claim: string;
      assertions: Assertion[];
      signature: string;
      credentials?: any[];
      thumbnail?: {
        format: string;
        identifier: string;
      };
    };
  };
}

export interface C2paManifestProps {
  manifest: Manifest;
  className?: string;
}
