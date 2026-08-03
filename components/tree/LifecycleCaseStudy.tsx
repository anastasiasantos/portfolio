"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node } from "@/lib/types";
import { lifecycleDiagram } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Shared reveal system. A `Section` staggers its children in; children opt in
 * with `revealItem`, or nest `listStagger` to cascade further. The case study
 * opens inside a portal/modal where every section mounts at once, so the reveal
 * plays on mount (deterministic) rather than on scroll-into-view - the latter's
 * IntersectionObserver can miss elements already in view when the modal opens,
 * leaving the hero blank. Reduced-motion renders everything static.
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
    // `match` is derived from `value`; depending on it would restart every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, target]);

  return <span ref={ref}>{match ? `${n}${match[2]}` : value}</span>;
}

/* ═════════════════════════════════════════════════════════════════════════
 * System Architecture - the hero. A single top→bottom spine
 *   Customer → Website/Product → Product Events → Customer Profile → Iterable
 * where Iterable fans out to Email · SMS · In-App. Every node is interactive:
 * hovering (or focusing) one lights its connected path; the lifecycle filters
 * animate a journey through the system and light the channels it reaches. One
 * sample journey plays once on load, then settles into an interactive state.
 * Reduced-motion drops the pulses and load animation, keeping it fully usable.
 * ═════════════════════════════════════════════════════════════════════════ */

type LitSet = Set<string> | null;

// Every spine node + connector id, lit together whenever the whole spine flows.
const SPINE_IDS = ["customer", "product", "events", "profile", "iterable"];
const SPINE_CONN_IDS = ["sc-0", "sc-1", "sc-2", "sc-3"];
const FULL_SPINE = [...SPINE_IDS, ...SPINE_CONN_IDS];

