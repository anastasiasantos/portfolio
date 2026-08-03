import type { Branch, Node, Profile } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * CONTENT SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────────
 * This is the real portfolio structure. It contains NO fictional content.
 *
 * What is real (from the prototype): the profile (name, bio, skills, contact),
 * the three branch labels + taglines, and the project titles below.
 *
 * Everything else - every status, summary, and case-study section - is an
 * explicit `[TODO]` placeholder to be written per project in a later pass.
 * A node with no detail fields renders the full six-section case-study
 * scaffold with `[TODO]` under each heading (see components/tree/NodeDetail).
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Every project starts as a titled scaffold; detail is filled in later. */
function todoNode(id: string, title: string): Node {
  return {
    id,
    title,
    status: { label: "[TODO]", tone: "flat" },
    summary: "[TODO]",
    // problem / hypotheses / supportingData / result / approach / takeaway
    // are intentionally omitted → each renders as "[TODO]".
  };
}

export const profile: Profile = {
  kicker: "Portfolio",
  name: "Anastasia Santos Moore",
  lines: ["Product management that ships", "and measures, not just plans."],
  note: "6+ years across multiple industries, with a deep experimentation and analytics focus.",
  skills: ["A/B Testing", "Funnel Analysis", "Snowflake SQL", "Applied AI"],
  email: "santos.anastasia@gmail.com",
  linkedin: {
    label: "linkedin.com/anastasiasantos",
    href: "https://www.linkedin.com/in/anastasiasantos",
  },
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * FLAGSHIP AI BUILD - Indigo Moore AI Product Operations Platform
 * ─────────────────────────────────────────────────────────────────────────
 * A real, in-production system for a jewelry business. Rendered by the
 * dedicated IndigoMooreCaseStudy layout (diagram: "ai-ops"). Every claim below
 * is drawn from the documented project; no metrics, features, or outcomes are
 * invented. Notably: no conversion lift, revenue, or time-savings claims - 
 * those were never measured.
 */
const indigoMoore: Node = {
  id: "indigo-moore-ai-ops",
  title: "Indigo Moore AI Product Operations Platform",
  status: { label: "IN PRODUCTION", tone: "live" },
  diagram: "ai-ops",
  summary:
    "A production AI workflow that turns product photos into compliant Etsy drafts - pairing AI perception and creative generation with deterministic business rules and a human review step before anything publishes.",

  aiWorkflow: [
    {
      kind: "input",
      label: "Product Photos",
      detail: "Photos of the finished piece are uploaded to start a listing.",
    },
    {
      kind: "ai",
      label: "AI Classification",
      detail:
        "AI classifies the product and infers materials, colors, findings, and style from the images.",
    },
    {
      kind: "human",
      label: "Confidence Check",
      detail:
        "Confirmed and inferred fields pass through; uncertain fields raise blocking questions the user resolves before continuing.",
    },
    {
      kind: "tool",
      label: "SKU + Market Research",
      detail:
        "Deterministic services assign the SKU and gather market data. Market research is non-fatal - the flow continues if it fails.",
    },
    {
      kind: "ai",
      label: "AI Content Generation",
      detail:
        "AI writes the title, description, tags, and a suggested price.",
    },
    {
      kind: "tool",
      label: "Deterministic Assembly",
      detail:
        "Code assembles exact dimensions and specs, appends fixed policy and care content, and enforces Etsy's character and tag limits.",
    },
    {
      kind: "human",
      label: "Human Review",
      detail:
        "The seller reviews and edits the full listing before anything is created.",
    },
    {
      kind: "output",
      label: "Etsy Draft",
      detail:
        "The system creates an Etsy draft and uploads media - a draft, never an automatic publish.",
    },
  ],

  results: [
    { value: "~60", label: "real SKUs generated in production" },
    { label: "Production use across a real, operating jewelry business" },
    {
      label:
        "Automated SKU assignment and end-to-end listing-creation workflow",
    },
    { label: "Catalog-wide listing auditing" },
    { label: "Competitor-intelligence tooling" },
  ],

  myRole: [
    "Identified the operational problem in a real shop's listing workflow",
    "Designed the end-to-end workflow, from photo upload to Etsy draft",
    "Defined the boundary between AI and deterministic responsibilities",
    "Designed the human-review safeguards - confidence states, blocking questions, and draft-first publishing",
    "Structured the shared data contract behind the Smart and Manual entry paths",
    "Implemented and operated the system against real, ongoing shop usage",
  ],

  aiOps: {
    overview:
      "I built a production AI operations platform for my jewelry business, Indigo Moore. Its flagship capability turns product photos into ready-to-review Etsy draft listings - with AI, business rules, and human review each owning a clear part of the job.",
    overviewBullets: [
      "Flagship: product photos → review-ready Etsy draft listings",
      "Also runs catalog listing auditing and competitor intelligence",
      "Draft-first - nothing publishes until a person approves it",
      "In production for a real, operating jewelry shop",
    ],
    problem:
      "Every new listing meant repeating the same manual chain - classifying the product, assigning a SKU, writing the title and tags, setting taxonomy and policy, doing QA, and keeping the wider catalog in order. The hard part wasn't speed; it was doing all of that consistently and compliantly, listing after listing, as the catalog grew - something generic listing tools and copy-paste templates couldn't guarantee.",
    aiStrategy:
      "AI is used only where the work is open-ended: reading a product from its photos and writing the listing copy. Everything that has to be exact or compliant - SKUs, character limits, policy text, taxonomy - stays in code, and a person reviews every listing before it becomes a draft.",
    aiResponsibilities: [
      "Classify products from images",
      "Infer materials, colors, findings, and style",
      "Detect image-versus-input conflicts",
      "Generate titles, descriptions, tags, and suggested pricing",
    ],
    deterministicResponsibilities: [
      "Assign SKUs",
      "Enforce character and tag limits",
      "Assemble dimensions and product specifications",
      "Append policy and care content",
      "Resolve taxonomy and Etsy configuration",
      "Manage authentication, rate limits, and API orchestration",
      "Score listing health",
    ],
    boundaryPrinciple:
      "**Anything subjective or perceptual uses AI. Anything that must be exact, compliant, or repeatable stays in code.**",
    humanInLoop: [
      "Confidence states - every attribute is confirmed, inferred, or uncertain",
      "Clarification workflow - uncertain fields raise blocking questions before the flow continues",
      "Draft-first publishing - the system only ever creates drafts, never publishing on its own",
    ],
    humanInLoopWhy:
      "The model proposes, but nothing reaches the storefront until a person has seen and approved it - which protects brand quality and contains AI risk.",
    takeaway:
      "**AI should own the ambiguous work, not the repeatable business logic** - and a person approving before publish is a product feature, not a fallback.",
    lessons: [
      "A prompt schema is an interface contract - designing it deliberately is what makes model output dependable enough to build on.",
      "Deterministic assembly and rendering do more for trust than a bigger model would.",
      "Operational resilience matters even in a single-user tool: third-party lookups and model calls fail, and the workflow has to keep going.",
    ],
    decisions: [
      {
        decision: "Smart and Manual entry paths share one downstream system",
        tradeoff:
          "A photo-first Smart path and a Manual path feed the same assembly, review, and publishing pipeline - one data contract instead of two flows that drift apart.",
      },
      {
        decision: "Draft-first publishing",
        tradeoff:
          "Listings are always created as drafts, trading hands-off automation for a guaranteed human checkpoint before anything goes live.",
      },
      {
        decision: "Explicit uncertainty handling",
        tradeoff:
          "Low-confidence fields become blocking questions rather than silent guesses - a little friction bought for accuracy.",
      },
      {
        decision: "Fixed policy content",
        tradeoff:
          "Policy and care text is templated in code, not generated, so compliance language is never left to the model.",
      },
      {
        decision: "Max of Etsy API and local registry for SKU assignment",
        tradeoff:
          "SKUs are assigned from the higher of the Etsy API and the local registry, avoiding collisions when the two sources disagree.",
      },
      {
        decision: "Non-fatal market research and media failures",
        tradeoff:
          "If market research or a media upload fails, the listing still completes - resilience over strict all-or-nothing runs.",
      },
      {
        decision: "Separate SEO and conversion audit scoring",
        tradeoff:
          "Listing health is scored on SEO and conversion separately, so the two concerns don't average away each other's signal.",
      },
      {
        decision: "High-performer caution before editing",
        tradeoff:
          "Strong listings are flagged for extra caution before edits are suggested, so audits don't risk what's already working.",
      },
    ],
    architecture: [
      "Smart (photo-first) and Manual entry paths converge on one shared data contract, then a common assembly → review → draft pipeline.",
      "Deterministic assembly builds exact dimensions and specs, appends fixed policy and care content, and enforces Etsy's character and tag limits.",
      "SKU assignment takes the max of the Etsy API and a local registry, avoiding collisions when the two sources disagree.",
      "An API layer handles authentication, rate limits, and Etsy API orchestration.",
      "Market research and media upload are non-fatal - failures are caught so the listing still completes.",
      "Catalog-wide listing health is scored on SEO and conversion separately.",
    ],
    limitations: [
      "Single-user and single-shop",
      "No automated tests",
      "Handles one listing at a time",
      "No bulk editing",
      "Auditing is limited to active listings",
      "No measured revenue or conversion impact",
    ],
    futureOpportunities: [
      "Bulk editing and multi-listing runs (today it handles one listing at a time)",
      "Extending auditing beyond currently active listings",
      "Adding automated test coverage",
    ],
  },
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * FLAGSHIP AI BUILD - Skin Lab: AI Ingredient Intelligence
 * ─────────────────────────────────────────────────────────────────────────
 * A domain-modeling / AI-decision-support / AI-evaluation story, rendered by
 * the dedicated SkinLabCaseStudy layout (diagram: "skin-lab"). Deliberately
 * distinct from the Indigo Moore orchestration flagship. Strictly no invented
 * medical, scientific, or performance claims: the six-dimension scores are
 * framed as structured AI judgments (not lab measurements), and the product
 * never diagnoses or prescribes. Future evaluations are marked as proposed,
 * never as implemented.
 */
const skinLab: Node = {
  id: "skin-lab-ingredient-intelligence",
  title: "Skin Lab",
  status: { label: "SHIPPED", tone: "shipped" },
  diagram: "skin-lab",
  summary:
    "An offline-first skin-health app whose flagship capability is AI ingredient intelligence: it reasons over an arbitrary skincare ingredient list across six acne-related biological dimensions, then keeps analytics, thresholds, and rendering deterministic.",

  results: [
    {
      value: "6",
      label:
        "acne-related dimensions scored per ingredient, from an arbitrary INCI list",
    },
    {
      label:
        "End-to-end workflow: arbitrary INCI list → structured, localized six-dimension report",
    },
    { label: "Persisted ingredient analyses, stored locally" },
    {
      value: "12",
      label: "lesion types tracked in deterministic acne logging",
    },
    { label: "Cycle-aware analytics, with calendar and table history" },
    { label: "Open Beauty Facts product search with manual fallback" },
    { label: "Code-based cloud sync, plus CSV and ZIP portability" },
    {
      value: "~50",
      label:
        "Playwright end-to-end tests, alongside a persona-based testing framework",
    },
    { label: "Etsy distribution and marketing collateral" },
  ],

  myRole: [
    "Identified and modeled the decision problem",
    "Designed the six-dimension risk framework",
    "Defined the boundary between AI and deterministic responsibilities",
    "Designed the structured prompt contract (schema + closed verdict enum)",
    "Implemented the product experience end to end",
    "Protected model access through a Cloudflare Worker",
    "Designed the offline-first and third-party-fallback behavior",
    "Created the application-level tests and persona scenarios",
    "Defined the next AI evaluation strategy",
  ],

  skinLab: {
    capabilities: [
      "Flagship: scores any ingredient list across six acne-related dimensions",
      "Also a full skin-health tracker - daily logging, analytics, product library",
      "Works offline; only ingredient analysis needs connectivity",
      "Scores are AI judgments to guide research - not medical advice",
    ],
    aiFocusNote:
      "The AI capability is focused specifically on ingredient analysis. Everything else - tracking, analytics, history, the product library - stays fully functional offline, without AI. Skin Lab does not analyze skin photographs; image-based skin analysis is not implemented.",

    problemLead:
      "Most ingredient checkers reduce acne risk to a single comedogenic number - but breakouts can stem from several different mechanisms, so one score hides more than it reveals. A one-dimensional rating simply can't say how a product interacts with the different pathways behind acne, which is the question people actually have.",
    reframeFrom: "Is this ingredient pore-clogging?",
    reframeTo:
      "How might this product interact with different acne-related mechanisms?",
    problemNote:
      "The six dimension scores are structured AI judgments meant to support product research - not laboratory measurements, and not a diagnosis.",
    aiStrategy:
      "Scoring an open-ended list of chemical ingredients is exactly the kind of ambiguous, judgment-heavy task AI is good at - so the model reasons over the ingredients, while the app keeps everything finite and repeatable (the thresholds, colors, tracking, and storage) in ordinary code. The model never diagnoses or prescribes; its scores are framed as judgments to support research, not medical facts.",
    takeaway:
      "**Strong product modeling matters more than adding more AI** - the six-dimension framework, not the model alone, is what makes the output useful.",

    dimensions: [
      {
        key: "comedogenic",
        name: "Comedogenic",
        evaluates:
          "How an ingredient relates to the pore-clogging dimension of acne risk.",
      },
      {
        key: "sebum",
        name: "Sebum",
        evaluates:
          "How an ingredient may relate to the oil / sebum dimension of acne risk.",
      },
      {
        key: "fungal",
        name: "Fungal / Malassezia",
        evaluates:
          "An ingredient's relevance to the fungal (Malassezia) dimension of breakouts.",
      },
      {
        key: "hormonal",
        name: "Hormonal / Androgen",
        evaluates:
          "An ingredient's relevance to the hormonal / androgen-related dimension.",
      },
      {
        key: "bacterial",
        name: "Bacterial / C. acnes",
        evaluates:
          "An ingredient's relevance to the bacterial (C. acnes) dimension.",
      },
      {
        key: "inflammatory",
        name: "Inflammatory",
        evaluates:
          "How an ingredient may relate to the inflammatory / irritation dimension.",
      },
    ],
    scoringNote:
      "A per-dimension risk score, with a deliberate 0-versus-null distinction: 0 means assessed with no signal, null means not applicable or not enough basis to score.",
    flaggedNote:
      "Deterministic thresholds turn scores into risk colors and gauges, and surface higher-scoring ingredients as offenders for that dimension.",

    architecture: [
      "The user searches for a product or pastes an INCI ingredient list.",
      "Product data may be retrieved from Open Beauty Facts.",
      "The client builds a structured system and user prompt.",
      "A Cloudflare Worker protects the API key and enforces the Claude model.",
      "Claude evaluates every ingredient across all six dimensions.",
      "Claude returns JSON using a fixed schema and a closed verdict enum.",
      "The client parses the response.",
      "Deterministic code applies thresholds, colors, gauges, offender flags, and rendering.",
      "The analysis is stored locally.",
    ],
    architectureNote:
      "Product retrieval is not AI analysis. Open Beauty Facts only supplies the ingredient list and product metadata; the model reasons over the ingredients themselves, not over retrieved knowledge passed as context.",

    aiResponsibilities: [
      "Reason over arbitrary INCI lists",
      "Score ingredients across six dimensions",
      "Summarize each risk dimension",
      "Identify higher-risk ingredients",
      "Generate the overall structured verdict",
      "Localize explanatory text while preserving INCI names",
    ],
    deterministicResponsibilities: [
      "Daily logging and skin-score aggregation",
      "Cycle-aware analytics",
      "Calendar and table history",
      "Lesion education content",
      "Open Beauty Facts search and fuzzy matching",
      "Threshold logic, risk colors, and gauge rendering",
      "Local storage, plus CSV and ZIP import/export",
      "Sync behavior",
      "Model enforcement and API-key protection",
    ],
    boundaryPrinciple:
      "**Use AI for open-ended reasoning. Use ordinary code for finite, reproducible answers.**",

    qualityControls: [
      "A fixed JSON schema embedded in the prompt",
      "A closed enum for the overall verdict",
      "Explicit 0-versus-null scoring semantics",
      "JSON-only instructions in both the system and user messages",
      "Client-side code-fence stripping",
      "Defensive rendering for missing fields",
      "Fixed, server-side model selection",
      "The API key protected by the Cloudflare Worker",
      "A generous output-token allowance to reduce truncated JSON",
      "Deterministic verdict thresholds and presentation",
    ],
    qualityControlsNote:
      "These are output controls and guardrails - not a complete evaluation framework.",
    testingToday: [
      "Roughly 50 Playwright end-to-end tests across application flows",
      "Persona-based manual test scenarios",
      "Offline and error-state handling",
      "Open Beauty Facts timeout and fallback behavior",
      "Defensive rendering of incomplete responses",
    ],
    testingTodayNote:
      "These validate the product experience and integration behavior. They do not establish the scientific accuracy of the ingredient scores.",
    notYetImplemented: [
      "A labeled ingredient benchmark",
      "Dermatologist or cosmetic-chemist ground truth",
      "Automated JSON-schema validation",
      "Automatic repair or reprompting",
      "Numeric range enforcement",
      "Repeatability or variance testing",
      "Multilingual quality evaluation",
      "Citation or evidence verification",
      "Analysis-accuracy telemetry",
      "Model-comparison testing",
    ],
    evalFramework: [
      {
        title: "Structural Validity",
        measures: [
          "Valid JSON rate",
          "Schema-complete response rate",
          "Missing-field rate",
          "Out-of-range score rate",
          "Enum compliance",
          "Ingredient coverage rate",
        ],
        recommend:
          "Add JSON-schema validation, numeric clamping, and one automatic repair attempt.",
      },
      {
        title: "Domain Quality",
        measures: [
          "Commonly accepted low-risk ingredients",
          "Known irritants",
          "Fatty acids and esters",
          "Fungal-acne-relevant ingredients",
          "Actives with context-dependent effects",
          "Ambiguous or poorly documented ingredients",
        ],
        recommend:
          "Have qualified reviewers label expected risk bands and acceptable rationale - this ground truth does not exist today.",
      },
      {
        title: "Consistency",
        measures: [
          "Verdict agreement",
          "Score variance by dimension",
          "Flagged-ingredient agreement",
          "Rationale consistency",
        ],
        recommend:
          "Run the same lists repeatedly and define acceptable variance before changing models or prompts.",
      },
      {
        title: "Safety & Communication",
        measures: [
          "Avoids diagnosis and treatment prescriptions",
          "Communicates uncertainty appropriately",
          "Distinguishes model judgment from scientific measurement",
          "Preserves INCI names",
          "Avoids overly confident medical language",
        ],
        recommend:
          "Review responses against these criteria as a release gate for prompt or model changes.",
      },
      {
        title: "Localization",
        measures: [
          "Meaning preservation",
          "Medical-risk tone",
          "Untranslated or corrupted chemistry terms",
          "JSON integrity",
          "Correct preservation of INCI names",
        ],
        recommend:
          "Evaluate every supported language against these before treating it as verified.",
      },
    ],
    evalLadder: [
      { label: "Prompt Contract", status: "current" },
      { label: "Structural Validation", status: "next" },
      { label: "Domain Benchmark", status: "next" },
      { label: "Consistency Testing", status: "next" },
      { label: "Safety Review", status: "next" },
      { label: "Production Monitoring", status: "next" },
    ],

    decisions: [
      {
        decision: "Six biological dimensions instead of one comedogenic score",
        tradeoff:
          "Model acne as several mechanisms, not a single number. More to reason about and render, but it matches how breakouts actually differ.",
      },
      {
        decision:
          "AI for arbitrary ingredient reasoning, deterministic content for finite lesion knowledge",
        tradeoff:
          "Unbounded INCI lists go to the model; the fixed lesion-education library stays in code. Reasoning where inputs are open, determinism where the knowledge is finite.",
      },
      {
        decision: "Offline-first, single-file distribution",
        tradeoff:
          "The app ships and runs offline as a single file - simple to distribute and resilient, at the cost of single-file maintainability.",
      },
      {
        decision: "No account required",
        tradeoff:
          "No sign-up or identity: lower friction and less data to hold, but sync has to work without authentication.",
      },
      {
        decision: "Code-based sync",
        tradeoff:
          "Devices sync via a shareable code rather than accounts - easy and private-feeling, but the codes are unauthenticated.",
      },
      {
        decision: "Open Beauty Facts with manual fallback",
        tradeoff:
          "Product lookups use Open Beauty Facts, with manual INCI paste when it misses or times out - convenience without a hard third-party dependency.",
      },
      {
        decision: "Locale-aware output with untranslated INCI names",
        tradeoff:
          "Explanations localize, but INCI names are preserved verbatim - readable across languages without corrupting chemical identifiers.",
      },
      {
        decision: "Server-enforced model and hidden API key",
        tradeoff:
          "A Cloudflare Worker pins the model and hides the key - control and protection, at the cost of a required backend hop for analysis.",
      },
      {
        decision: "No diagnosis or prescription",
        tradeoff:
          "The product supports research decisions; it never diagnoses or prescribes - a deliberate scope boundary for a health-adjacent tool.",
      },
    ],

    productExperience: [
      "Onboarding",
      "Daily skin logging",
      "Lesion and location tracking",
      "Lifestyle and cycle inputs",
      "Skin-profile analytics",
      "Log history",
      "Product library",
      "Ingredient search",
      "Sync and export",
    ],
    productExperienceNote:
      "The product stays useful offline; only ingredient analysis requires connectivity.",

    lessons: [
      "Domain modeling matters more than adding AI broadly.",
      "AI should be reserved for tasks with genuinely unbounded inputs.",
      "A prompt schema is an interface contract, not a complete evaluation system.",
      "Deterministic rendering makes model output more predictable.",
      "Health-adjacent AI needs explicit scope boundaries.",
      "Graceful fallback is essential when third-party data and model APIs can fail.",
      "Evaluation must cover structure, domain quality, consistency, safety, and localization.",
    ],
    limitations: [
      "No AI benchmark or expert-labeled evaluation set",
      "No schema-validation or automatic repair loop",
      "No citations in generated analyses",
      "No accuracy or reliability telemetry",
      "Non-English output remains unverified",
      "Scores are AI judgments, not laboratory measurements",
      "Unauthenticated sync codes",
      "No rate limiting or abuse controls",
      "No progress-photo tracking",
      "Single-file maintainability constraints",
    ],
  },
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * AI BUILD - AI Onboarding Chatbot
 * ─────────────────────────────────────────────────────────────────────────
 * An intent-recognition / routing story, rendered by the dedicated
 * OnboardingChatbotCaseStudy layout (diagram: "onboarding-chatbot"). The AI is
 * an intelligent routing layer between the customer and the product - it reads
 * intent and picks a destination; the application does the routing. Strictly
 * no invented metrics, product decisions, architecture, or roadmap: the only
 * quantified outcome is the supported "≥15% reduction in support ticket
 * volume"; everything else is qualitative and drawn from the brief.
 */
const onboardingChatbot: Node = {
  id: "ai-onboarding-chatbot",
  title: "AI Onboarding Chatbot",
  status: { label: "SHIPPED", tone: "shipped" },
  diagram: "onboarding-chatbot",
  summary:
    "Using AI intent recognition to guide customers to the right next step while reducing unnecessary support requests.",

  results: [
    { value: "15%+", label: "reduction in support ticket volume" },
    { label: "Customers reached the right destination faster" },
    { label: "Support could focus on higher-complexity requests" },
    { label: "Fewer unnecessary handoffs across onboarding" },
  ],

  myRole: [
    "Served as Product Manager for the initiative",
    "Defined the customer intents and the destination each one should route to",
    "Set the boundaries for what the AI should and shouldn't handle - keeping legal and account-specific questions escalated to support",
    "Shaped the evaluation scenarios used to verify routing and safe escalation",
  ],

  onboardingChatbot: {
    overview:
      "An enhancement to an existing website chatbot that had been routing nearly every conversation straight to Support. We added an AI intent-recognition layer in front of that routing to read what a customer was actually trying to do and send them to the right place - signup, the product recommendation quiz, or Support - resolving simple onboarding questions inside the product and cutting unnecessary support tickets.",
    overviewBullets: [
      "Customers frequently arrived with onboarding questions - where to sign up, which product fits, where to start",
      "The existing chatbot forwarded nearly every conversation to Support",
      "AI was introduced to understand intent and direct each customer to the right destination",
      "The goal was a faster customer experience and fewer unnecessary support tickets",
    ],
    problem:
      "Customers arriving during onboarding asked the same handful of questions - “Where do I sign up?”, “Which product is right for me?”, “Where do I start?” - almost none of which needed a human. But the existing chatbot forwarded nearly every conversation to Support, so the team spent much of its time on low-complexity requests that could have been resolved inside the product itself.",
    aiStrategy:
      "The AI wasn't there to answer questions or replace support reps - it was there to work out what the customer was trying to do and send them to the right place. It recognizes the customer's intent, classifies the request, and selects the destination; the application handles the routing from there. Anything outside its remit - legal questions, account-specific problems - is escalated to a human rather than guessed at.",
    aiResponsibilities: [
      "Understand what the customer is asking",
      "Classify the request by intent",
      "Select the correct destination",
    ],
    appResponsibilities: [
      "Route the customer to the chosen destination",
      "Hand off to a human when the request isn't supported",
    ],
    boundaryPrinciple:
      "**The AI decides where a customer should go next - it doesn't answer for support, and it doesn't practice law.**",
    routes: [
      {
        key: "signup",
        name: "Signup",
        blurb:
          "Customers ready to get started are sent straight to the signup flow.",
        examples: ["Where do I create an account?", "Where do I sign up?"],
      },
      {
        key: "quiz",
        name: "Product Quiz",
        blurb:
          "Customers unsure which product fits are routed to the product recommendation quiz.",
        examples: ["Which product is right for me?", "Where do I start?"],
      },
      {
        key: "support",
        name: "Support",
        blurb:
          "Account-specific or complex requests are escalated to a human support rep.",
        examples: ["I can't access my account."],
      },
    ],
    takeaway:
      "**AI doesn't only create value by replacing people.** Sometimes its biggest contribution is understanding intent - and helping each customer reach the right destination more efficiently.",
    testing: [
      "Evaluation scenarios were built from a wide variety of real customer questions",
      "Verified correct routing behavior across intents",
      "Checked appropriate handling of unsupported questions",
      "Confirmed the AI avoided the unauthorized practice of law",
      "Confirmed safe escalation to a human when appropriate",
    ],
    limitations: [
      "By design the assistant routes rather than answers - it determines the right destination and doesn't resolve questions itself",
      "Legal and account-specific questions are intentionally out of scope and are escalated to a human",
    ],
  },
};

export const branches: Branch[] = [
  {
    id: "experimentation",
    label: "Experimentation",
    blurb: "A/B testing & funnel analysis",
    accent: "exp",
    nodes: [
      {
        id: "30-day-membership-trial",
        title: "30-Day Membership Trial",
        status: { label: "Won", tone: "win" },
        // Experiment summaries answer only "What did we test?" - one sentence,
        // no outcome, metrics, lift, or significance. Those live in Result.
        summary:
          "Tested whether reducing the membership trial from one year to 30 days would increase membership adoption without increasing refunds.",
        problem:
          "Membership trials lasted one year, but customer behavior suggested that most members experienced the product's value much sooner. The opportunity was to determine whether a shorter trial would increase membership adoption without negatively impacting customer satisfaction or refunds.",
        hypotheses: [
          {
            id: "H1",
            text: "Reducing the trial to 30 days will decrease membership refunds by making customers less likely to forget they enrolled before their estate plan needs updating.",
          },
          {
            id: "H2",
            text: "Reducing the trial to 30 days will increase membership adoption because it better aligns with when most customers experience the product's value.",
          },
        ],
        supportingData: [
          "Historical product data showed that most customers made updates to their estate plan within approximately 45 days of purchase.",
          "The majority of members never used the full one-year trial, suggesting the existing offer provided more time than most customers needed to realize value.",
          "Shortening the trial presented an opportunity to increase membership adoption while maintaining the core customer experience.",
        ],
        approach: [
          "Analyzed historical membership usage patterns to understand when customers experienced the value of their membership.",
          "Identified that most customers updated their estate plan within approximately 45 days of purchase.",
          "Designed and launched an A/B experiment in AB Tasty comparing the existing one-year trial against a new 30-day trial.",
          "Measured membership opt-in rate while monitoring refund requests and downstream customer behavior to ensure the shorter trial did not negatively impact the customer experience.",
        ],
        result: {
          goal: "Increase opt-in CVR by 10%",
          headline: { value: "+40.17%", label: "Relative Lift" },
          bars: [
            // Control shown as 7.82% to stay consistent with the 40.17% lift
            // stated in the summary. See flag in chat re: prototype's 7.53%.
            { name: "Control", detail: "1 Year", value: 7.82, display: "7.82%" },
            {
              name: "Variant",
              detail: "30 Days",
              value: 10.96,
              display: "10.96%",
              isPrimary: true,
            },
          ],
          confidence: "90%",
          meta: "19-day test",
          summary:
            "The test variant CVR was 40.17% higher than the control variant CVR. We can be 90% confident that the test variant will perform better than the control.",
        },
        takeaway:
          "Customer value isn't determined by the length of a trial - it's determined by how quickly customers experience meaningful value. By aligning the membership offer with actual customer behavior, we increased adoption while preserving the customer experience.",
      },
      {
        id: "checkout-redesign",
        title: "Checkout Redesign",
        status: { label: "[TODO]", tone: "flat" },
        // Summary answers only "What did we test?" - no outcome/metrics/significance.
        summary:
          "Tested whether simplifying the checkout experience would reduce friction and increase purchase conversion, particularly on mobile devices.",
        problem:
          "The existing checkout experience had become cluttered and increasingly difficult to navigate, particularly on mobile devices. Multiple pages, excessive content, and competing UI elements created unnecessary friction during one of the most critical moments in the customer journey. The opportunity was to determine whether a simpler, more streamlined checkout experience could reduce drop-off and improve purchase conversion.",
        hypotheses: [
          {
            id: "H1",
            text: "Simplifying the checkout experience will reduce friction and increase purchase conversion, especially on mobile devices.",
          },
          {
            id: "H2",
            text: "Reducing visual complexity and prioritizing the most commonly used actions will help more customers successfully complete checkout.",
          },
        ],
        approach: [
          "Audited the existing checkout experience to identify unnecessary friction, particularly across the mobile purchase flow.",
          "Redesigned the checkout journey by combining the cart and payment pages, reducing on-page content with collapsible sections, and prioritizing the most commonly used payment methods.",
          "Launched an A/B experiment comparing the redesigned checkout against the existing experience.",
          "Measured registration-to-purchase conversion, visitor-to-purchase conversion, and overall funnel performance across desktop and mobile devices.",
        ],
        supportingData: [
          "Funnel analysis identified the checkout experience as a major source of friction, with the greatest opportunity for improvement on mobile devices.",
          "Baseline Registration → Purchase CVR was 14.76% overall (8.11% mobile, 21.12% web), establishing a clear benchmark for measuring success.",
          "Success was defined as a 10% improvement in both Registration → Purchase and Visitor → Purchase conversion rates without introducing additional friction elsewhere in the funnel.",
        ],
        result: {
          goal: "Increase Registration → Purchase conversion by 10%",
          headline: { value: "+11.3%", label: "Relative Lift" },
          bars: [
            {
              name: "Control",
              detail: "Original Checkout",
              value: 13.26,
              display: "13.26%",
            },
            {
              name: "Variant",
              detail: "Redesigned Checkout",
              value: 14.76,
              display: "14.76%",
              isPrimary: true,
            },
          ],
          confidence: "90%",
          summary:
            "The redesigned checkout experience increased Registration → Purchase conversion from 13.26% to 14.76%, representing an 11.3% relative lift. The simplified experience reduced friction during checkout while exceeding the experiment's target conversion goal.",
        },
        takeaway:
          "Simplifying an experience often creates more value than adding new functionality. By reducing friction at a critical point in the customer journey, we improved conversion without changing the core product or introducing new features.",
      },
      {
        id: "free-shipping-membership-test",
        title: "Free Shipping Membership Test",
        status: { label: "[TODO]", tone: "flat" },
        // Summary answers only "What did we test?" - no outcome/metrics/significance.
        summary:
          "Tested whether adding free shipping on printed estate plan documents as a membership benefit would increase membership adoption and overall customer value.",
        problem:
          "Membership adoption was a key business objective, but existing benefits weren't compelling enough for many customers to opt in during checkout. We wanted to determine whether adding free shipping on printed estate plan documents as a membership benefit would increase the perceived value of the membership and drive more opt-ins without negatively impacting overall purchase conversion.",
        hypotheses: [
          {
            id: "H1",
            text: "Adding free shipping on printed estate plan documents as a membership benefit will increase membership opt-in rate by increasing the perceived value of the membership.",
          },
          {
            id: "H2",
            text: "Increasing membership opt-ins through a stronger value proposition will not negatively impact overall purchase conversion or customer revenue.",
          },
        ],
        approach: [
          "Identified free shipping on printed estate plan documents as a potential membership benefit that could strengthen the perceived value of the subscription.",
          "Updated the membership value proposition presented during checkout to include free shipping while keeping the rest of the purchase experience unchanged.",
          "Launched an A/B experiment comparing the updated membership messaging against the existing experience.",
          "Measured membership opt-in rate, overall purchase conversion, revenue, and Average Revenue Per Member (ARPM) to evaluate both conversion impact and long-term business value.",
        ],
        supportingData: [
          "Membership opt-in rate was 10.64%, creating a clear opportunity to improve adoption through a stronger value proposition.",
          "Free shipping on printed estate plan documents represented a tangible, easy-to-understand benefit that could increase the perceived value of membership without requiring product development.",
          "Success was defined as a 15% increase in membership opt-in rate while maintaining overall purchase conversion.",
        ],
        result: {
          goal: "Increase Membership Opt-in Rate by 15% while maintaining overall purchase conversion.",
          headline: { value: "+27.96%", label: "Relative Lift" },
          metrics: [
            {
              label: "Membership Subscription Funnel",
              caption: "Registration → Subscribe to Membership → Purchase",
              bars: [
                { name: "Control", value: 8.19, display: "8.19%" },
                {
                  name: "Variant",
                  value: 10.48,
                  display: "10.48%",
                  isPrimary: true,
                },
              ],
              verdict: "Statistically Significant",
              verdictTone: "win",
            },
          ],
          impact: [
            {
              label: "Average Revenue Per Member increased from $349 to $368",
            },
          ],
          summary:
            "The updated membership value proposition significantly increased membership subscriptions while maintaining comparable purchase conversion. Average Revenue Per Member increased from $349 to $368, demonstrating stronger long-term customer value.",
        },

        takeaway:
          "A membership's perceived value can be raised by a benefit that costs less than customers assume it's worth. Free shipping is concrete and easy to understand, so it moved subscription intent more than its actual cost - and because it strengthened the offer rather than discounting the purchase, it grew recurring revenue without trading away conversion.",
      },
    ],
  },
  {
    id: "ai-builds",
    label: "AI Builds",
    blurb: "Personal AI projects, built end-to-end",
    accent: "ai",
    template: "ai",
    nodes: [
      indigoMoore,
      skinLab,
      onboardingChatbot,
    ],
  },
  {
    id: "products",
    label: "Products",
    blurb: "Product ownership & platform initiatives",
    accent: "product",
    template: "product",
    nodes: [
      {
        id: "customer-data-lifecycle-platform",
        title: "Customer Data & Lifecycle Platform",
        status: { label: "[TODO]", tone: "flat" },
        diagram: "lifecycle", // renders the interactive Iterable platform map
        // Product summary - what was delivered, one sentence, no results / no
        // implementation details (those come later in the case study).
        summary:
          "Led the migration from Klaviyo to Iterable, rebuilding the company's lifecycle marketing infrastructure into a scalable, reliable foundation for customer communications.",
        problem:
          "As Trust & Will's lifecycle marketing program continued to grow, our existing CRM and event infrastructure became difficult to scale. Legacy integrations, inconsistent event tracking, and fragmented customer data limited personalization, reduced data reliability, and slowed the marketing team's ability to launch and optimize lifecycle campaigns. We needed a scalable foundation that could support future growth while maintaining data integrity throughout the migration.",
        goals: [
          "Migrate from Klaviyo to Iterable with no disruption to customer communications.",
          "Establish a scalable lifecycle marketing platform capable of supporting future growth.",
          "Improve customer data quality and event reliability across the marketing ecosystem.",
          "Enable faster campaign creation, testing, and optimization through a more flexible lifecycle infrastructure.",
        ],
        // The data flow (actions → events → Iterable → experiences) is now
        // carried by the interactive diagram above; Solution keeps only the
        // non-visual work - governance and operational standards.
        solution: [
          "Established event taxonomy, QA frameworks, and data governance standards to keep customer data accurate and trustworthy.",
          "Standardized lifecycle documentation, system architecture, and operational processes to speed future campaign launches and scale the platform.",
        ],
        results: [
          {
            label:
              "Successfully migrated the company's lifecycle marketing platform from Klaviyo to Iterable, creating a scalable foundation for future lifecycle initiatives.",
          },
          {
            label:
              "Established standardized event taxonomy, QA frameworks, and governance processes that improved data reliability and reduced ongoing operational overhead.",
          },
          {
            label:
              "Enabled Marketing to launch personalized lifecycle campaigns, segmentation strategies, and automated customer journeys on a modern lifecycle platform.",
          },
          {
            label:
              "Created reusable documentation, playbooks, and system standards that improved cross-functional collaboration and supported long-term platform scalability.",
          },
        ],
        takeaway:
          "Great customer experiences depend on great internal systems. Scalable infrastructure, reliable data, and clear governance give teams the foundation to move faster, personalize with confidence, and keep building for years to come.",
        myRole: [
          "Led product ownership for the CRM migration from Klaviyo to Iterable.",
          "Partnered with Engineering, Marketing, Lifecycle, and Data teams to define requirements, prioritize work, and coordinate delivery.",
          "Defined event tracking requirements, customer segmentation strategy, and lifecycle architecture.",
          "Established QA processes, documentation standards, and governance for long-term platform reliability.",
        ],
        approach: [
          "Audited the existing CRM ecosystem to identify data gaps, workflow dependencies, and migration risks.",
          "Defined product requirements, event taxonomy, customer segmentation strategy, and lifecycle architecture for the new platform.",
          "Collaborated with Engineering and Data teams to prioritize implementation, validate tracking, and establish QA processes.",
          "Partnered with Marketing throughout rollout to ensure campaigns, automations, and customer journeys transitioned successfully before decommissioning the legacy platform.",
        ],
        challenges: [
          "Migrating a business-critical lifecycle platform without disrupting active customer communications.",
          "Aligning Marketing, Engineering, and Data teams around a shared event taxonomy and lifecycle strategy.",
          "Rebuilding customer segmentation and automation logic while maintaining data quality throughout the transition.",
          "Balancing immediate migration needs with the long-term goal of creating a scalable, maintainable lifecycle platform.",
        ],
        crossFunctional: [
          "Partnered with Engineering to define implementation priorities, validate event tracking, and coordinate the migration roadmap.",
          "Worked closely with Marketing and Lifecycle teams to redesign customer journeys, segmentation strategies, and campaign requirements.",
          "Collaborated with Data partners to establish consistent event definitions, improve data quality, and validate reporting accuracy.",
          "Facilitated cross-functional alignment throughout the migration to minimize customer impact while ensuring the new platform met long-term business needs.",
        ],
      },
      {
        id: "cookie-compliance-platform-osano",
        title: "Cookie Compliance Platform (Osano)",
        status: { label: "[TODO]", tone: "flat" },
        diagram: "consent-gate", // renders the interactive "Consent Gate" hero
        // Product summary - what was built, why it mattered, the capability
        // unlocked. No implementation details, metrics, or lessons learned.
        summary:
          "Our cookie banner let non-essential tags fire before users opted in - a growing legal and trust risk as privacy laws tightened. I led the rollout of Osano, a consent management platform that enforces consent before tracking, gives users transparent control, and standardizes privacy governance across our web properties.",
        problem: [
          "Marketing and analytics tags loaded before users granted consent, putting us out of step with GDPR and CCPA/CPRA.",
          "The legacy banner offered a single \"accept\" - no granular choices, little transparency, and no reliable record of consent.",
          "Cookie handling varied across web properties, with no central owner and no governance process.",
          "As enforcement intensified, the gap became a material legal, financial, and brand-trust risk.",
        ],
        goals: [
          "Guarantee that no non-essential tag fires before a user consents.",
          "Give users clear, granular control over each cookie category.",
          "Centralize consent management and governance across every web property.",
          "Build an auditable foundation that keeps pace with evolving privacy law.",
        ],
        solution: [
          "Implemented Osano as the central consent platform, gating all non-essential tags behind explicit user consent.",
          "Inventoried and categorized every cookie and tag - essential, analytics, marketing - each mapped to a consent category with plain-language descriptions.",
          "Standardized one consent experience and configuration across all properties, retiring the fragmented one-off banners.",
          "Established recurring cookie scans, consent record-keeping, and a governance process so compliance holds as tags and laws change.",
        ],
        results: [
          {
            value: "100%",
            label:
              "of non-essential tags now gated behind explicit consent, closing the pre-consent tracking gap.",
          },
          {
            label:
              "Aligned cookie handling with GDPR and CCPA/CPRA, with an auditable consent record for every visitor.",
          },
          {
            label:
              "Unified consent management and governance across all web properties under a single platform.",
          },
          {
            label:
              "Gave users a transparent, granular choice - analytics and marketing cookies controlled independently.",
          },
        ],
        takeaway:
          "Compliance is a product surface, not a checkbox. Treating privacy as an ongoing system - clear choices, enforced by default, backed by governance - protects the business while building the user trust that great products depend on.",
        myRole: [
          "Owned the cookie-compliance initiative end to end - from vendor evaluation through rollout and governance.",
          "Led the evaluation and selection of Osano against competing platforms.",
          "Partnered with Legal, Engineering, and Marketing to define consent requirements and cookie categorization.",
          "Stood up the ongoing governance model for cookie scans, consent records, and new-tag review.",
        ],
        approach: [
          "Audited every cookie and third-party tag across our properties to see exactly what fired, when, and why.",
          "Worked with Legal to translate GDPR and CCPA/CPRA obligations into concrete product requirements.",
          "Evaluated consent platforms on compliance coverage, tag-blocking reliability, and ease of governance - and chose Osano.",
          "Rolled out enforcement carefully, validating that essential functionality and marketing attribution held up before going live.",
          "Made \"categorized and gated by default\" the standard for any new tag, so the site stays compliant over time.",
        ],
        challenges: [
          "Enforcing consent without breaking the analytics, attribution, and marketing measurement the business relied on.",
          "Reconciling overlapping privacy frameworks (GDPR, CCPA/CPRA) into a single, coherent consent experience.",
          "Inventorying and correctly categorizing a large, constantly changing set of third-party tags.",
          "Aligning Legal, Marketing, and Engineering - each with a different definition of \"done\" - on one standard.",
        ],
        crossFunctional: [
          "Partnered with Legal to interpret privacy regulation and confirm the consent experience met it.",
          "Worked with Engineering to integrate Osano, gate tags, and verify enforcement across properties.",
          "Collaborated with Marketing and Analytics to preserve measurement while moving tags behind consent.",
          "Aligned stakeholders on a shared governance model so compliance is maintained well beyond launch.",
        ],
      },
      {
        id: "contentful-cms-migration",
        title: "Contentful CMS Migration",
        status: { label: "[TODO]", tone: "flat" },
        variant: "prototype", // experimental visual detail - see contentfulPrototype
        // Product summary - what was built, why it mattered, the capability
        // unlocked. No implementation details, metrics, or lessons learned.
        summary:
          "Led the migration of the marketing site to Contentful - a faster, component-based content platform that let Marketing move independently.",
        problem: [
          "Marketing relied heavily on Engineering for routine website updates, slowing campaign launches and content changes.",
          "The existing CMS made it difficult to maintain consistent page structures, reusable components, and scalable content management.",
          "Site performance, SEO, and accessibility required improvement to support acquisition and long-term growth.",
          "The platform needed a more flexible foundation to support future experimentation, landing pages, and new product experiences.",
        ],
        goals: [
          "Improve website performance, SEO, and accessibility across the marketing site.",
          "Enable Marketing to create and update landing pages with minimal Engineering support.",
          "Establish a scalable, component-based content system that supports future growth and experimentation.",
          "Create a modern foundation for new digital experiences while reducing long-term maintenance overhead.",
        ],
        solution: [
          "Migrated the marketing website to a headless CMS using Contentful, creating a modern and scalable content platform.",
          "Introduced reusable page components and standardized content models to improve consistency and simplify content management.",
          "Optimized the site's architecture to improve performance, SEO, and accessibility while supporting future experimentation.",
          "Empowered Marketing to manage and publish content independently, reducing reliance on Engineering for routine website updates.",
        ],
        results: [
          {
            label:
              "Reduced marketing site latency by 41%, significantly improving page performance and user experience.",
          },
          {
            label:
              "Improved SEO, accessibility, and overall site quality by establishing a modern, component-based content platform.",
          },
          {
            label:
              "Enabled Marketing to launch and manage landing pages more independently, reducing reliance on Engineering for routine content updates.",
          },
          {
            label:
              "Created a scalable foundation for ongoing experimentation, future digital experiences, and long-term website growth.",
          },
        ],
        takeaway:
          "Scalable products require scalable content systems. The right platform architecture doesn't just improve performance - it lets teams move faster, experiment with confidence, and deliver better experiences without added complexity.",
        myRole: [
          "Led product ownership for the migration to a headless CMS using Contentful.",
          "Defined product requirements, prioritized roadmap initiatives, and aligned stakeholders on the migration strategy.",
          "Partnered with Engineering, Design, Marketing, and SEO teams to deliver a scalable content platform.",
          "Drove decisions around content modeling, reusable components, and authoring workflows to improve long-term maintainability.",
        ],
        approach: [
          "Audited the existing marketing site to identify performance bottlenecks, content management pain points, and platform limitations.",
          "Partnered with Marketing, Design, Engineering, and SEO stakeholders to define requirements, prioritize improvements, and align on the migration strategy.",
          "Designed a scalable content model and reusable component system that balanced author flexibility with long-term maintainability.",
          "Validated performance improvements, accessibility, and content workflows throughout development to ensure the new platform met business and technical goals before launch.",
        ],
        challenges: [
          "Migrating a high-traffic marketing website without disrupting existing customer acquisition efforts.",
          "Balancing Marketing's need for content flexibility with Engineering's need for a scalable, maintainable platform.",
          "Standardizing content models and reusable components across a large and evolving website.",
          "Aligning multiple stakeholders while improving performance, SEO, accessibility, and authoring workflows within a single initiative.",
        ],
        crossFunctional: [
          "Partnered with Engineering to prioritize the migration roadmap, define reusable components, and ensure the platform remained scalable and maintainable.",
          "Worked closely with Marketing to redesign content workflows and enable greater ownership of website updates after launch.",
          "Collaborated with Design to create a flexible component library that balanced brand consistency with content author flexibility.",
          "Coordinated with SEO and Analytics stakeholders to ensure the new platform improved performance, discoverability, accessibility, and measurement.",
        ],
      },
    ],
  },
];

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Customer Data & Lifecycle Platform - interactive system architecture
 * ─────────────────────────────────────────────────────────────────────────
 * Powers the `diagram: "lifecycle"` case study (components/tree/
 * LifecycleCaseStudy). A single architecture spine - 
 *   Customer → Website / Product → Product Events → Customer Profile →
 *   Iterable → { Email · SMS · In-App }
 * - where hovering a node lights its connected path and the lifecycle filters
 * (Registration / Purchase / Membership / Retention) animate a journey through
 * the system and light the channels it reaches. `impact` feeds the metric cards.
 */
export const lifecycleDiagram = {
  // The architecture spine, top → bottom. Every node is interactive; hovering
  // one lights its connected path. `hub` marks Iterable, the orchestration core.
  spine: [
    {
      id: "customer",
      label: "Customer",
      tip: "A person moving through the Trust & Will lifecycle.",
    },
    {
      id: "product",
      label: "Website / Product",
      tip: "Where the customer registers, builds a plan, and pays.",
    },
    {
      id: "events",
      label: "Product Events",
      tip: "Behavior captured as a standardized, governed event taxonomy.",
    },
    {
      id: "profile",
      label: "Customer Profile",
      tip: "A unified, deduplicated view of each customer and their history.",
    },
    {
      id: "iterable",
      label: "Iterable",
      hub: true,
      tip: "Segmentation and journey logic orchestrate every communication.",
    },
  ],
  // Iterable fans out to the customer communication channels.
  channels: [
    { id: "email", label: "Email", tip: "Lifecycle and transactional email." },
    { id: "sms", label: "SMS", tip: "Time-sensitive text messages." },
    { id: "inapp", label: "In-App", tip: "In-product messages and nudges." },
  ],
  // Lifecycle moments. Selecting one animates that journey through the spine and
  // lights the channels it reaches.
  filters: [
    {
      id: "registration",
      label: "Registration",
      channels: ["email"],
      caption:
        "A completed registration updates the profile and triggers Iterable's onboarding email.",
    },
    {
      id: "purchase",
      label: "Purchase",
      channels: ["email", "sms"],
      caption:
        "A purchase updates the profile and sends confirmations by email and SMS.",
    },
    {
      id: "membership",
      label: "Membership",
      channels: ["email", "inapp"],
      caption:
        "Membership changes drive lifecycle email and in-app messaging.",
    },
    {
      id: "retention",
      label: "Retention",
      channels: ["email", "inapp"],
      caption:
        "Ongoing activity feeds segmentation for retention and re-engagement.",
    },
  ],
  // The journey animated once on load, then settled into an interactive state.
  sampleJourney: "registration",
  // Impact dashboard - four cards beneath the architecture. `detail` is a short
  // qualitative note revealed on hover/focus (context, not an invented metric).
  // Ordered strongest-first: scale and the operational improvement lead, the
  // foundational counts follow. Labels state the outcome (standardized, unified,
  // live), not the activity (rebuilt, cleaned, QA'd).
  impact: [
    {
      value: "1M+",
      label: "Customer Profiles Unified",
      detail: "Deduplicated and validated during the migration to Iterable.",
    },
    {
      value: "35%",
      label: "Fewer Data Errors",
      detail: "Fewer malformed events once governance was in place.",
    },
    {
      value: "200+",
      label: "Lifecycle Events Standardized",
      detail: "A standardized taxonomy spanning the full customer lifecycle.",
    },
    {
      value: "40",
      label: "Automated Journeys Live",
      detail: "Verified end-to-end before decommissioning the legacy platform.",
    },
  ],
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Cookie Compliance (Osano) - "The Consent Gate" interactive hero
 * ─────────────────────────────────────────────────────────────────────────
 * Powers the `diagram: "consent-gate"` case study (components/tree/
 * ConsentGateCaseStudy). A left→right flow - Website → Consent Banner →
 * Consent Gate → { category lanes } - where a Before/After switch and per-
 * category consent toggles decide which third-party tags pass the gate and
 * execute versus stop at it. `impact` feeds the metric cards.
 *
 * `categories` are the non-essential, consent-gated tag groups (essential tools
 * always run and aren't shown). Each carries a couple of example third-party
 * tags and its default consent state.
 */
export const consentGate = {
  subtitle:
    "How consent decides which technologies are allowed to run across the customer experience.",
  categories: [
    {
      id: "analytics",
      label: "Analytics",
      tags: ["Heatmaps", "Pixels"],
      defaultConsent: true,
      tip: "Behavioral analytics - runs only once the visitor opts in.",
    },
    {
      id: "marketing",
      label: "Marketing",
      tags: ["Ads", "Tracking"],
      defaultConsent: false,
      tip: "Advertising and retargeting - blocked at the gate without consent.",
    },
  ],
  // Impact dashboard - four cards beneath the hero. `detail` is a short
  // qualitative note revealed on hover/focus (context, not an invented metric).
  // Title Case labels to match the other product case studies; the compliance
  // outcome (100% gated) leads.
  impact: [
    {
      value: "100%",
      label: "Non-Essential Tags Gated",
      detail: "Nothing non-essential fires before the visitor opts in.",
    },
    {
      value: "2",
      label: "Privacy Frameworks Aligned",
      detail: "GDPR and CCPA/CPRA, with an auditable consent record per visitor.",
    },
    {
      value: "1",
      label: "Unified Consent Platform",
      detail: "Replaced fragmented, one-off cookie banners across every property.",
    },
    {
      value: "Granular",
      label: "Per-Category User Control",
      detail: "Analytics and marketing controlled independently.",
    },
  ],
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * EXPERIMENTAL: Contentful CMS Migration - visual prototype content
 * ─────────────────────────────────────────────────────────────────────────
 * Powers the `variant: "prototype"` detail (components/tree/ContentfulPrototype).
 * A trial of a more visual Product template - architecture diagram, metric
 * cards, and a timeline in place of long text. Shared bits (summary, takeaway)
 * still come from the node above; only the visual-only content lives here.
 */
export const contentfulPrototype = {
  architecture: [
    { label: "Marketing", tip: "Creates and manages website content." },
    {
      label: "Contentful",
      tip: "Headless CMS powering reusable content, landing pages, and publishing workflows.",
    },
    {
      label: "Marketing Website",
      tip: "Renders structured content into a fast, SEO-friendly customer experience.",
    },
    {
      label: "Analytics",
      tip: "Captures behavior and performance data for optimization and experimentation.",
    },
  ],
  // Impact dashboard cards. `detail` is revealed on hover/focus: a single
  // entry renders as one emphasized figure, multiple as a short bulleted list.
  // The measurable win (41% latency) leads; the operational outcome (Marketing
  // self-service) follows, then reach and the reusable foundation. Bold value
  // lines read as clean outcome words, not fragments ("SEO &").
  impact: [
    {
      icon: "⚡",
      value: "41%",
      label: "Lower Latency",
      detail: ["420ms → 247ms"],
    },
    {
      icon: "🚀",
      value: "Marketing",
      label: "Self-Service",
      detail: [
        "Publish without Engineering",
        "Faster campaign launches",
        "Scalable content management",
      ],
    },
    {
      icon: "📈",
      value: "Improved",
      label: "SEO & Accessibility",
      detail: [
        "Improved page speed",
        "Better accessibility",
        "Stronger search visibility",
      ],
    },
    {
      icon: "🧩",
      value: "Reusable",
      label: "Content System",
      detail: [
        "Shared content models",
        "Reusable page blocks",
        "Faster publishing",
      ],
    },
  ],
  role: [
    "Led product ownership of the Contentful migration.",
    "Defined requirements, roadmap, and migration strategy.",
    "Aligned Engineering, Design, Marketing, and SEO.",
    "Drove content-modeling and reusable-component decisions.",
  ],
  // "How It Worked" - content for the looping animated walkthrough
  // (components/tree/ContentfulPrototype → Walkthrough). Each key feeds one
  // scene; metrics mirror the Impact cards so the animation stands alone.
  walkthrough: {
    warnings: [
      "Developer Required",
      "Inconsistent Components",
      "Slow Publishing",
      "Performance Issues",
    ],
    blocks: ["Hero", "CTA", "FAQ", "Quote", "Feature Grid"],
    destinations: ["Marketing Website", "Landing Pages", "Analytics"],
    metrics: [
      { icon: "⚡", value: "41%", label: "Lower Latency" },
      { icon: "🚀", value: "Marketing", label: "Self-Service" },
      { icon: "📈", value: "Improved", label: "SEO & Accessibility" },
      { icon: "🧩", value: "Reusable", label: "Content System" },
    ],
  },
};
