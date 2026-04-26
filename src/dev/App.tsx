import { C2paManifest } from '../components/C2paManifest/C2paManifest'
import { C2paProvenanceGraph } from '../components/C2paProvenanceGraph/C2paProvenanceGraph'
import { CAWGManifest } from '../components/Cawg/Cawg'
import { Manifest, ManifestStore } from '../types'

const sampleManifest: ManifestStore = {
  "active_manifest": "urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971",
  "manifests": {
    "urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94": {
      "claim_generator_info": [
        {
          "name": "ChatGPT",
          "org.contentauth.c2pa_rs": "0.0.0"
        }
      ],
      "title": "image.png",
      "instance_id": "xmp:iid:412ff266-e238-4869-b81e-b2da56461a52",
      "assertions": [
        {
          "label": "c2pa.actions.v2",
          "data": {
            "actions": [
              {
                "action": "c2pa.created",
                "softwareAgent": {
                  "name": "GPT-4o"
                },
                "digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
              },
              {
                "action": "c2pa.converted"
              }
            ]
          },
          "created": true
        }
      ],
      "signature_info": {
        "alg": "Es256",
        "issuer": "OpenAI",
        "common_name": "Truepic Lens CLI in Sora",
        "cert_serial_number": "617499572571975960762842960741769199804397700166"
      },
      "label": "urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94",
      "claim_version": 2
    },
    "urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971": {
      "claim_generator_info": [
        {
          "name": "ChatGPT",
          "org.contentauth.c2pa_rs": "0.0.0"
        }
      ],
      "title": "image.png",
      "instance_id": "xmp:iid:94667f26-cf6b-4e5d-88db-4a5129a30a54",
      "ingredients": [
        {
          "title": "image.png",
          "format": "png",
          "instance_id": "xmp:iid:d980243d-1cb5-4d04-9669-65e5752b8240",
          "thumbnail": {
            "format": "image/jpeg",
            "identifier": "self#jumbf=c2pa.assertions/c2pa.thumbnail.ingredient"
          },
          "relationship": "parentOf",
          "active_manifest": "urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94",
          "validation_results": {
            "activeManifest": {
              "success": [
                {
                  "code": "claimSignature.insideValidity",
                  "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.signature",
                  "explanation": "claim signature valid"
                },
                {
                  "code": "claimSignature.validated",
                  "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.signature",
                  "explanation": "claim signature valid"
                },
                {
                  "code": "assertion.hashedURI.match",
                  "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.assertions/c2pa.actions.v2",
                  "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.actions.v2"
                },
                {
                  "code": "assertion.hashedURI.match",
                  "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.assertions/c2pa.hash.data",
                  "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.hash.data"
                },
                {
                  "code": "assertion.dataHash.match",
                  "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.assertions/c2pa.hash.data",
                  "explanation": "data hash valid"
                }
              ],
              "informational": [],
              "failure": []
            }
          },
          "manifest_data": {
            "format": "application/c2pa",
            "identifier": "urn-c2pa-ec8fd500-c0c2-4b84-8263-f6a1bf03ea94-manifest_data.c2pa"
          },
          "label": "c2pa.ingredient.v3"
        }
      ],
      "assertions": [
        {
          "label": "c2pa.actions.v2",
          "data": {
            "actions": [
              {
                "action": "c2pa.opened",
                "parameters": {
                  "ingredients": [
                    {
                      "url": "self#jumbf=c2pa.assertions/c2pa.ingredient.v3",
                      "hash": "PQpbDO6GhRu+5q9TAS5DYYfQHZI7REJMW3gLESDI9g0="
                    }
                  ]
                }
              }
            ]
          },
          "created": true
        }
      ],
      "signature_info": {
        "alg": "Es256",
        "issuer": "OpenAI",
        "common_name": "Truepic Lens CLI in Sora",
        "cert_serial_number": "617499572571975960762842960741769199804397700166"
      },
      "label": "urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971",
      "claim_version": 2
    }
  },
  "validation_status": [
    {
      "code": "signingCredential.untrusted",
      "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.signature",
      "explanation": "signing certificate untrusted"
    },
    {
      "code": "signingCredential.untrusted",
      "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.signature",
      "explanation": "signing certificate untrusted"
    }
  ],
  "validation_results": {
    "activeManifest": {
      "success": [
        {
          "code": "claimSignature.insideValidity",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.signature",
          "explanation": "claim signature valid"
        },
        {
          "code": "claimSignature.validated",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.signature",
          "explanation": "claim signature valid"
        },
        {
          "code": "assertion.hashedURI.match",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.thumbnail.ingredient",
          "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.thumbnail.ingredient"
        },
        {
          "code": "assertion.hashedURI.match",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.ingredient.v3",
          "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.ingredient.v3"
        },
        {
          "code": "assertion.hashedURI.match",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.actions.v2",
          "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.actions.v2"
        },
        {
          "code": "assertion.hashedURI.match",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.hash.data",
          "explanation": "hashed uri matched: self#jumbf=c2pa.assertions/c2pa.hash.data"
        },
        {
          "code": "assertion.dataHash.match",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.hash.data",
          "explanation": "data hash valid"
        }
      ],
      "informational": [],
      "failure": [
        {
          "code": "signingCredential.untrusted",
          "url": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.signature",
          "explanation": "signing certificate untrusted"
        }
      ]
    },
    "ingredientDeltas": [
      {
        "ingredientAssertionURI": "self#jumbf=/c2pa/urn:c2pa:5e7b0c6d-8e4e-41bd-88d4-e4ef2984a971/c2pa.assertions/c2pa.ingredient.v3",
        "validationDeltas": {
          "success": [
            {
              "code": "ingredient.manifest.validated",
              "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94",
              "explanation": "ingredient hash matched"
            }
          ],
          "informational": [],
          "failure": [
            {
              "code": "signingCredential.untrusted",
              "url": "self#jumbf=/c2pa/urn:c2pa:ec8fd500-c0c2-4b84-8263-f6a1bf03ea94/c2pa.signature",
              "explanation": "signing certificate untrusted"
            }
          ]
        }
      }
    ]
  },
  "validation_state": "Invalid"
}

const targetManifest =   {
      "id": "urn:c2pa:2d6a7480-a075-4f05-be5e-ca656c6180ba",
      "title": "New document",
      "claimGenerator": null,
      "claimGeneratorInfo": [
        {
          "name": "test_generator",
          "org.contentauth.c2pa_rs": "0.80.0"
        }
      ],
      "instanceId": "xmp:iid:93a8bba7-b45d-4e6b-8727-b6671084bb76",
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
          "author": [],
          "publisher": {
            "@type": "Organization",
            "name": "Example Publisher"
          },
          "name": "New document"
        }
      },
      "credentials": [],
      "thumbnail": null,
      "ingredients": []
    } as const satisfies Manifest;

export default function App() {
  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>C2PA React Components – Dev Playground</h1>
      <h2>Provenance Graph</h2>
      <C2paProvenanceGraph manifest={sampleManifest} height={400} />
      <h2 style={{ marginTop: '2rem' }}>Disclosure Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {([1, 2, 3, 4, 5] as const).map((l) => (
          <div key={l}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#475569' }}>Level {l}</p>
            <C2paManifest
              manifest={sampleManifest}
              level={l}
              onViewMore={l === 2 ? () => alert('Navigate to L3') : undefined}
            />
          </div>
        ))}
      </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {([1, 2, 3] as const).map((l) => (
          <div key={l}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#475569' }}>Level {l}</p>
            <CAWGManifest
              manifest={targetManifest}
              level={l}
              onViewMore={l === 2 ? () => alert('Navigate to L3') : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
