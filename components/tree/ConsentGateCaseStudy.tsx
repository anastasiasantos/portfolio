"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node } from "@/lib/types";
import { consentGate } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Shared reveal system (mirrors the Lifecycle case study). Sections play on
 * mount - the case study lives in a portal/modal where `whileInView` can miss
 * elements already in view, leaving the hero blank. Reduced-motion is static.
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
      animate="show"
    >
      {children}
    </motion.section>
  );
}

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
 *  Values without a leading integer render unchanged. Respects reduce. */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, target]);

  return <span ref={ref}>{match ? `${n}${match[2]}` : value}</span>;
}

/* ═════════════════════════════════════════════════════════════════════════
 * The Consent Gate - the hero. A top→bottom flow: Website → Consent Banner →
 * Consent Gate, which fans to the consent-gated tag categories. A Before/After
 * switch and per-category consent toggles decide which tags pass the gate and
 * execute versus stop at it. The one idea it makes obvious: nothing
 * non-essential executes until the visitor grants consent.
 *
 * Pulses travel active paths on load and on every interaction (never
 * continuously); blocked lanes terminate at the gate and fade. Reduced-motion
 * drops the motion, keeping every state fully legible.
 * ═════════════════════════════════════════════════════════════════════════ */
function ConsentGate({ accent }: { accent: Accent }) {
  const { categories } = consentGate;
  const a = ACCENT[accent];
  const reduce = useReducedMotion();

  const [mode, setMode] = useState<"before" | "after">("before");
  const [consent, setConsent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, c.defaultConsent])),
  );
  const [pulseKey, setPulseKey] = useState(0);

  // Dots start falling the moment the case study opens (mount = modal open).
  useEffect(() => {
    if (!reduce) setPulseKey((k) => k + 1);
  }, [reduce]);

  // …and fall again each time the hero (re-)enters view - a safety net in case
  // it opened below the fold, so the reader always sees motion on arrival.
  // (useInView can miss an element already in view when the portal mounts,
  // which is why the mount trigger above is the primary one.)
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { margin: "0px 0px -15% 0px" });
  useEffect(() => {
    if (inView && !reduce) setPulseKey((k) => k + 1);
  }, [inView, reduce]);

  const enforced = mode === "after";
  const executes = (id: string) => (enforced ? !!consent[id] : true);
  const anyActive = categories.some((c) => executes(c.id));

  function changeMode(m: "before" | "after") {
    setMode(m);
    if (!reduce) setPulseKey((k) => k + 1);
  }
  function toggleConsent(id: string) {
    if (!enforced) return;
    setConsent((c) => ({ ...c, [id]: !c[id] }));
    if (!reduce) setPulseKey((k) => k + 1);
  }

  const activeCount = categories.filter((c) => executes(c.id)).length;
  const caption = !enforced
    ? "Before Osano: every third-party tag executes immediately - before the visitor has consented."
    : activeCount === 0
      ? "After Osano: nothing is consented, so every non-essential tag stops at the gate."
      : activeCount === categories.length
        ? "After Osano: every category is consented, so their tags pass the gate and execute."
        : "After Osano: consented categories pass the gate; the rest stop at it.";

  // Element factories (not `<Component/>`) so they don't remount and drop focus.

  /* - a thin vertical connector, optionally carrying a load/interaction pulse - */
  const vConn = (id: string, active: boolean, heightClass: string, delay: number) => (
    <div key={id} aria-hidden className={cn("flex justify-center", heightClass)}>
      <div
        className={cn(
          "relative h-full w-px transition-colors duration-300",
          active ? a.line : "bg-line",
        )}
      >
        {!reduce && active && (
          <motion.span
            key={`${pulseKey}-${id}`}
            className={cn("absolute size-1.5 rounded-full", a.dot)}
            style={{ left: -2.5 }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, ease: EASE, delay }}
          />
        )}
      </div>
    </div>
  );

  /* - a blocked lane: the path stops short of the card, capped, and fades - */
  const blockedStub = (id: string) => (
    <div key={id} aria-hidden className="flex h-4 justify-center">
      <div className="relative h-2/3 w-px bg-line-strong opacity-50">
        <span className="absolute -bottom-[2px] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-line-strong opacity-70" />
      </div>
    </div>
  );

  /* - a source node in the spine (Website, Consent Banner) - */
  const node = (label: string) => (
    <div className="w-[188px] max-w-[80vw] rounded-node border border-line bg-surface px-4 py-3 text-center shadow-card">
      <span className="text-[13.5px] font-semibold text-ink">{label}</span>
    </div>
  );

  /* - the gate itself: enforced (solid, locked) vs bypassed (dashed, open) - */
  const gate = () => {
    const GateIcon = enforced ? Lock : Unlock;
    return (
      <div
        className={cn(
          "flex w-[200px] max-w-[80vw] flex-col items-center justify-center gap-1.5 rounded-node border px-5 py-4 text-center transition-all duration-300 ease-premium",
          enforced
            ? cn(a.softBorder, a.softBg, "shadow-card")
            : "border-dashed border-line-strong bg-surface",
        )}
      >
        <GateIcon
          className={cn("size-[18px]", enforced ? a.text : "text-ink-faint")}
          aria-hidden
        />
        <span
          className={cn(
            "text-[13.5px] font-semibold",
            enforced ? "text-ink" : "text-ink-tertiary",
          )}
        >
          Consent Gate
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {enforced ? "Enforced" : "Bypassed"}
        </span>
      </div>
    );
  };

  /* - a consent-gated category (also the consent toggle) - */
  const card = (cat: (typeof categories)[number]) => {
    const active = executes(cat.id);
    return (
      <button
        type="button"
        disabled={!enforced}
        aria-pressed={enforced ? active : undefined}
        aria-label={`${cat.label}: ${cat.tags.join(", ")}. ${
          active ? "Executes" : "Blocked at the gate"
        }.${enforced ? " Toggle consent." : ""}`}
        onClick={() => toggleConsent(cat.id)}
        className={cn(
          "w-[168px] max-w-[42vw] rounded-node border px-4 py-3 text-left shadow-card transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          a.focus,
          active
            ? cn(a.softBorder, a.softBg, "text-ink")
            : "border-line bg-surface text-ink opacity-45",
          enforced && "hover:border-line-strong",
          !enforced && "cursor-default",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13.5px] font-semibold">{cat.label}</span>
          {enforced && (
            <span
              aria-hidden
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors duration-200",
                active ? cn(a.dot, "border-transparent") : "border-line-strong bg-surface",
              )}
            >
              {active && <Check className="size-3 text-white" strokeWidth={3} />}
            </span>
          )}
        </div>
        <div className="mt-1 text-[11.5px] leading-tight text-ink-tertiary">
          {cat.tags.join(" · ")}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full", active ? a.dot : "bg-line-strong")}
          />
          <span
            className={cn(
              "text-[11px] font-medium",
              active ? a.text : "text-ink-faint",
            )}
          >
            {active ? "Executes" : "Blocked at gate"}
          </span>
        </div>
      </button>
    );
  };

  return (
    <figure
      ref={figureRef}
      className="mt-6"
      role="group"
      aria-label="The Consent Gate: an interactive view of how consent decides which third-party tags are allowed to execute."
    >
      {/* Controls - Before / After switch + interaction hint */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div
          role="group"
          aria-label="Compare before and after Osano"
          className="inline-flex rounded-full border border-line bg-surface p-0.5"
        >
          {(["before", "after"] as const).map((m) => {
            const on = mode === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={on}
                onClick={() => changeMode(m)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                  a.focus,
                  on
                    ? cn(a.softBg, a.text)
                    : "text-ink-tertiary hover:text-ink",
                )}
              >
                {m === "before" ? "Before Osano" : "After Osano"}
              </button>
            );
          })}
        </div>
        <span
          className={cn(
            "text-[12px] text-ink-faint transition-opacity duration-200",
            enforced ? "opacity-100" : "opacity-0",
          )}
        >
          Toggle a category to grant or withdraw consent
        </span>
      </div>

      {/* The flow */}
      <motion.div
        variants={revealItem}
        className="mt-8 flex flex-col items-center"
      >
        {node("Website")}
        {vConn("w2b", true, "h-5", 0)}
        {node("Consent Banner")}
        {vConn("b2g", true, "h-5", 0.15)}
        {gate()}
        {vConn("stem", anyActive, "h-5", 0.3)}

        {/* Fan → the two consent-gated categories */}
        <div className="relative flex w-full max-w-[380px] justify-between">
          <div
            aria-hidden
            className={cn(
              "absolute left-[25%] right-[25%] top-0 h-px transition-colors duration-300",
              anyActive ? a.line : "bg-line",
            )}
          />
          {categories.map((cat, i) => (
            <div key={cat.id} className="flex flex-1 flex-col items-center">
              {executes(cat.id)
                ? vConn(`drop-${cat.id}`, true, "h-4", 0.45 + i * 0.15)
                : blockedStub(`drop-${cat.id}`)}
              {card(cat)}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shared context line - always-visible sentence of meaning */}
      <figcaption
        aria-live="polite"
        className="mt-8 flex min-h-[20px] items-start justify-center gap-2 text-center text-[13px] leading-[1.5] text-ink-secondary"
      >
        <span
          aria-hidden
          className={cn("mt-[6px] size-1.5 shrink-0 rounded-full", a.dot)}
        />
        <span className="max-w-[540px]">{caption}</span>
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Impact - 2×2 dashboard matching the other case studies. Cards fade + rise in
 * with a stagger; hovering / focusing one crossfades to a short qualitative
 * note, with a soft elevation and restrained accent glow.
 * ───────────────────────────────────────────────────────────────────────── */
const CARD_GLOW =
  "hover:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)] focus-visible:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)]";

function ImpactCard({ item }: { item: (typeof consentGate.impact)[number] }) {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center transition-opacity duration-200 ease-premium group-hover:opacity-0 group-focus-visible:opacity-0">
        <div className="text-[27px] font-semibold leading-none tracking-[-0.02em] text-ink">
          <CountUp value={item.value} />
        </div>
        <div className="mt-2.5 text-[12.5px] leading-tight text-ink-tertiary">
          {item.label}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center opacity-0 transition-opacity duration-200 ease-premium group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="text-[13px] leading-[1.55] text-ink-secondary">
          {item.detail}
        </span>
      </div>
    </motion.div>
  );
}

/* Bulleted list with an accent-dot marker (Problem, My Role). */
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

/**
 * Cookie Compliance (Osano) case study. "The Consent Gate" is the hero and does
 * the explaining, so the copy stays tight:
 *   Summary → The Consent Gate → Impact → Problem → My Role → Lessons.
 * Accent stays with the Products category (violet).
 */
export function ConsentGateCaseStudy({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const { subtitle, impact } = consentGate;
  const problem = Array.isArray(node.problem)
    ? node.problem
    : node.problem
      ? [node.problem]
      : [];

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - the lead-in */}
      <Section>
        <SectionLabel accent={accent}>Overview</SectionLabel>
        <motion.p
          variants={revealItem}
          className="mt-4 text-[16px] font-medium leading-[1.55] text-ink"
        >
          {node.summary}
        </motion.p>
      </Section>

      {/* The Consent Gate - the hero */}
      <Section>
        <SectionLabel accent={accent}>The Consent Gate</SectionLabel>
        <motion.p
          variants={revealItem}
          className="mt-2 text-[14px] leading-[1.6] text-ink-tertiary"
        >
          {subtitle}
        </motion.p>
        <ConsentGate accent={accent} />
      </Section>

      {/* Impact */}
      <Section>
        <SectionLabel accent={accent}>Impact</SectionLabel>
        <motion.div
          variants={listStagger}
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-4"
        >
          {impact.map((m) => (
            <ImpactCard key={m.label} item={m} />
          ))}
        </motion.div>
      </Section>

      {/* Problem */}
      {problem.length > 0 && (
        <Section>
          <SectionLabel accent={accent}>Problem</SectionLabel>
          <BulletList items={problem} accent={accent} />
        </Section>
      )}

      {/* My Role */}
      {node.myRole && node.myRole.length > 0 && (
        <Section>
          <SectionLabel accent={accent}>My Role</SectionLabel>
          <BulletList items={node.myRole} accent={accent} />
        </Section>
      )}

      {/* Lessons - highlighted callout */}
      {node.takeaway && (
        <Section>
          <SectionLabel accent={accent}>Lessons</SectionLabel>
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
        </Section>
      )}
    </div>
  );
}
