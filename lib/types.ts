/**
 * Domain model for the portfolio tree.
 *
 * The tree has three fixed levels:
 *   Profile ─▶ Branch (category) ─▶ Node (work item) ─▶ Detail
 *
 * Every node - experiment, AI build, or product - shares ONE detail schema so
 * a single renderer covers all of them. The six case-study sections always
 * render in a fixed order; a field left undefined shows a "[TODO]" placeholder
 * until it is written (see DESIGN_SYSTEM.md → "One node, one detail schema").
 */

export type BranchId = "experimentation" | "ai-builds" | "products";

export type Accent = "exp" | "ai" | "product";

/** Outcome tone drives the status pill color. */
export type StatusTone = "win" | "near" | "flat" | "shipped" | "live";

export interface Status {
  /** e.g. "WON · NOT SHIPPED", "NEAR MISS", "INCONCLUSIVE", "SHIPPED". */
  label: string;
  tone: StatusTone;
}

export interface Hypothesis {
  /** Short id shown in the gutter, e.g. "H1". */
  id: string;
  text: string;
}

export interface ResultBar {
  /** Variant name, e.g. "Control" / "Variant". */
  name: string;
  /** Optional sub-label, e.g. "1 Year" / "30 Days". */
  detail?: string;
  /** Numeric value used to size the bar (same unit across a result block). */
  value: number;
  /** Formatted value shown for the bar, e.g. "7.82%". */
  display: string;
  /** The highlighted / winning variant. */
  isPrimary?: boolean;
}

/**
 * A single measured metric within a rich Result - an optional Control/Variant
 * comparison plus its verdict (e.g. "Statistically Significant" / "Inconclusive").
 */
export interface ResultMetric {
  /** e.g. "Membership Subscription Funnel". */
  label: string;
  /** Optional funnel/step clarifier under the label, e.g. the stages measured. */
  caption?: string;
  /** Optional before/after comparison bars. */
  bars?: ResultBar[];
  /** e.g. "Statistically Significant". */
  verdict: string;
  /** Colors the verdict pill (win = green, flat = neutral, …). */
  verdictTone: StatusTone;
}

/** An additional business-impact callout, e.g. ARPM before → after. */
export interface ResultImpact {
  /** e.g. "Higher Average Revenue Per Member (ARPM)". */
  label: string;
  /** Before value, e.g. "$349". */
  from?: string;
  /** After value, e.g. "$368". */
  to?: string;
  /** Unit shown after the change, e.g. "ARPM". */
  unit?: string;
}

/**
 * The Result section. Two shapes, one card language:
 *  • Simple - a single primary metric: `headline` (largest) + `bars` + `confidence`.
 *  • Rich - multiple business outcomes: `outcome` verdict + `metrics[]` (each with
 *    its own verdict) + optional `impact[]`.
 * Both render Goal first and the supporting paragraph last, in the same styling.
 * See PRODUCT_PRINCIPLES.md → "The Result section leads with the outcome".
 */
export interface ResultBlock {
  /** What success looked like, e.g. "Increase opt-in CVR by 10%". */
  goal: string;

  // ── Primary outcome hero (provide one) ──────────────────────────────────
  /** Numeric primary outcome - the largest element (simple results). */
  headline?: {
    /** e.g. "+40.17%". */
    value: string;
    /** e.g. "Relative Lift". */
    label: string;
  };
  /** Verdict badge for multi-outcome results, e.g. "🎉 Winner". */
  outcome?: string;

  // ── Simple mode ─────────────────────────────────────────────────────────
  /** Before vs after comparison. */
  bars?: ResultBar[];
  /** Statistical confidence, e.g. "90%". */
  confidence?: string;
  /** Quiet metadata, e.g. "19-day test". */
  meta?: string;

  // ── Rich mode ───────────────────────────────────────────────────────────
  /** Several measured metrics, each with its own verdict. */
  metrics?: ResultMetric[];
  /** Additional business-impact callouts. */
  impact?: ResultImpact[];

