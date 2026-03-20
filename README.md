# c2pa-react-component

A React library for displaying C2PA manifest information from a JSON file.

## Features

- **Read-only**: Displays C2PA information without the ability to verify.
- **TypeScript**: Fully typed for better developer experience.
- **Easy Integration**: Simple React component to display manifest data.

## Installation

```bash
npm install c2pa-react-component
```

## Usage

```tsx
import { C2paManifest, Manifest } from 'c2pa-react-component';

const myManifest: Manifest = {
  active_manifest: "manifest_1",
  manifests: {
    "manifest_1": {
      label: "My Content Manifest",
      claim: "urn:c2pa:manifest_1",
      assertions: [
        {
          label: "c2pa.actions",
          data: {
            actions: [
              { action: "c2pa.created" }
            ]
          }
        }
      ],
      signature: "base64-encoded-signature-here"
    }
  }
};

function App() {
  return (
    <div className="App">
      <h1>C2PA Viewer</h1>
      <C2paManifest manifest={myManifest} />
    </div>
  );
}

export default App;
```

## License

MIT
