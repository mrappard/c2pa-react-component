# c2pa-react-component

A React component library for displaying [C2PA](https://c2pa.org/) manifest information, aligned with the [C2PA UX Recommendations v2.0](https://spec.c2pa.org/specifications/specifications/2.0/ux/UX_Recommendations.html). Covers progressive disclosure levels L1–L4: icon badge, compact summary, interactive provenance graph, and full forensic view.

## Installation

```bash
npm install c2pa-react-component @xyflow/react
```

`@xyflow/react` is a required peer dependency (used by the L3 provenance graph).

### Peer dependencies

| Package | Version |
|---|---|
| `react` | `^18.0.0 \|\| ^19.0.0` |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` |
| `@xyflow/react` | `^12.0.0` |

## CSS

Import the stylesheet once at the root of your app. Without it, components will render unstyled.

```ts
import "c2pa-react-component/style.css";
```

**Next.js App Router** — add it to `app/layout.tsx`:

```tsx
import "c2pa-react-component/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## Components

### `C2paManifest`

The primary component. Renders C2PA manifest data at a configurable disclosure level.

```tsx
import { C2paManifest } from "c2pa-react-component";

<C2paManifest manifest={verificationOutcome} level={2} />
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `manifest` | `VerificationOutcome` | required | The verification result from a C2PA SDK |
| `level` | `1 \| 2 \| 3 \| 4` | `3` | Initial disclosure level |
| `className` | `string` | — | CSS class applied to the root element |
| `onViewMore` | `() => void` | — | Custom callback when the user requests more detail |
| `defaultViewMore` | `boolean` | — | When `true`, built-in level cycling is used (`1→2→3→4→5→1`) |
| `plugin` | `PluginC2PA[]` | — | Plugin components to render alongside manifest data (see [Plugins](#plugins)) |

#### Disclosure levels

| Level | Description |
|---|---|
| `1` | **Icon badge** — Content Credentials icon with optional content label (AI-generated, AI-edited, Camera-captured). Shows an invalid indicator if the manifest fails validation. |
| `2` | **Compact summary** — Signer, generator, signing date, content label, provenance chain, and tamper alert. Plugins render below the manifest chain. |
| `3` | **Provenance graph** — Interactive node graph of the full ingredient/manifest chain. Click a node to inspect its assertions; click two nodes to compare them side by side. Plugins render inline for their claimed assertions. |
| `4` | **Forensic view** — All manifests, all assertions, signature details, and validation results. Every section is a collapsible accordion (collapsed by default). Assertions show a formatted summary with a "Raw" toggle for full JSON. No plugins — pure data only. |

When `defaultViewMore` is `true`, clicking "View more" at L1 and L2 automatically advances through levels.

---

### `C2paProvenanceGraph`

An interactive node graph visualising the full ingredient/manifest chain. Used internally by L3 and available as a standalone component.

```tsx
import { C2paProvenanceGraph } from "c2pa-react-component";

<C2paProvenanceGraph manifest={manifestStore} height={500} />
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `manifest` | `ManifestStore` | required | The manifest store from `VerificationOutcome.manifestStore` |
| `height` | `number` | `400` | Height of the graph container in pixels |
| `className` | `string` | — | CSS class applied to the root element |
| `selectedIds` | `string[]` | — | Manifest IDs to highlight (up to two — A/B selection) |
| `onNodeClick` | `(id: string) => void` | — | Called when a node is clicked |

Nodes are draggable, the view auto-fits on load, and zoom controls are included.

---

### `CRIcon`

The Content Credentials "cr" icon as an inline SVG component.

```tsx
import { CRIcon } from "c2pa-react-component";

<CRIcon size={24} />
```

---

## Plugins

Plugins are React components that receive the full `VerificationOutcome` and render additional UI for domain-specific assertions (e.g. CAWG identity, DIACC PCTF). They follow the `PluginC2PA` callable interface.

```ts
interface PluginC2PA {
  (props: C2paBaseProps): ReactNode;
  knownAssertions?: string[];
}
```

The optional `knownAssertions` array declares which assertion keys the plugin handles. At L3, assertions listed here are removed from the default assertion panel and the plugin is rendered once in their place. At L4 all assertions are shown as raw data regardless of plugins.

### Declaring known assertions

Add a static `knownAssertions` property to your plugin component after its definition:

```ts
// In your plugin package
export function MyPlugin({ manifest }: C2paBaseProps) {
  // render your UI
}

MyPlugin.knownAssertions = [
  'my.namespace.assertion',
  'my.namespace.other',
]
```

### Registering plugins

Pass an array of plugin components to `C2paManifest`:

```tsx
import { CAWGManifest } from "c2pa-react-cawg-component";
import { DIACCManifest } from "c2pa-react-diacc-component";

<C2paManifest
  manifest={outcome}
  level={2}
  plugin={[CAWGManifest, DIACCManifest]}
/>
```

---

## Content disclosure labels

At L1 and L2, the component automatically derives a content label from `c2pa.actions.v2` assertions using the IPTC `digitalSourceType` vocabulary:

| Label | Condition |
|---|---|
| `AI-generated` | `trainedAlgorithmicMedia` + `c2pa.created` action |
| `AI-edited` | `compositeWithTrainedAlgorithmicMedia` |
| `Camera-captured` | `digitalCapture` + `c2pa.created` action |

No label is shown if none of these conditions match.

---

## Types

All types are re-exported from the package root.

```ts
import type {
  VerificationOutcome,
  ManifestStore,
  ManifestEntry,
  Ingredient,
  Assertion,
  SignatureInfo,
  ValidationResults,
  ValidationResult,
  DisclosureLevel,
  PluginC2PA,
  C2paManifestProps,
  C2paProvenanceGraphProps,
} from "c2pa-react-component";
```

### `VerificationOutcome`

```ts
interface VerificationOutcome {
  state: boolean;
  manifests: Manifest[];
  manifestStore: ManifestStore | undefined;
}
```

### `ManifestStore`

```ts
interface ManifestStore {
  activeManifest: string;
  manifests: Record<string, ManifestEntry>;
  validation_status?: ValidationResult[];
  validation_results?: {
    activeManifest: ValidationResults;
    ingredientDeltas?: IngredientDelta[];
  };
  validation_state?: "Valid" | "Invalid" | "Unknown";
}
```

---

## Usage example

```tsx
import { C2paManifest } from "c2pa-react-component";
import { CAWGManifest } from "c2pa-react-cawg-component";
import type { VerificationOutcome } from "c2pa-react-component";

export function MediaCard({ outcome }: { outcome: VerificationOutcome }) {
  return (
    <div>
      <img src="/photo.jpg" alt="Photo" />
      <C2paManifest
        manifest={outcome}
        level={1}
        defaultViewMore
        plugin={[CAWGManifest]}
      />
    </div>
  );
}
```

---

## Framework notes

### Next.js App Router

This library ships as ESM. No additional `transpilePackages` configuration is needed. Import the CSS in your root layout as shown above.

### Vite / Create React App

No special configuration needed. Import the CSS once in your entry file (e.g. `main.tsx`).

---

## Local development

Use [yalc](https://github.com/wclr/yalc) to consume the library in another local project without publishing to npm.

**Install yalc globally (once):**

```bash
npm install -g yalc
```

**In this repo — build and push:**

```bash
npm run build
yalc publish --push
```

**In your consuming project:**

```bash
yalc add c2pa-react-component
npm install
```

After that, run `yalc publish --push` in this repo after each build to push updates. The consuming project picks them up automatically.

**Revert to the published npm version:**

```bash
yalc remove c2pa-react-component
npm install
```

---

## License

MIT