  /** Supporting explanation - quietest element; supports the numbers. */
  summary: string;
}

/**
 * A measurable outcome in a Product "Results" section - an optional headline
 * value plus its description.
 */
export interface ProductOutcome {
  /** Optional headline metric, e.g. "-40%", "3×", "$1.2M". */
  value?: string;
  /** What the outcome was, e.g. "faster onboarding". */
  label: string;
}

/** What a workflow stage represents. Drives its marker + eyebrow; an "ai" stage
 *  carries the accent so "where AI adds value" reads at a glance. Default "tool". */
export type WorkflowStageKind =
  | "input"
  | "ai"
  | "tool"
  | "decision"
  | "human"
  | "output";

/**
 * One stage in an AI build's workflow pipeline - the unit the signature
 * AI-workflow visual is built from (see components/tree/AIWorkflow). Content is
 * supplied per build; a build with no stages renders a "[TODO]" placeholder.
 */
export interface WorkflowStage {
  /** Short stage name shown in the node, e.g. "Retrieve", "Generate". */
  label: string;
  /** What happens at this stage - revealed on hover/focus. Optional. */
  detail?: string;
  /** Categorizes the stage. "ai" stages are accented. Default "tool". */
  kind?: WorkflowStageKind;
}

/** One key product decision and the tradeoff it accepts - a card in the
 *  Indigo Moore flagship's "Key Product Decisions" section. */
export interface AIDecision {
  /** The decision, stated as a short claim, e.g. "Draft-first publishing". */
  decision: string;
  /** The tradeoff or reasoning behind it - one or two sentences. */
  tradeoff: string;
}

/**
 * Content for the Indigo Moore AI product-operations flagship case study
 * (diagram: "ai-ops", rendered by IndigoMooreCaseStudy).
 *
 * The page is tuned for ~90-second comprehension: seven lean VISIBLE sections
 * carry the story, and three EXPANDABLE sections (Product Decisions, Technical
 * Architecture, Limitations & Future Opportunities) hold the proof-of-rigor.
 * Reuses `summary` (card blurb), `aiWorkflow` (System Workflow visual),
 * `results` (Operational Impact), and `myRole` (folded into the Technical
 * Architecture accordion) from the shared Node schema.
 */
export interface AIOps {
  // ── VISIBLE (the ~60-90s story) ────────────────────────────────────────────
  /** Overview: the larger/bolder executive summary (2-3 lines). */
  overview: string;
  /** Overview: 3-5 concise supporting bullets. */
  overviewBullets: string[];
  /** The Problem: one concise paragraph (what / why it mattered / why hard). */
  problem: string;
  /** AI Strategy: a PM-lens intro - why AI, what it owns, what code owns. */
  aiStrategy: string;
  /** AI Strategy visual: perceptual / creative work owned by AI. */
  aiResponsibilities: string[];
  /** AI Strategy visual: exact / compliant / repeatable work owned by code. */
  deterministicResponsibilities: string[];
  /** AI Strategy: the boundary principle, shown as a callout. */
  boundaryPrinciple: string;
  /** AI Strategy: the human-review safeguards (confidence / clarify / draft). */
  humanInLoop: string[];
  /** AI Strategy: one line on why those safeguards reduce AI risk. */
  humanInLoopWhy: string;
  /** Takeaway: one short product lesson (supports **bold**). */
  takeaway: string;

  // ── TECHNICAL DETAILS (one expandable; proves the rigor) ────────────────────
  /** Product decisions: decision + tradeoff cards. */
  decisions: AIDecision[];
  /** How the system is built (bullets). */
  architecture: string[];
  /** Deeper product/engineering lessons beyond the headline takeaway. */
  lessons: string[];
  /** Honest scope boundaries. */
  limitations: string[];
  /** Natural next steps. */
  futureOpportunities: string[];
}

