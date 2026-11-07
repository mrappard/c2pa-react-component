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
| `className` | `string` | — | CSS class added to the root element of the current level (see [Full-width card](#full-width-card)) |
| `onViewMore` | `() => void` | — | Custom callback when the user clicks "View more" at L1 or L2 |
| `defaultViewMore` | `boolean` | — | When `true` and no `onViewMore` is given, "View more" steps through the levels (`1→2→3→4→1`) |
| `plugin` | `PluginC2PA[]` | — | Plugin components to render alongside manifest data (see [Plugins](#plugins)) |
| `levels` | `LevelOverrides` | — | Replacement views for individual levels (see [Level overrides](#level-overrides)) |
| `resolveUri` | `(uri: string, format?: string) => ReactNode` | — | Renders a signer logo referenced by URI (the claim generator's `icon` or `logo`). Without it, the URI is used directly as an `<img>` source |

#### Disclosure levels

| Level | Description |
|---|---|
| `1` | **Icon badge** — Content Credentials icon with optional content label (see [Content disclosure labels](#content-disclosure-labels)). Shows an invalid indicator if the manifest fails validation. |
| `2` | **Compact summary** — Signer, generator, signing date, content label, provenance chain, and tamper alert. Plugins render below the manifest chain. |
| `3` | **Provenance graph** — Interactive node graph of the full ingredient/manifest chain. Click a node to inspect its assertions; click two nodes to compare them side by side. Plugins render inline for their claimed assertions. |
| `4` | **Forensic view** — All manifests, all assertions, signature details, and validation results. Every section is a collapsible accordion (collapsed by default). Assertions show a formatted summary with a "Raw" toggle for full JSON. No plugins — pure data only. |

#### Full-width card

The L2 card is 420px wide by default. To make it fill its container instead, pass the `c2pa-card--fluid` class:

```tsx
<C2paManifest manifest={outcome} level={2} className="c2pa-card--fluid" />
```

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

### Level components

The four built-in level views are exported as `C2paManifestL1`–`C2paManifestL4`. Each takes `LevelProps`. Most apps use `C2paManifest`; these are useful when building a [level override](#level-overrides) or composing a view yourself.

---

## Plugins

Plugins are React components that receive the full `VerificationOutcome` and render additional UI for domain-specific assertions (e.g. CAWG identity, DIACC PCTF). They follow the `PluginC2PA` callable interface.

```ts
interface PluginC2PA {
  (props: C2paBaseProps): ReactNode;
  knownAssertions?: string[];
  describe?: (entries: ManifestEntry[]) => string | undefined;
}
```

The optional `knownAssertions` array declares which assertion keys the plugin handles. At L3, assertions listed here are removed from the default assertion panel and the plugin is rendered once in their place. At L4 all assertions are shown as raw data regardless of plugins.

The optional `describe` function returns a one-sentence summary of the plugin's assertions across the manifests (oldest ingredient first, active manifest last). This component doesn't call it; level overrides such as [`c2pa-react-component-nouns-verbs`](https://www.npmjs.com/package/c2pa-react-component-nouns-verbs) use it to build a plain-language summary.

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

## Level overrides

The `levels` prop replaces the view for one or more disclosure levels. Each override receives the same `LevelProps` as the built-in view, plus `level` and `Default` — the built-in component for that level — so it can wrap or extend it rather than start from scratch.

```tsx
import { C2paManifest, type LevelRendererProps } from "c2pa-react-component";

function MyL2({ Default, ...props }: LevelRendererProps) {
  return (
    <Default {...props}>
      <p>Extra content shown inside the L2 card.</p>
    </Default>
  );
}

<C2paManifest manifest={outcome} level={2} levels={{ 2: MyL2 }} />
```

Children passed to the built-in L2 view render inside its card, below the standard information. The other levels ignore children.

Ready-made overrides are published as separate packages, for example [`c2pa-react-component-nouns-verbs`](https://www.npmjs.com/package/c2pa-react-component-nouns-verbs):

```tsx
import { nounsVerbsLevels } from "c2pa-react-component-nouns-verbs";

<C2paManifest manifest={outcome} level={2} levels={nounsVerbsLevels} />
```

---

## Content disclosure labels

At L1 and L2, the component derives a content label from the manifest's actions (`c2pa.actions.v2`, or v1 `c2pa.actions`) using the IPTC `digitalSourceType` vocabulary. The first matching rule wins, and AI labels take priority over `Captured`:

| Label | Condition |
|---|---|
| `AI-generated` | `trainedAlgorithmicMedia` on a `c2pa.created` action |
| `AI-edited` | `compositeWithTrainedAlgorithmicMedia` on any action |
| `AI-composite` | `compositeSynthetic` on any action |
| `Captured` | `digitalCapture` on a `c2pa.created` action |

No label is shown if none of these conditions match.

---

## Types

The level-override types are exported from the package root:

```ts
import type {
  LevelProps,
  LevelRendererProps,
  LevelRenderer,
  LevelOverrides,
} from "c2pa-react-component";
```

All other types live in [`c2pa-react-component-types`](https://www.npmjs.com/package/c2pa-react-component-types), which is installed as a dependency:

```ts
import type {
  VerificationOutcome,
  Manifest,
  ManifestStore,
  ManifestEntry,
  Ingredient,
  Assertion,
  C2paAction,
  SignatureInfo,
  ValidationResults,
  ValidationResult,
  DisclosureLevel,
  PluginC2PA,
  C2paBaseProps,
  C2paManifestProps,
  C2paProvenanceGraphProps,
} from "c2pa-react-component-types";
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
import type { VerificationOutcome } from "c2pa-react-component-types";

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

Use [yalc](https://github.com/wclr/yalc) to try the library in another local project without publishing to npm.

**Install yalc globally (once):**

```bash
npm install -g yalc
```

**In this repo — build and publish to the local yalc store:**

```bash
npm run build
yalc publish
```

**In your consuming project — link it without changing `package.json`:**

```bash
yalc link c2pa-react-component
```

After each change, run `npm run build && yalc push` in this repo; linked projects pick up the new build. Restart a Vite dev server with `--force` so it doesn't serve a cached copy. Running `npm install` in the consuming project removes the link, so run `yalc link` again afterwards.

`yalc add` also works, but it rewrites the consuming project's `package.json` to a `file:.yalc/...` path. Don't commit or publish that: anyone installing from npm can't resolve it. Use `yalc remove c2pa-react-component && npm install` to go back to the npm version.

### Publishing

`npm publish` runs the build first (`prepublishOnly`). Check that no dependency in `package.json` points at `file:.yalc/...` before publishing.

---

## License

MIT