function SystemArchitecture({ accent }: { accent: Accent }) {
  const { spine, channels, filters, sampleJourney } = lifecycleDiagram;
  const a = ACCENT[accent];
  const reduce = useReducedMotion();

  const [filter, setFilter] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [walking, setWalking] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const tipMap = useMemo(() => {
    const m: Record<string, string> = {};
    [...spine, ...channels].forEach((n) => (m[n.id] = n.tip));
    return m;
  }, [spine, channels]);
  const filterMap = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, f])),
    [filters],
  );
  const channelIds = useMemo(() => channels.map((c) => c.id), [channels]);

  // The sample journey plays once on mount (i.e. when the case study opens).
  useEffect(() => {
    if (reduce) return;
    setWalking(true);
    setPulseKey((k) => k + 1);
    const t = window.setTimeout(() => setWalking(false), 2400);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // A chosen filter wins; otherwise the load journey; otherwise a hovered node.
  const activeFilterId = filter ?? (walking ? sampleJourney : null);

  const lit: LitSet = useMemo(() => {
    if (activeFilterId) {
      const f = filterMap[activeFilterId];
      const s = new Set<string>([...FULL_SPINE, "fan-stem", "fan-bus"]);
      f.channels.forEach((c: string) => {
        s.add(c);
        s.add(`dl-${c}`);
      });
      return s;
    }
    if (hoverId) {
      // A channel lights only Iterable → that channel.
      if (channelIds.includes(hoverId)) {
        return new Set(["iterable", "fan-stem", "fan-bus", hoverId, `dl-${hoverId}`]);
      }
      // The two endpoints (Customer, Iterable) light the complete lifecycle;
      // an interior spine node lights the spine flow only.
      if (hoverId === "customer" || hoverId === "iterable") {
        const s = new Set<string>([...FULL_SPINE, "fan-stem", "fan-bus"]);
        channelIds.forEach((c) => {
          s.add(c);
          s.add(`dl-${c}`);
        });
        return s;
      }
      return new Set(FULL_SPINE);
    }
    return null;
  }, [activeFilterId, hoverId, filterMap, channelIds]);

  // Traveling pulses play on load + on filter selection - never on hover, so
  // tracing a path by hand stays calm.
  const pulsing = !reduce && (walking || !!filter);

  const on = (id: string) => !lit || lit.has(id);
  const hiOf = (id: string) => lit != null && lit.has(id);
  const dimOf = (id: string) => lit != null && !lit.has(id);

  function chooseFilter(id: string) {
    setFilter((prev) => (prev === id ? null : id));
    setHoverId(null);
    setPulseKey((k) => k + 1);
  }
  function reset() {
    setFilter(null);
    setHoverId(null);
  }

  const contextText = filter
    ? filterMap[filter].caption
    : hoverId
      ? tipMap[hoverId]
      : walking
        ? filterMap[sampleJourney].caption
        : "Hover a node to trace its path, or choose a lifecycle moment.";

  // Rendered as element factories (not `<Component/>`) so they aren't a fresh
  // component type each render - that would remount and drop focus/hover.

  /* - a traveling pulse dot down a vertical connector - */
  const pulse = (id: string, delay: number) => (
    <motion.span
      key={`${pulseKey}-${id}`}
      aria-hidden
      className={cn("absolute size-1.5 rounded-full", a.dot)}
      style={{ left: -2.5 }}
      initial={{ top: "0%", opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    />
  );

  /* - a thin vertical connector, optionally carrying a pulse - */
  const vConnector = (
    id: string,
    heightClass: string,
    delay: number,
  ) => {
    const accent = hiOf(id);
    return (
      <div
        key={id}
        aria-hidden
        className={cn("flex justify-center", heightClass)}
      >
        <div
          className={cn(
            "relative h-full w-px transition-colors duration-200",
            accent ? a.line : "bg-line",
            dimOf(id) && "opacity-40",
          )}
        >
          {pulsing && accent && pulse(id, delay)}
        </div>
      </div>
    );
  };

  /* - a hoverable tooltip anchored to a node - */
  const tooltip = (id: string, tip: string, side: boolean) => (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[220px] -translate-x-1/2 rounded-node border border-line bg-surface-raised px-3.5 py-2.5 text-left text-[12px] leading-[1.5] text-ink-secondary shadow-raised transition-opacity duration-200 ease-premium",
        side &&
          "sm:left-full sm:top-1/2 sm:mt-0 sm:ml-3 sm:-translate-x-0 sm:-translate-y-1/2",
        hoverId === id ? "opacity-100" : "invisible opacity-0",
      )}
    >
      {tip}
    </div>
  );

  /* - a spine node - */
  const renderNode = (node: (typeof spine)[number]) => {
    const hub = "hub" in node && node.hub;
    const hi = hiOf(node.id);
    return (
      <div
        key={node.id}
        className="relative"
        onMouseEnter={() => setHoverId(node.id)}
        onMouseLeave={() => setHoverId(null)}
        onFocus={() => setHoverId(node.id)}
        onBlur={() => setHoverId(null)}
      >
        <button
          type="button"
          aria-label={`${node.label}. ${node.tip}${hi ? " On the active path." : ""}`}
          className={cn(
            "w-[248px] max-w-[80vw] rounded-node border px-5 py-3.5 text-center text-[14px] font-semibold transition-[border-color,box-shadow,transform,opacity] duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            a.focus,
            hi
              ? cn("-translate-y-px text-ink shadow-raised", a.softBorder, a.softBg)
              : hub
                ? cn("text-ink shadow-card", a.softBorder, a.softBg)
                : "border-line bg-surface text-ink shadow-card hover:border-line-strong",
            dimOf(node.id) && "opacity-40",
          )}
        >
          {hub ? (
            <span className="flex items-center justify-center gap-2">
              <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
              {node.label}
            </span>
          ) : (
            node.label
          )}
        </button>
        {tooltip(node.id, node.tip, true)}
      </div>
    );
  };

  /* - a communication channel (leaf of the Iterable fan) - */
  const renderChannel = (c: (typeof channels)[number]) => {
    const hi = hiOf(c.id);
    return (
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setHoverId(c.id)}
        onMouseLeave={() => setHoverId(null)}
        onFocus={() => setHoverId(c.id)}
        onBlur={() => setHoverId(null)}
      >
        <button
          type="button"
          aria-label={`${c.label}. ${c.tip}${hi ? " On the active path." : ""}`}
          className={cn(
            "w-[104px] max-w-[26vw] rounded-node border px-3 py-2.5 text-center text-[12.5px] font-semibold transition-[border-color,box-shadow,transform,opacity] duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            a.focus,
            hi
              ? cn("-translate-y-px text-ink shadow-raised", a.softBorder, a.softBg)
              : "border-line bg-surface text-ink shadow-card hover:border-line-strong",
            dimOf(c.id) && "opacity-40",
          )}
        >
          {c.label}
        </button>
        {tooltip(c.id, c.tip, false)}
      </div>
    );
  };

  const busAccent = hiOf("fan-bus");

  return (
    <figure
      className="mt-6"
      role="group"
      aria-label="Interactive system architecture: customer behavior becomes product events and a unified profile, orchestrated by Iterable into email, SMS, and in-app communications."
    >
      {/* Lifecycle filters + reset */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          Lifecycle
        </span>
        {filters.map((f) => {
          const pressed = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => chooseFilter(f.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                a.focus,
                pressed
                  ? cn("border-transparent text-ink", a.softBorder, a.softBg)
                  : "border-line bg-surface text-ink-secondary hover:border-line-strong hover:text-ink",
              )}
            >
              {f.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={reset}
          disabled={!filter}
          className={cn(
            "ml-auto rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink-secondary transition-all duration-200 ease-premium hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40",
            a.focus,
          )}
        >
          Reset view
        </button>
      </div>

      {/* The map - a centered vertical spine that fans out at Iterable */}
      <motion.div
        variants={revealItem}
        className="mt-8 flex flex-col items-center"
      >
        {spine.map((node, i) => (
          <Fragment key={node.id}>
            {renderNode(node)}
            {i < spine.length - 1 && vConnector(`sc-${i}`, "h-6", i * 0.2)}
          </Fragment>
        ))}

        {/* Iterable → channels fan: stem, horizontal bus, drop lines */}
        {vConnector("fan-stem", "h-5", SPINE_CONN_IDS.length * 0.2)}
        <div className="relative flex w-full max-w-[380px] justify-between">
          <div
            aria-hidden
            className={cn(
              "absolute left-[16.666%] right-[16.666%] top-0 h-px transition-colors duration-200",
              busAccent ? a.line : "bg-line",
              dimOf("fan-bus") && "opacity-40",
            )}
          />
          {channels.map((c, i) => (
            <div key={c.id} className="flex flex-1 flex-col items-center">
              {vConnector(`dl-${c.id}`, "h-4", 1.05 + i * 0.12)}
              {renderChannel(c)}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shared context line - the always-visible sentence of meaning */}
      <figcaption
        aria-live="polite"
        className="mt-8 flex min-h-[20px] items-start justify-center gap-2 text-center text-[13px] leading-[1.5] text-ink-secondary"
      >
        <span
          aria-hidden
          className={cn("mt-[6px] size-1.5 shrink-0 rounded-full", a.dot)}
        />
        <span className="max-w-[520px]">{contextText}</span>
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Impact - a 2×2 dashboard matching the Contentful case study. Cards fade +
 * rise in with a stagger; hovering / focusing one crossfades its face to a
 * short qualitative note, with a soft elevation and restrained accent glow.
 * ───────────────────────────────────────────────────────────────────────── */

// Elevation + a subtle violet ring on hover / keyboard-focus (accent-product).
const CARD_GLOW =
  "hover:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)] focus-visible:shadow-[0_6px_20px_-8px_rgba(20,21,24,0.12),0_0_0_3px_rgba(124,58,237,0.09)]";

function ImpactCard({
  item,
}: {
  item: (typeof lifecycleDiagram.impact)[number];
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
      {/* Face - value + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center transition-opacity duration-200 ease-premium group-hover:opacity-0 group-focus-visible:opacity-0">
        <div className="text-[27px] font-semibold leading-none tracking-[-0.02em] text-ink">
          <CountUp value={item.value} />
        </div>
        <div className="mt-2.5 text-[12.5px] leading-tight text-ink-tertiary">
          {item.label}
        </div>
      </div>

      {/* Detail - revealed on hover / focus */}
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center opacity-0 transition-opacity duration-200 ease-premium group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="text-[13px] leading-[1.55] text-ink-secondary">
          {item.detail}
        </span>
      </div>
    </motion.div>
  );
}

/* Bulleted list with an accent-dot marker (My Role). */
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
 * The Customer Data & Lifecycle Platform case study. The interactive system
 * architecture is the hero and does the explaining, so the surrounding copy is
 * trimmed to what adds context and judgment:
 *   Summary → System Architecture → Impact → My Role → Lessons.
 * Title lives on the workspace header; summary leads here. Accent stays with
 * the Products category (violet).
 */
export function LifecycleCaseStudy({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const { impact } = lifecycleDiagram;

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

      {/* System Architecture - the hero */}
      <Section>
        <SectionLabel accent={accent}>System Architecture</SectionLabel>
        <SystemArchitecture accent={accent} />
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

      {/* My Role */}
      {node.myRole && node.myRole.length > 0 && (
        <Section>
          <SectionLabel accent={accent}>My Role</SectionLabel>
          <BulletList items={node.myRole} accent={accent} />
        </Section>
      )}

      {/* Lessons - highlighted callout (formerly Takeaway) */}
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