/** One routing destination in the AI Onboarding Chatbot's signature diagram -
 *  a place the AI can send a customer, plus the example questions that land
 *  there (revealed on hover/focus). */
export interface OnboardingRoute {
  /** Short key for markers/keys, e.g. "signup". */
  key: string;
  /** Display name, e.g. "Signup", "Product Quiz", "Support". */
  name: string;
  /** One line on what this destination is / who lands here. */
  blurb: string;
  /** Example customer questions that route here. */
  examples: string[];
}

/**
 * Content for the AI Onboarding Chatbot case study (diagram:
 * "onboarding-chatbot", rendered by OnboardingChatbotCaseStudy). An intent-
 * recognition / routing story: AI reads customer intent and picks a
 * destination, the application does the routing. Reuses `summary` (Overview
 * lead), `results` (Outcome), and `myRole` (Technical Details → Role) from
 * Node. No invented metrics, decisions, or implementation details.
 */
export interface OnboardingChatbot {
  // ── VISIBLE (the ~60-90s story) ────────────────────────────────────────────
  /** Overview: the larger/bolder executive summary (2-3 lines). */
  overview: string;
  /** Overview: 3-5 concise supporting bullets. */
  overviewBullets: string[];
  /** The Problem: one concise paragraph. */
  problem: string;
  /** AI Strategy: a PM-lens intro - why AI, what it owns, what the app owns. */
  aiStrategy: string;
  /** AI Strategy visual: the work owned by AI (understand / classify / select). */
  aiResponsibilities: string[];
  /** AI Strategy visual: the work owned by the application (routing / handoff). */
  appResponsibilities: string[];
  /** AI Strategy: the scope boundary, shown as a callout (supports **bold**). */
  boundaryPrinciple: string;
  /** Signature visual: the routing destinations + their example questions. */
  routes: OnboardingRoute[];
  /** Takeaway: one short product lesson (supports **bold**). */
  takeaway: string;

  // ── TECHNICAL DETAILS (one expandable) ──────────────────────────────────────
  /** Testing: the evaluation scenarios used to verify routing + safe escalation. */
  testing: string[];
  /** Honest scope boundaries (design constraints only; no invented gaps). */
  limitations: string[];
}

/** One acne-related dimension in Skin Lab's six-dimension risk model. */
export interface SkinLabDimension {
  /** Short key used for markers/keys, e.g. "comedogenic". */
  key: string;
  /** Display name, e.g. "Comedogenic", "Fungal / Malassezia". */
  name: string;
  /** What the dimension evaluates - high-level and non-diagnostic. */
  evaluates: string;
}

/** One layer of Skin Lab's *recommended* (not-yet-built) AI-evaluation
 *  framework - presented as the next iteration, not completed work. */
export interface SkinLabEvalLayer {
  /** e.g. "Structural Validity". */
  title: string;
  /** What this layer would measure. */
  measures: string[];
  /** The recommended improvement / action for this layer. */
  recommend: string;
}

/** A rung on the evaluation ladder, tagged by whether it exists today. */
export interface SkinLabEvalRung {
  label: string;
  /** "current" = implemented today; "next" = proposed, not yet built. */
  status: "current" | "next";
}

/**
 * Content for the Skin Lab AI-ingredient-intelligence flagship case study
 * (diagram: "skin-lab", rendered by SkinLabCaseStudy). A domain-modeling /
 * AI-evaluation story - deliberately distinct from the Indigo Moore
 * orchestration flagship. Reuses `summary` (Overview lead), `results` (Built
 * Outcomes), and `myRole` (My Role) from Node; everything else lives here.
 */
