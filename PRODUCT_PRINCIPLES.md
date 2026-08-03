# Product Principles

What this portfolio is _for_, and the rules that keep it honest. The audience is
a hiring manager or peer scanning quickly, then going deep on one thing. Every
decision below serves that reader.

---

### 1. The work is the argument

This isn't a résumé restated as a website. The organizing idea is that a Senior
PM's credibility comes from **how they think**, so the content leads with the
question, the hypotheses, the evidence, the result, and - most importantly - the
_takeaway_. The takeaway is where judgment shows. It is never optional on a
flagship node.

### 2. Progressive disclosure, always

A viewer should be able to understand the shape of the whole career in five
seconds (three branches, item counts), then choose exactly one thing to expand.
Nothing is more than two clicks deep: **branch → node → detail**. We never open
everything at once; one branch and one node at a time keeps the reader oriented
and the page calm.

### 3. Preserve the interaction model

The tree - profile on the left, branches that expand into nodes that expand into
detail - is the product. Redesigns may change how it _looks_; they may not change
how it _works_. Don't add navigation layers, don't turn nodes into separate
pages, don't invent new top-level sections.

### 4. Show the misses

A portfolio of only wins is not believable and, worse, not useful. "Near miss"
and "inconclusive" nodes are first-class citizens with the same detail depth as
wins, because the reasoning under a non-win is often the strongest signal of
seniority. Status is colored by _outcome_ and never hidden.

### 5. Quantitative by default

This PM's edge is experimentation and analytics, so numbers are foregrounded:
real CVRs, confidence intervals, durations, and lifts, set in mono type so they
read as measured facts. We never fabricate precision - if a number isn't known,
we don't invent a decimal place for it.

### 6. Calm, premium, consistent

The bar is Linear / Stripe / Apple. That means restraint: generous space, one
accent used sparingly, one motion curve, no decoration that doesn't encode
information. Consistency _is_ the aesthetic - the same eyebrow, the same card,
the same detail layout on every branch.

### 7. Content and presentation stay separate

All copy lives in `lib/data.ts`. Anyone can update a project write-up, fix a
number, or add a node without touching a component. This keeps the portfolio a
living document rather than a one-time build.

### 8. The summary answers only "What did we test?"

The `summary` (the line beneath an experiment title) is the opening sentence of
the case study - it sets context before the reader reaches the Problem section.
For **every** experiment it must:

- describe **what was tested**, in **one sentence**;
- **not** reveal the outcome;
- **not** mention metrics, lift, or statistical significance.

The result belongs later, in the Result section - never in the summary.
_Example:_ "Tested whether reducing the membership trial from one year to 30 days
would increase membership adoption without increasing refunds."

### 9. The Result section leads with the outcome

The Result section is the visual focal point of an experiment. Its hierarchy is
fixed for **every** experiment so the reader grasps success before reading a word
of prose:

1. **Goal** - what success looked like (quiet, sets the bar).
2. **Primary business outcome** - the single most important number, rendered as
   the largest element (e.g. Relative Lift `+40.17%`).
3. **Before vs After** - Control vs Variant, using the existing progress bars,
   given real emphasis (bold names, prominent values).
4. **Confidence** - the statistical read (e.g. `90%`).
5. **Supporting explanation** - the quietest element; it supports the numbers
   and never competes with them. Metadata (duration) is quieter still.

No new colors or graphics - category accent, mono numerals, and the existing
progress bars only.

### 10. Every experiment opens with the Problem

The first section of every experiment case study is **"Problem."** It establishes
_why the work was worth doing_:

- the business context;
- why the experiment mattered;
- the customer or business problem being solved.

It must **not** describe the solution and must **not** mention the experiment
design (that belongs to Hypotheses / Approach / Result). Framing the work around
the business problem - not the mechanics of testing - is what reads as product
thinking.

### 11. The Approach explains the thinking, not the tools

The Approach section explains **how** the experiment was executed and, above all,
the reasoning behind it. For every experiment it should cover:

