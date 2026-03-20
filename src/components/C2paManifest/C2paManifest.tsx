import React from 'react';
import { C2paManifestProps } from '../../types';

/**
 * C2paManifest component displays C2PA manifest information.
 * 
 * @param {C2paManifestProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const C2paManifest: React.FC<C2paManifestProps> = ({ manifest, className }) => {
  const activeManifestLabel = manifest.active_manifest;
  const activeManifest = manifest.manifests[activeManifestLabel];

  if (!activeManifest) {
    return <div className={className}>No active manifest found.</div>;
  }

  return (
    <div className={`c2pa-manifest-container ${className || ''}`} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>C2PA Manifest: {activeManifest.label}</h3>
      <div>
        <strong>Claim:</strong> {activeManifest.claim}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <strong>Assertions:</strong>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {activeManifest.assertions.map((assertion, index) => (
            <li key={`${assertion.label}-${index}`} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
              <div><strong>Label:</strong> {assertion.label}</div>
              {assertion.kind && <div><strong>Kind:</strong> {assertion.kind}</div>}
              <div>
                <strong>Data:</strong>
                <pre style={{ backgroundColor: '#f9f9f9', padding: '0.5rem', fontSize: '0.85rem' }}>
                  {JSON.stringify(assertion.data, null, 2)}
                </pre>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default C2paManifest;