export interface SkinLab {
  // Overview
  /** Overview: 3-5 concise supporting bullets under the executive summary. */
  capabilities: string[];
  /** Clarifies the AI is ingredient-only; the rest works offline; no photos. */
  aiFocusNote: string;
  // The Problem
  /** The Problem: one concise paragraph (weakness of one-number tools). */
  problemLead: string;
  /** The question Skin Lab reframes *from* (kept as a from→to visual). */
  reframeFrom: string;
  /** The question it reframes *to*. */
  reframeTo: string;
  /** Note: scores are structured AI judgments, not lab measurements. */
  problemNote: string;
  // AI Strategy
  /** AI Strategy: a PM-lens intro - why AI, what it owns, what code owns. */
  aiStrategy: string;
  /** Takeaway: one short product lesson (supports **bold**). */
  takeaway: string;
  // Six-Dimension Risk Model (signature visual)
  /** The six acne-related dimensions. */
  dimensions: SkinLabDimension[];
  /** Shared scoring semantics (0-vs-null), shown in the dimension reveal. */
  scoringNote: string;
  /** How flagged ingredients are surfaced (deterministic), in the reveal. */
  flaggedNote: string;
  // AI Reasoning Architecture
  /** The real, ordered AI flow (product lookup → prompt → Worker → parse). */
  architecture: string[];
  /** Clarifies product retrieval is not AI analysis / not RAG. */
  architectureNote: string;
  // AI vs. Deterministic
  aiResponsibilities: string[];
  deterministicResponsibilities: string[];
  boundaryPrinciple: string;
  // AI Quality & Evaluation
  /** A - output controls / guardrails implemented today. */
  qualityControls: string[];
  qualityControlsNote: string;
  /** B - product & integration testing implemented today. */
  testingToday: string[];
  testingTodayNote: string;
  /** C - AI evaluations NOT yet implemented (honest gaps). */
  notYetImplemented: string[];
  /** D - the recommended (future) evaluation framework, five layers. */
  evalFramework: SkinLabEvalLayer[];
  /** Optional evaluation ladder tagged Current / Next. */
  evalLadder: SkinLabEvalRung[];
  // Key Product Decisions
  decisions: AIDecision[];
  // Product Experience
  productExperience: string[];
  productExperienceNote: string;
  // Lessons
  lessons: string[];
  // Current Limitations
  limitations: string[];
}

export interface Node {
  id: string;
  status: Status;
  title: string;
  /** One-two sentence readout shown on the collapsed card and detail header. */
  summary: string;
  /** Opt a single node into an experimental detail layout (e.g. the visual
   *  Contentful prototype) instead of the standard template. */
  variant?: "prototype";
  /** Opt a node into a dedicated, visual-first case-study layout keyed by its
   *  signature experience: "lifecycle" → the Iterable system architecture
   *  (LifecycleCaseStudy); "consent-gate" → the Osano Consent Gate
   *  (ConsentGateCaseStudy); "ai-ops" → the Indigo Moore AI product-operations
   *  flagship (IndigoMooreCaseStudy); "skin-lab" → the Skin Lab AI-ingredient
   *  intelligence flagship (SkinLabCaseStudy); "onboarding-chatbot" → the AI
   *  Onboarding Chatbot routing story (OnboardingChatbotCaseStudy). Only the
   *  matching node renders it. */
  diagram?:
    | "lifecycle"
    | "consent-gate"
    | "ai-ops"
    | "skin-lab"
    | "onboarding-chatbot";

  // ── Detail sections (LOCKED experiment template) ────────────────────────
  // Headed sections (blue kicker): Problem, Hypotheses, Result, Takeaway.
  // Supporting data and Approach have NO heading - their self-labeling pill
  // toggle carries it. Supporting data is tucked directly under Hypotheses;
  // Approach directly under Result; Takeaway is always the final word.
  // A field left undefined renders a placeholder; populating it swaps in the
  // rich renderer (H1/H2, chart, collapsible list, etc.).
  /** Heading: "Problem" - business context and why the work mattered. Always
   *  the first section; never describes the solution or the experiment design.
   *  A string renders as prose; a string[] renders as bullets (Product cards). */
  problem?: string | string[];
  /** Heading: "Hypotheses" - concise, testable statements (1-2 sentences). */
  hypotheses?: Hypothesis[];
  /** Heading: "Supporting data" - collapsible pre-test evidence list. */
  supportingData?: string[];
  /** Heading: "Result". */
  result?: ResultBlock;
  /** Heading: "Approach" - the reasoning steps for how the work was carried
   *  out. Rendered directly under Result as a collapsible ordered list
   *  (optional deep-dive). Leads with thinking, not a list of tools. */
  approach?: string[];
  /** Heading: "Takeaway" - the lesson learned; always last. Supports **bold**. */
  takeaway?: string;