- how the problem was investigated;
- how the experiment was designed;
- what was measured;
- why those measurements mattered.

It is **not** a list of software tools. Implementation tools (e.g. the testing
platform) are mentioned only when they help explain the process. Lead with the
thinking, not the technology.

### 12. Supporting Data is the evidence gathered _before_ the test

The Supporting Data section holds the key research, analytics, customer insights,
or historical trends that justified running the experiment. It answers one
question: **"Why did we believe this was worth testing?"** It reinforces the
hypothesis and must **never** include experiment results or post-launch learnings
(those live in Result and Takeaway). Keep it concise - each insight is a separate,
scannable bullet, not a paragraph - so it reads like evidence collected before
launch.

### 13. Every experiment ends with a Takeaway - the lesson, not the result

The Takeaway is the conclusion of the story. It answers **"So what did you
learn?"** - capturing the broader product lesson, customer insight, or strategic
principle, _not_ a restatement of the results. This is where a reader understands
how the PM thinks. It is visually elevated (soft accent-tinted panel, accent
edge, slightly larger type, more padding) so it reads as the final word - but the
emphasis comes from hierarchy, using the existing palette, never bright or flashy
decoration.

### 14. Hypotheses are concise, testable statements

Each hypothesis is a testable assumption, not a paragraph - one to two sentences,
no background or supporting explanation (that evidence lives in Supporting Data).
It should read as something you could clearly prove or disprove.

### 15. The Experiment template is locked

Every experiment case study is identical in structure, hierarchy, spacing,
typography, badges, result cards, padding, animation, and interaction - enforced
by a single set of reusable components (`NodeCard`, `NodeDetail`, `ResultChart`,
`SupportingData`, `Approach`, `Collapsible`). Content lives only in `lib/data.ts`;
new experiments inherit the template automatically.

**Locked order:**

1. Status badge (card)
2. One-sentence Summary (card)
3. - View / Hide Case Study - (toggle)
4. **Problem** _(blue heading)_
5. **Hypotheses** _(blue heading)_
   - _Show supporting data_ pill - no heading, tucked directly under H2
6. **Result** _(blue heading)_
   - _Show approach_ pill - no heading, tucked directly under the result
7. **Takeaway** _(blue heading - the final word)_

Only Problem, Hypotheses, Result, and Takeaway carry a blue section heading.
Supporting Data and Approach are header-less expandable pills - the pill labels
itself, so a redundant heading is omitted. Changing this template means changing
the shared components - never a one-off override on a single experiment.

### 16. The Product template - for ownership stories

Product case studies tell the story of building, launching, or improving a
product or platform over time. They share the exact visual language of the
Experiment template (spacing, typography, badges, cards, animation, expand /
collapse) but use a structure suited to product work. Set by `branch.template =
"product"`; rendered by `ProductCard` / `ProductDetail`.

**Locked order:**

1. Status badge (card) · 2. One-sentence Summary (card)
3. - Read case study - (teaser opens the story)
4. **Problem** · 5. **Goals** · 6. **Solution** · 7. **Results** · 8. **Takeaway**
   _(the complete story - readable in under a minute)_
9. - View Case Study - _(toggle; hidden by default)_ reveals the implementation
   deep-dive: **My Role · Approach · Challenges · Cross-functional Collaboration**

Section intent: Problem = the business/customer problem; Goals = the primary
objectives; Solution = the product decisions & improvements delivered; Results =
measurable business/technical outcomes; Takeaway = the broader product lesson.
The deep-dive shows ownership, execution, obstacles, and cross-functional
leadership. Like the experiment template, this is enforced by shared components - 
never a per-case-study override.

---

### Non-goals

- No blog, no CMS, no auth, no analytics dashboards for the visitor.
- No dark-mode toggle in v1 (the token system supports adding it later).
- No decorative illustration or stock imagery.
- No marketing hero. The tree _is_ the hero.
