"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node, OnboardingRoute, ProductOutcome } from "@/lib/types";
import { Collapsible } from "../ui/Collapsible";

/**
 * The AI Onboarding Chatbot - the third AI build. An intent-recognition /
 * routing story, deliberately lighter than the Indigo Moore and Skin Lab
 * flagships: AI reads what a customer is trying to do and picks a destination;
 * the application does the routing.
 *
 * Follows the STANDARD AI case-study hierarchy (shared across every AI build):
 *   Overview → The Problem → AI Strategy → Outcome → Takeaway →
 *   Technical Details (one Collapsible deep-dive).
 * The signature visual is a single, lightweight interactive routing diagram
 * that lives (visible) inside AI Strategy. No metrics or details are invented.
 */

/** Accent-colored section kicker (shared visual language across templates). */
function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: Accent;
}) {
  return <p className={cn("label-eyebrow", ACCENT[accent].text)}>{children}</p>;
}

/** Small uppercase sub-heading used inside sections / the deep-dive. */
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
      {children}
    </p>
  );
}

/** Bulleted list with a small accent dot marker. */
function BulletList({
  items,
  accent,
  muted,
}: {
  items: string[];
  accent: Accent;
  muted?: boolean;
}) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              muted ? "border border-line-strong" : ACCENT[accent].dot,
            )}
          />
          <span className={muted ? "text-ink-tertiary" : "text-ink-secondary"}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Built outcomes, with an optional inline headline metric. */