  // ── PRODUCT case-study sections (branch template = "product") ────────────
  // Story (shown when the card is opened): Problem, Goals, Solution, Results,
  // Takeaway. Behind the "View Case Study" toggle: My Role, Approach,
  // Challenges, Cross-functional Collaboration. Undefined → "[TODO]".
  /** Heading: "Goals" - the primary objectives of the initiative. */
  goals?: string[];
  /** Heading: "Solution" - product decisions & major improvements delivered. */
  solution?: string[];
  /** Heading: "Results" - measurable business or technical outcomes. */
  results?: ProductOutcome[];
  /** Deep-dive: "My Role" - ownership & leadership on the initiative (bullets). */
  myRole?: string[];
  /** Deep-dive: "Challenges" - obstacles navigated. */
  challenges?: string[];
  /** Deep-dive: "Cross-functional Collaboration" - how Product partnered with
   *  other teams (bullets). */
  crossFunctional?: string[];
  // (Deep-dive "Approach" reuses the `approach` field above.)

  // ── AI BUILD case-study sections (branch template = "ai") ────────────────
  // A single builder-narrative flow (no deep-dive collapsible), in order:
  // Summary → Problem → Why I Built It → Solution → Architecture → AI Workflow
  // → Results → Lessons. Reuses `summary`, `problem`, `solution`, `results`,
  // and `takeaway` (Lessons); the three fields below are AI-build-specific.
  // Undefined → "[TODO]".
  /** Heading: "Why I Built It" - the builder's motivation for making this;
   *  personal and product-led, not a spec. Prose. */
  whyIBuilt?: string;
  /** Heading: "Architecture" - how the thing is put together (bullets). A
   *  natural home for a signature system diagram (see AIBuildDetail TODO). */
  architecture?: string[];
  /** Heading: "AI Workflow" - the ordered stages of how AI does the work,
   *  concept → working software. Drives the signature AI-workflow pipeline
   *  visual (components/tree/AIWorkflow); undefined → "[TODO]". */
  aiWorkflow?: WorkflowStage[];

  // ── AI-OPS FLAGSHIP (diagram = "ai-ops", IndigoMooreCaseStudy) ────────────
  /** Flagship-specific case-study content (see AIOps). Present only on the
   *  Indigo Moore node; drives its dedicated layout alongside the reused
   *  summary / aiWorkflow / results / myRole / takeaway fields. */
  aiOps?: AIOps;
  /** Flagship-specific case-study content (see SkinLab). Present only on the
   *  Skin Lab node; drives its dedicated layout alongside the reused
   *  summary / results / myRole fields. */
  skinLab?: SkinLab;
  /** Case-study content (see OnboardingChatbot). Present only on the AI
   *  Onboarding Chatbot node; drives its dedicated layout alongside the reused
   *  summary / results / myRole fields. */
  onboardingChatbot?: OnboardingChatbot;
}

export interface Branch {
  id: BranchId;
  label: string;
  blurb: string;
  accent: Accent;
  /** Which case-study template the branch's nodes use. Default "experiment". */
  template?: "experiment" | "product" | "ai";
  nodes: Node[];
}

export interface Profile {
  kicker: string;
  name: string;
  lines: string[];
  note: string;
  skills: string[];
  email: string;
  linkedin: { label: string; href: string };
}
