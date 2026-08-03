"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node } from "@/lib/types";
import { contentfulPrototype } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Shared scroll-reveal system. A `Section` orchestrates its children with a
 * light stagger, playing once as it scrolls into view; children opt in with
 * `revealItem` (fade + small rise) or nest `listStagger` to cascade further.
 * Reduced-motion renders everything static (variants stay inert without an
 * animating parent, so no explicit per-child guard is needed).
 * ───────────────────────────────────────────────────────────────────────── */
const revealItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};
const sectionStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.03 } },
};
const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/** Consistent, visible keyboard-focus ring for interactive elements. */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-product/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

/** A case-study "chapter": staggers its children in as it enters the viewport,
 *  once. Falls back to a plain, static section when reduced-motion is set. */
function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <section className={className}>{children}</section>;
  return (
    <motion.section
      className={className}
      variants={sectionStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </motion.section>
  );
}

/** Accent-colored section kicker - a reveal item, shared visual language. */
function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: Accent;
}) {
  return (
    <motion.p
      variants={revealItem}
      className={cn("label-eyebrow", ACCENT[accent].text)}
    >
      {children}
    </motion.p>
  );
}

/** Counts a leading number up to its target once, when scrolled into view.
 *  Non-numeric values (e.g. "Reusable") render unchanged. Respects reduce. */
function CountUp({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!match) return;
    if (reduce) {
      setN(target);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const duration = 900;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `match` is derived from `value`; depending on it would restart every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, target]);

  return <span ref={ref}>{match ? `${n}${match[2]}` : value}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Architecture - a vertical product-system diagram. Clean white cards joined
 * by thin gray connectors that draw in on load, then gently pulse every few
 * seconds. Hovering / focusing a card lifts a small blue accent and reveals a
 * tooltip describing that node's purpose. Minimal, Linear/Vercel-flavored.
 * ───────────────────────────────────────────────────────────────────────── */
