# Design System

The visual language for the Portfolio app. It exists to make every screen feel
like one product - minimal, elegant, premium, and _extremely_ consistent. The
reference points are Linear, Vercel, Stripe, Notion, and Apple: restraint over
decoration, hierarchy through space and weight, color used as a scalpel.

> **One rule above all others:** never hard-code a color, radius, or shadow in a
> component. Everything flows from the tokens below.

---

## 1. Foundations

### Color

Color lives in **two** places only:

1. `app/globals.css` - raw values as CSS custom properties (`--ink`, `--line`, …).
2. `tailwind.config.ts` - maps those variables to Tailwind color names.

Components reference the **Tailwind names**, never raw hex. This makes theming
(including a future dark mode) a single-file change.

| Token | Variable | Role |
| --- | --- | --- |
| `canvas` | `--canvas` `#faf9f7` | App background - warm, paper-like |
| `surface` | `--surface` `#ffffff` | Cards and raised panels |
| `line` | `--line` `#ecebe6` | Default hairline / border |
| `line-strong` | `--line-strong` `#e2e0da` | Emphasized border, active card |
| `ink` | `--ink` `#18191b` | Primary text |
| `ink-secondary` | `--ink-secondary` `#56585e` | Body text |
| `ink-tertiary` | `--ink-tertiary` `#85888f` | Captions, meta, eyebrows |
| `ink-faint` | `--ink-faint` `#a9acb2` | Disabled, decorative |

**Category accents** - one color per branch, used sparingly (a dot, a section
kicker, the winning chart bar, a takeaway rule). Never as a fill behind text.

| Accent | Variable | Branch |
| --- | --- | --- |
| `accent-exp` | `#2f6ded` (blue) | Experimentation |
| `accent-ai` | `#15925a` (green) | AI Builds |
| `accent-product` | `#7c3aed` (violet) | Products |

**Outcome semantics** - a node's status is colored by _result_, not by category,
so a "win" reads the same everywhere.

| Tone | Color | Meaning |
| --- | --- | --- |
| `win` | green | Test won |
| `near` | amber | Near miss / just under the bar |
| `flat` | neutral | Inconclusive / prototype |
| `shipped` | green dot | Shipped to production |
| `live` | blue dot | Live / in progress |

Accent → class mappings are centralized in `lib/accents.ts`. Because Tailwind
JIT only sees literal class strings, **every accent class is written out in full
there** - never build a class name by string concatenation in a component.

### Typography

- **Sans:** Inter (`--font-sans`) - UI and body.
- **Mono:** JetBrains Mono (`--font-mono`) - data, metrics, chart labels, and the
  H1/H2 hypothesis tags. Mono signals "measured / quantitative," which fits a
  data-driven PM.

Scale (all optical, tuned by eye rather than a rigid ratio):

| Use | Size / weight |
| --- | --- |
| Name (h1) | 26px / 600 / -0.02em |
| Card title | 17px / 600 |
| Branch title | 16px / 600 |
| Body | 14-15px / 400 |
| Meta & caption | 12-13.5px |
| **Eyebrow** | 11px / 560 / 0.09em / uppercase (`.label-eyebrow`) |

The **eyebrow** is the connective tissue of the whole UI: every section is headed
by one (`PORTFOLIO`, `HYPOTHESES`, `RESULT`, `WON · NOT SHIPPED`). Use the
`<Eyebrow>` component or the `.label-eyebrow` utility - never re-derive it.

### Space, radius, shadow

- **Spacing:** 4px base grid. Cards breathe (`px-6/8`, `py-5/7`).
- **Radius:** `card` = 14px, `node` = 12px. Nothing sharper on a container.
- **Shadow:** two levels only - `shadow-card` (resting) and `shadow-raised`
  (hover / open). Shadows are soft and low-contrast; elevation is a whisper.

### Motion

- Single easing curve everywhere: `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-premium`).
- Durations: 200-240ms for hovers/toggles, 320-400ms for expand/collapse,
  ~700ms for the one-time chart bar draw.
- All motion is height/opacity/transform only - never layout-thrashing.
- `prefers-reduced-motion` is honored globally in `globals.css`.

---

## 2. Components

Small, single-purpose, composable. Two folders:

- `components/ui/` - primitives with no domain knowledge (`Eyebrow`, `Chip`,
  `StatusPill`, `ExpandToggle`).
- `components/tree/` - domain pieces (`BranchCard`, `NodeCard`, `NodeDetail`,
  `ResultChart`, `SupportingData`).
- `components/` root - composed views (`ProfileCard`, `PortfolioExplorer`).

### One node, one detail schema

Experiments, AI builds, and products all render through **the same**
`NodeDetail`. Every section (`question`, `hypotheses`, `supportingData`,
`result`, `takeaway`) is optional and appears in a fixed order. This is why the
product looks identical across branches even though the content differs - and
why adding content never means adding a component.

### State ownership

`PortfolioExplorer` owns all accordion state (one open branch, one open node) and
passes `open` + `onToggle` down. Cards are otherwise presentational. Connector
geometry (trunk + stubs) is co-located in the explorer so alignment lives in one
place.

---

## 3. Do / Don't

- **Do** reach for a token; **don't** type a hex value in a component.
- **Do** let whitespace carry hierarchy; **don't** add borders to separate things
  that space already separates.
- **Do** use accent color for a single small mark; **don't** flood a region with it.
- **Do** keep one easing curve; **don't** introduce bouncy or springy motion.
- **Do** keep content in `lib/data.ts`; **don't** inline copy in components.
