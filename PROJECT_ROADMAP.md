# Project Roadmap

Status of the build and what comes next. Kept short and current.

---

## Phase 0 - Foundation ✅ (done)

- [x] Next.js (App Router) + TypeScript + Tailwind + Framer Motion + Lucide
- [x] Design tokens in `globals.css` + `tailwind.config.ts`
- [x] `DESIGN_SYSTEM.md`, `PRODUCT_PRINCIPLES.md`, `PROJECT_ROADMAP.md`
- [x] Domain model (`lib/types.ts`) and single content source (`lib/data.ts`)

## Phase 1 - Component architecture ✅ (done)

- [x] Primitives: `Eyebrow`, `Chip`, `StatusPill`, `ExpandToggle`
- [x] Domain: `BranchCard`, `NodeCard`, `NodeDetail`, `ResultChart`, `SupportingData`
- [x] Composed: `ProfileCard`, `PortfolioExplorer`
- [x] Accent system centralized in `lib/accents.ts`

## Phase 2 - Recreate the prototype ✅ (done)

- [x] Profile card (identity, skills, contact)
- [x] Tree with trunk/stub connectors and accordion behavior
- [x] Branch → node → detail progressive disclosure
- [x] Experiment detail: question, hypotheses, collapsible supporting data,
      result chart, takeaway
- [x] Verbatim Experimentation content from the reference prototype
- [x] Responsive layout (stacks below `lg`)

## Phase 2.5 - Visual refinement ✅ (done)

Pure polish pass - no structural, IA, feature, or behavior changes.

- [x] Larger type scale + stronger hierarchy (name is the focal point; project
      titles at 20px; supporting copy quieter)
- [x] More whitespace between sections, cards, labels, paragraphs, metrics
- [x] Softer borders, subtler two-level shadows, refined card padding
- [x] Refined hover states (border + shadow only, no motion/bounce)
- [x] Re-aligned tree connectors (trunk, stubs, junction dots) to new spacing
- [x] Consistent label tracking and accent usage across every surface

---

## Content status - real structure, `[TODO]` copy

All fictional/demo content has been removed. The app now holds the real
three-section structure with real project titles; every status, summary, and
case-study section is an explicit `[TODO]` placeholder to be written per project.

| Branch | Projects (titles are real; all copy is `[TODO]`) |
| --- | --- |
| Experimentation | 30-Day Membership Trial · Checkout Redesign · Free Shipping Membership Test |
| AI Builds | AI Project 01 · AI Project 02 · AI Project 03 |
| Products | Customer Data & Lifecycle Platform · Cookie Compliance Platform (Osano) · Contentful CMS Migration |

Case-study sections (six, fixed order): **Questions to answer · Hypotheses ·
Approach · Supporting data · Result · Takeaway**. A node with a section left
undefined renders `[TODO]` under that heading; populate it in `lib/data.ts` and
the rich renderer (H1/H2, collapsible data, result chart) appears automatically.

---

## Phase 3 - Polish & next (backlog)

- [ ] Replace AI Builds / Products placeholder content with real projects
- [ ] Deep-linking: reflect open branch/node in the URL (`?node=…`) for sharing
- [ ] Keyboard nav across nodes (arrow keys) + skip-to-content
- [ ] Dark mode (token system already supports it - add the variable set)
- [ ] `prefers-reduced-motion` QA pass across all transitions
- [ ] Metadata / OG image for link previews
- [ ] Lighthouse + a11y audit (target 100 / 100)

---

## Conventions

- **Content changes:** edit `lib/data.ts` only.
- **New color/spacing:** add a token first, then reference it.
- **New section type on a node:** extend `Node` in `lib/types.ts` and render it in
  `NodeDetail` - keep it optional and consistent across branches.
- Run `npm run dev` locally; `npm run build` must pass before shipping.