function Architecture({
  nodes,
}: {
  nodes: typeof contentfulPrototype.architecture;
}) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={listStagger}
      className="mt-6 flex w-full flex-col items-center"
    >
      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          variants={revealItem}
          className="flex w-full flex-col items-center"
        >
          {/* Node card */}
          <div
            className="relative"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <button
              type="button"
              aria-describedby={active === i ? `arch-tip-${i}` : undefined}
              className={cn(
                "w-[240px] max-w-full cursor-default rounded-node border bg-surface px-5 py-3.5 text-center text-[14px] font-semibold text-ink transition-[border-color,box-shadow,transform] duration-200 ease-premium",
                FOCUS_RING,
                active === i
                  ? "-translate-y-px border-accent-product/55 shadow-raised"
                  : "border-line shadow-card",
              )}
            >
              {n.label}
            </button>

            {/* Tooltip - right of the card on desktop, below it on mobile */}
            <motion.div
              id={`arch-tip-${i}`}
              role="tooltip"
              initial={false}
              animate={{ opacity: active === i ? 1 : 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={cn(
                "pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-[230px] -translate-x-1/2 rounded-node border border-line bg-surface-raised px-3.5 py-2.5 text-left text-[12.5px] leading-[1.5] text-ink-secondary shadow-raised sm:left-full sm:top-1/2 sm:mt-0 sm:ml-3 sm:w-[240px] sm:-translate-x-0 sm:-translate-y-1/2",
                active === i ? "" : "invisible",
              )}
            >
              {n.tip}
            </motion.div>
          </div>

          {/* Connector - draws in as its node reveals, then gently pulses */}
          {i < nodes.length - 1 && (
            <motion.div
              aria-hidden
              className="my-1.5 h-[26px] w-px origin-top overflow-hidden"
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
            >
              <motion.span
                className="block h-full w-full bg-line-strong"
                initial={{ opacity: 0.4 }}
                animate={
                  reduce ? { opacity: 0.6 } : { opacity: [0.35, 0.85, 0.35] }
                }
                transition={
                  reduce
                    ? { duration: 0.2 }
                    : {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5 + 0.6,
                      }
                }
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Impact - an animated 2×2 dashboard. Cards fade + rise in on load with a
 * stagger; hovering / focusing a card crossfades its face to the supporting
 * detail, with a soft elevation and a restrained blue border glow.
 * ───────────────────────────────────────────────────────────────────────── */

// Elevation + a subtle blue ring, applied on hover and keyboard-focus. Written
// as literal class strings so Tailwind's JIT scanner compiles them.
const CARD_GLOW =
  "hover:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)] focus-visible:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)]";

function ImpactCard({
  item,
}: {
  item: (typeof contentfulPrototype.impact)[number];
}) {
  return (
    <motion.div
      tabIndex={0}
      variants={revealItem}
      className={cn(
        "group relative min-h-[132px] cursor-default rounded-node border border-line bg-surface shadow-card outline-none transition-[border-color,box-shadow] duration-200 ease-premium",
        "hover:border-accent-product/40 focus-visible:border-accent-product/40",
        CARD_GLOW,
      )}
    >
      {/* Face - icon / value / label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center transition-opacity duration-200 ease-premium group-hover:opacity-0 group-focus-visible:opacity-0">
        <div className="text-[22px] leading-none">{item.icon}</div>
        <div className="mt-3 text-[17px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          <CountUp value={item.value} />
        </div>
        <div className="mt-1 text-[12.5px] leading-tight text-ink-tertiary">
          {item.label}
        </div>
      </div>

      {/* Detail - revealed on hover / focus */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center opacity-0 transition-opacity duration-200 ease-premium group-hover:opacity-100 group-focus-visible:opacity-100">
        {item.detail.length === 1 ? (
          <span className="font-mono text-[15px] font-semibold tabular-nums tracking-tight text-ink">
            {item.detail[0]}
          </span>
        ) : (
          <ul className="space-y-1.5 text-left">
            {item.detail.map((d) => (
              <li
                key={d}
                className="flex items-center gap-2 text-[12px] leading-tight text-ink-secondary"
              >
                <span className="size-1 shrink-0 rounded-full bg-accent-product/60" />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function Impact({ items }: { items: typeof contentfulPrototype.impact }) {
  return (
    <motion.div
      variants={listStagger}
      className="mt-6 grid grid-cols-2 gap-3 sm:gap-4"
    >
      {items.map((m) => (
        <ImpactCard key={m.label} item={m} />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Bulleted list with an accent-dot marker (My Role).
 * ───────────────────────────────────────────────────────────────────────── */
function BulletList({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <motion.ul variants={listStagger} className="mt-5 space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={revealItem}
          className="flex gap-3.5 text-[14.5px] leading-[1.6]"
        >
          <span
            className={cn(
              "mt-[8px] size-1.5 shrink-0 rounded-full",
              ACCENT[accent].dot,
            )}
          />
          <span className="text-ink-secondary">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
 * How It Worked - a looping animated product walkthrough (~15s). Five scenes
 * crossfade on a timer: Legacy CMS → Transition → Contentful → Publishing →
 * Impact, then loop. Minimal white stage, soft gray connectors, restrained
 * blue accent. Respects reduced-motion with a static fallback.
 * ═════════════════════════════════════════════════════════════════════════ */

const ACCENT_PULSE = "rgba(124, 58, 237, 0.55)"; // restrained accent, matches accent-product
const SCENE_TITLES = [
  "Legacy CMS",
  "Transition",
  "Contentful",
  "Publishing",
  "Impact",
] as const;
const SCENE_MS = [3000, 2600, 3200, 3000, 3600]; // ~15.4s total

/** Small labeled pill used for reusable content blocks (Scene 3). */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-secondary shadow-card">
      <span className="size-1.5 rounded-full bg-accent-product/50" />
      {children}
    </span>
  );
}

/** A primary system card (Legacy CMS / Contentful). */
function SystemCard({
  label,
  emphasis,
  dim,
}: {
  label: string;
  emphasis?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-node border bg-surface text-center shadow-card transition-opacity",
        emphasis ? "border-line-strong px-8 py-5" : "border-line px-6 py-4",
        dim && "opacity-40",
      )}
    >
      <span
        className={cn(
          "font-semibold text-ink",
          emphasis ? "text-[16px]" : "text-[14px]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Scene 1 - Legacy CMS with warning indicators floating around it ─────── */
const WARN_POS = [
  "left-1 top-3 sm:left-6",
  "right-1 top-8 sm:right-8",
  "bottom-9 left-2 sm:left-8",
  "bottom-5 right-2 sm:right-6",
];
function SceneLegacy({ warnings }: { warnings: string[] }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <SystemCard label="Legacy CMS" emphasis />
      </motion.div>
      {warnings.map((w, i) => (
        <motion.div
          key={w}
          className={cn("absolute", WARN_POS[i])}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.35 + i * 0.22 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink-tertiary shadow-card">
            <span className="size-1.5 rounded-full bg-status-near" />
            {w}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Scene 2 - content blocks travel down a pipeline into Contentful ─────── */
function SceneTransition() {
  return (
    <div className="relative flex h-full w-full items-center justify-between px-8 sm:px-12">
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.15] }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <SystemCard label="Legacy CMS" dim />
      </motion.div>

      {/* pipeline line */}
      <div className="absolute left-[24%] right-[24%] top-1/2 h-px -translate-y-1/2 bg-line-strong" />
      {/* travelling content blocks */}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute top-1/2 size-3 -translate-y-1/2 rounded-[3px] border border-line bg-surface shadow-card"
          initial={{ left: "24%", opacity: 0 }}
          animate={{ left: "74%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            delay: i * 0.4,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      >
        <SystemCard label="Contentful" emphasis />
      </motion.div>
    </div>
  );
}

/* ── Scene 3 - Contentful centered, reusable blocks organize themselves ──── */
function SceneContentful({ blocks }: { blocks: string[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <SystemCard label="Contentful" emphasis />
      </motion.div>
      <div className="flex max-w-[360px] flex-wrap justify-center gap-2">
        {blocks.map((b, i) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.35 + i * 0.14 }}
          >
            <Pill>{b}</Pill>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 4 - Contentful publishes to destinations, each lights up ──────── */
function ScenePublishing({ destinations }: { destinations: string[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <SystemCard label="Contentful" emphasis />
      </motion.div>

      {/* vertical stem + horizontal bus */}
      <motion.div
        aria-hidden
        className="h-5 w-px origin-top bg-line-strong"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.25, ease: EASE, delay: 0.35 }}
      />
      <motion.div
        aria-hidden
        className="h-px w-2/3 origin-center bg-line-strong"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.6 }}
      />

      <div className="mt-0 flex w-full max-w-[400px] justify-between">
        {destinations.map((d, i) => (
          <div key={d} className="flex flex-1 flex-col items-center">
            {/* drop line */}
            <motion.div
              aria-hidden
              className="h-4 w-px origin-top bg-line-strong"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.2, ease: EASE, delay: 0.8 + i * 0.1 }}
            />
            {/* destination - lights up briefly in sequence */}
            <motion.div
              className="mx-1 rounded-node border bg-surface px-2.5 py-2 text-center text-[11.5px] font-medium leading-tight text-ink shadow-card sm:text-[12.5px]"
              initial={{ opacity: 0, y: 8, borderColor: "var(--line)" }}
              animate={{
                opacity: 1,
                y: 0,
                borderColor: ["var(--line)", ACCENT_PULSE, "var(--line)"],
              }}
              transition={{
                opacity: { duration: 0.4, ease: EASE, delay: 0.9 + i * 0.12 },
                y: { duration: 0.4, ease: EASE, delay: 0.9 + i * 0.12 },
                borderColor: {
                  duration: 1.1,
                  ease: "easeInOut",
                  delay: 1.2 + i * 0.5,
                },
              }}
            >
              {d}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 5 - Impact metric cards ───────────────────────────────────────── */
function SceneImpact({
  metrics,
}: {
  metrics: typeof contentfulPrototype.walkthrough.metrics;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="grid w-full max-w-[380px] grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : i * 0.13 }}
            className="rounded-node border border-line bg-surface px-4 py-4 text-center shadow-card"
          >
            <div className="text-[19px] leading-none">{m.icon}</div>
            <div className="mt-2 text-[15px] font-semibold leading-tight text-ink">
              {m.value}
            </div>
            <div className="text-[12px] leading-tight text-ink-tertiary">
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Static, motion-free fallback: the five stages as a simple labeled row. */
function WalkthroughStatic({
  metrics,
}: {
  metrics: typeof contentfulPrototype.walkthrough.metrics;
}) {
  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-secondary">
        {SCENE_TITLES.map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-medium shadow-card">
              {t}
            </span>
            {i < SCENE_TITLES.length - 1 && (
              <span className="text-ink-faint" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>
      <SceneImpact metrics={metrics} />
    </div>
  );
}

function Walkthrough() {
  const { warnings, blocks, destinations, metrics } =
    contentfulPrototype.walkthrough;
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setScene((s) => (s + 1) % 5), SCENE_MS[scene]);
    return () => clearTimeout(t);
  }, [scene, reduce]);

  if (reduce) return <WalkthroughStatic metrics={metrics} />;

  const scenes = [
    <SceneLegacy key="legacy" warnings={warnings} />,
    <SceneTransition key="transition" />,
    <SceneContentful key="contentful" blocks={blocks} />,
    <ScenePublishing key="publishing" destinations={destinations} />,
    <SceneImpact key="impact" metrics={metrics} />,
  ];

  return (
    <motion.div variants={revealItem} className="mt-6">
      {/* Stage */}
      <div className="relative h-[320px] w-full overflow-hidden rounded-node border border-line bg-surface sm:h-[340px]">
        <AnimatePresence>
          <motion.div
            key={scene}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {scenes[scene]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress - scene title + clickable dots */}
      <div className="mt-4 flex items-center justify-between">
        <motion.span
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="text-[12px] font-medium tracking-[-0.01em] text-ink-tertiary"
        >
          {SCENE_TITLES[scene]}
        </motion.span>
        <div className="flex items-center gap-1.5">
          {SCENE_TITLES.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setScene(i)}
              aria-label={`Go to ${t}`}
              aria-current={scene === i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-premium",
                FOCUS_RING,
                scene === i
                  ? "w-5 bg-accent-product/55"
                  : "w-1.5 bg-line-strong hover:bg-ink-faint",
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * EXPERIMENTAL visual Product template - a trial for the Contentful CMS
 * Migration case study. Trades the long-text ProductDetail for an interactive
 * architecture diagram, metric cards, a timeline, and a Lessons callout.
 * Title + one-sentence summary live on the card header, so they're not
 * repeated here. Shared content (role, takeaway) comes from the node /
 * `contentfulPrototype`; accent stays with the Products category (violet).
 */
export function ContentfulPrototype({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const { architecture, impact, role } = contentfulPrototype;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - the lead-in before the signature visual */}
      {node.summary && (
        <Section>
          <SectionLabel accent={accent}>Overview</SectionLabel>
          <motion.p
            variants={revealItem}
            className="mt-4 text-[16px] font-medium leading-[1.55] text-ink"
          >
            {node.summary}
          </motion.p>
        </Section>
      )}

      {/* Architecture */}
      <Section>
        <SectionLabel accent={accent}>Architecture</SectionLabel>
        <Architecture nodes={architecture} />
      </Section>

      {/* Impact */}
      <Section>
        <SectionLabel accent={accent}>Impact</SectionLabel>
        <Impact items={impact} />
      </Section>

      {/* My Role */}
      <Section>
        <SectionLabel accent={accent}>My Role</SectionLabel>
        <BulletList items={role} accent={accent} />
      </Section>

      {/* How It Worked - looping animated walkthrough */}
      <Section>
        <SectionLabel accent={accent}>How It Worked</SectionLabel>
        <Walkthrough />
      </Section>

      {/* Lessons - highlighted callout (formerly Takeaway) */}
      <Section>
        <SectionLabel accent={accent}>Lessons</SectionLabel>
        {node.takeaway && (
          <motion.div
            variants={revealItem}
            className={cn(
              "mt-5 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
              ACCENT[accent].border,
              ACCENT[accent].softBg,
            )}
          >
            <p className="text-[16px] leading-[1.7] text-ink">
              {renderRichText(node.takeaway)}
            </p>
          </motion.div>
        )}
      </Section>
    </div>
  );
}