function Outcomes({
  results,
  accent,
}: {
  results: ProductOutcome[];
  accent: Accent;
}) {
  return (
    <ul className="mt-4 space-y-3.5">
      {results.map((r, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              ACCENT[accent].dot,
            )}
          />
          <span className="text-ink-secondary">
            {r.value && (
              <span className="mr-1.5 font-mono font-semibold text-ink">
                {r.value}
              </span>
            )}
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** A centered node in the routing flow. */
function FlowNode({
  children,
  tone = "plain",
  accent,
}: {
  children: React.ReactNode;
  tone?: "ai" | "plain";
  accent: Accent;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[420px] items-center justify-center gap-2 rounded-node border px-5 py-3 text-center text-[13.5px] font-semibold shadow-card",
        tone === "ai"
          ? cn(a.softBorder, a.softBg, "text-ink")
          : "border-line bg-surface text-ink",
      )}
    >
      {tone === "ai" && (
        <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
      )}
      {children}
    </div>
  );
}

/** Short vertical connector between flow nodes. */
function FlowDown() {
  return <div aria-hidden className="mx-auto my-2 h-4 w-px bg-line" />;
}

/**
 * SIGNATURE VISUAL - the routing model. A customer question flows through AI
 * intent recognition, which fans to one of three destinations. Hovering (or
 * focusing / tapping) a destination reveals the example questions that route
 * there. Deliberately lightweight - one hover-to-reveal interaction, no motion.
 */
function RoutingDiagram({
  routes,
  accent,
}: {
  routes: OnboardingRoute[];
  accent: Accent;
}) {
  const [sel, setSel] = useState(0);
  const a = ACCENT[accent];
  const r = routes[sel];

  return (
    <figure
      className="mt-6"
      aria-label="AI routing model: a customer question passes through AI intent recognition, which routes it to one of three destinations - signup, the product quiz, or support."
    >
      <FlowNode accent={accent}>Customer Question</FlowNode>
      <FlowDown />
      <FlowNode tone="ai" accent={accent}>
        AI Intent Recognition
      </FlowNode>
      <FlowDown />

      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
        Routed to one of three destinations
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {routes.map((route, i) => {
          const active = i === sel;
          return (
            <button
              key={route.key}
              type="button"
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
              aria-pressed={active}
              className={cn(
                "rounded-node border px-3 py-2.5 text-[13px] font-semibold outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 ease-premium",
                "hover:-translate-y-px focus-visible:-translate-y-px",
                a.focus,
                active
                  ? cn(a.softBorder, a.softBg, "text-ink shadow-card")
                  : "border-line bg-surface text-ink-secondary hover:border-line-strong hover:text-ink",
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    active ? a.dot : "bg-line-strong",
                  )}
                />
                {route.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-3 rounded-node border p-5 shadow-card",
          a.softBorder,
          a.softBg,
        )}
      >
        <p className={cn("label-eyebrow", a.text)}>{r.name}</p>
        <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink">{r.blurb}</p>
        <div className="mt-4">
          <SubLabel>Example questions</SubLabel>
          <ul className="mt-2 space-y-2">
            {r.examples.map((ex, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-secondary"
              >
                <span
                  aria-hidden
                  className={cn("mt-[8px] size-1 shrink-0 rounded-full", a.dot)}
                />
                <span className="italic">&ldquo;{ex}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}

/**
 * AI-vs-app split - the accented (AI) column vs. the neutral (application)
 * column, making the responsibility boundary legible at a glance.
 */
function ResponsibilitySplit({
  ai,
  app,
  accent,
}: {
  ai: string[];
  app: string[];
  accent: Accent;
}) {
  const a = ACCENT[accent];
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div
        className={cn(
          "rounded-node border p-5 shadow-card",
          a.softBorder,
          a.softBg,
        )}
      >
        <p
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
            a.text,
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", a.dot)} />
          AI · reads intent
        </p>
        <ul className="mt-3.5 space-y-2.5">
          {ai.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-secondary"
            >
              <span
                aria-hidden
                className={cn("mt-[8px] size-1 shrink-0 rounded-full", a.dot)}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-node border border-line bg-surface p-5 shadow-card">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          <span
            aria-hidden
            className="size-1.5 rotate-45 border border-current"
          />
          Application · executes the route
        </p>
        <ul className="mt-3.5 space-y-2.5">
          {app.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[14px] leading-[1.55] text-ink-secondary"
            >
              <span
                aria-hidden
                className="mt-[7px] size-1 shrink-0 rotate-45 border border-ink-faint"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OnboardingChatbotCaseStudy({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const a = ACCENT[accent];
  const cb = node.onboardingChatbot;
  if (!cb) return null;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - bold executive summary + supporting bullets */}
      <section>
        <SectionLabel accent={accent}>Overview</SectionLabel>
        <p className="mt-4 text-[16px] font-medium leading-[1.6] text-ink">
          {cb.overview}
        </p>
        <BulletList items={cb.overviewBullets} accent={accent} />
      </section>

      {/* The Problem - one concise paragraph */}
      <section>
        <SectionLabel accent={accent}>The Problem</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {cb.problem}
        </p>
      </section>

      {/* AI Strategy - PM framing + the routing visual does the explaining */}
      <section>
        <SectionLabel accent={accent}>AI Strategy</SectionLabel>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink-secondary">
          {cb.aiStrategy}
        </p>

        {/* Signature visual - the interactive routing model */}
        <div className="mt-8">
          <SubLabel>The routing model</SubLabel>
          <RoutingDiagram routes={cb.routes} accent={accent} />
        </div>

        {/* AI-vs-app split + the scope boundary */}
        <div className="mt-8">
          <SubLabel>Who owns what</SubLabel>
          <ResponsibilitySplit
            ai={cb.aiResponsibilities}
            app={cb.appResponsibilities}
            accent={accent}
          />
          <div
            className={cn(
              "mt-4 rounded-node border-l-[3px] px-6 py-4",
              a.border,
              a.softBg,
            )}
          >
            <p className="text-[15px] leading-[1.65] text-ink">
              {renderRichText(cb.boundaryPrinciple)}
            </p>
          </div>
        </div>
      </section>

      {/* Outcome - verified outcomes only */}
      {node.results && node.results.length > 0 && (
        <section>
          <SectionLabel accent={accent}>Outcome</SectionLabel>
          <Outcomes results={node.results} accent={accent} />
        </section>
      )}

      {/* Takeaway - one product lesson, elevated panel */}
      <section>
        <SectionLabel accent={accent}>Takeaway</SectionLabel>
        <div
          className={cn(
            "mt-4 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
            a.border,
            a.softBg,
          )}
        >
          <p className="text-[16.5px] leading-[1.7] text-ink">
            {renderRichText(cb.takeaway)}
          </p>
        </div>
      </section>

      {/* Technical Details - one collapsible deep-dive (mirrors the flagships) */}
      <div>
        <Collapsible
          showLabel="Show technical details"
          hideLabel="Hide technical details"
        >
          <div className="mt-8 space-y-11">
            <section>
              <SectionLabel accent={accent}>Testing</SectionLabel>
              <BulletList items={cb.testing} accent={accent} />
            </section>

            {node.myRole && node.myRole.length > 0 && (
              <section>
                <SectionLabel accent={accent}>Role</SectionLabel>
                <BulletList items={node.myRole} accent={accent} />
              </section>
            )}

            {cb.limitations && cb.limitations.length > 0 && (
              <section>
                <SectionLabel accent={accent}>Limitations</SectionLabel>
                <BulletList items={cb.limitations} accent={accent} muted />
              </section>
            )}
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
