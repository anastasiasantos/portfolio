"use client";

import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import { renderRichText } from "@/lib/richtext";
import type { Accent, Node, ProductOutcome } from "@/lib/types";
import { Collapsible } from "../ui/Collapsible";

/** Accent-colored section kicker (shared visual language with experiments). */
function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: Accent;
}) {
  return <p className={cn("label-eyebrow", ACCENT[accent].text)}>{children}</p>;
}

/** Placeholder for a section whose content hasn't been written yet. */
function Todo() {
  return (
    <p className="mt-4 font-mono text-[13px] tracking-tight text-ink-faint">
      [TODO]
    </p>
  );
}

/** Bulleted list with a small accent dot marker (Goals, Solution, Challenges). */
function BulletList({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5 text-[15px] leading-[1.65]">
          <span
            className={cn(
              "mt-[9px] size-1.5 shrink-0 rounded-full",
              ACCENT[accent].dot,
            )}
          />
          <span className="text-ink-secondary">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered reasoning list (deep-dive Approach), matching the experiment style. */
function NumberedList({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <ol className="mt-4 space-y-5">
      {items.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span
            className={cn(
              "mt-[2px] w-6 shrink-0 font-mono text-[12px] font-semibold tabular-nums",
              ACCENT[accent].text,
            )}
          >
            {i + 1}
          </span>
          <p className="text-[15px] leading-[1.65] text-ink-secondary">{step}</p>
        </li>
      ))}
    </ol>
  );
}

/** Measurable outcomes / delivered capabilities: an accent-dot bullet, with an
 *  optional headline metric value shown inline before the description. */
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

/** Text section, or a [TODO] placeholder. */
function Prose({ text }: { text?: string }) {
  return text ? (
    <p className="mt-4 text-[15px] leading-[1.65] text-ink-secondary">{text}</p>
  ) : (
    <Todo />
  );
}

/**
 * The PRODUCT case study. Story (always shown when the card is open):
 *   Summary → Problem → Goals → Solution → Results → Takeaway.
 * Behind the "View Case Study" toggle (hidden by default):
 *   My Role → Approach → Challenges → Cross-functional Collaboration.
 * Uses the same visual language as the experiment template. Section spacing
 * matches the custom case studies (Contentful, Lifecycle) so the products read
 * as one family.
 */
export function ProductDetail({
  node,
  accent,
}: {
  node: Node;
  accent: Accent;
}) {
  const has = (v?: unknown[]) => !!v && v.length > 0;

  return (
    <div className="space-y-16 border-t border-line px-7 py-10 sm:space-y-20 sm:px-9 sm:py-12">
      {/* Overview - a lead-in that orients the reader before the sections */}
      {node.summary && (
        <section>
          <SectionLabel accent={accent}>Overview</SectionLabel>
          <p className="mt-4 text-[16px] font-medium leading-[1.55] text-ink">
            {node.summary}
          </p>
        </section>
      )}

      {/* Problem - prose or bullets */}
      <section>
        <SectionLabel accent={accent}>Problem</SectionLabel>
        {Array.isArray(node.problem) ? (
          <BulletList items={node.problem} accent={accent} />
        ) : (
          <Prose text={node.problem} />
        )}
      </section>

      {/* Goals */}
      <section>
        <SectionLabel accent={accent}>Goals</SectionLabel>
        {has(node.goals) ? (
          <BulletList items={node.goals!} accent={accent} />
        ) : (
          <Todo />
        )}
      </section>

      {/* Solution */}
      <section>
        <SectionLabel accent={accent}>Solution</SectionLabel>
        {has(node.solution) ? (
          <BulletList items={node.solution!} accent={accent} />
        ) : (
          <Todo />
        )}
      </section>

      {/* Results */}
      <section>
        <SectionLabel accent={accent}>Results</SectionLabel>
        {has(node.results) ? (
          <Outcomes results={node.results!} accent={accent} />
        ) : (
          <Todo />
        )}
      </section>

      {/* Takeaway - elevated panel, same as experiments */}
      <section>
        <SectionLabel accent={accent}>Takeaway</SectionLabel>
        {node.takeaway ? (
          <div
            className={cn(
              "mt-4 rounded-node border-l-[3px] px-7 py-6 sm:px-8 sm:py-7",
              ACCENT[accent].border,
              ACCENT[accent].softBg,
            )}
          >
            <p className="text-[16.5px] leading-[1.7] text-ink">
              {renderRichText(node.takeaway)}
            </p>
          </div>
        ) : (
          <Todo />
        )}
      </section>

      {/* View Case Study - implementation deep-dive, hidden by default */}
      <div>
        <Collapsible showLabel="View case study" hideLabel="Hide case study">
          <div className="mt-8 space-y-11">
            <section>
              <SectionLabel accent={accent}>My Role</SectionLabel>
              {has(node.myRole) ? (
                <BulletList items={node.myRole!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
            <section>
              <SectionLabel accent={accent}>Approach</SectionLabel>
              {has(node.approach) ? (
                <NumberedList items={node.approach!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
            <section>
              <SectionLabel accent={accent}>Challenges</SectionLabel>
              {has(node.challenges) ? (
                <BulletList items={node.challenges!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
            <section>
              <SectionLabel accent={accent}>
                Cross-functional Collaboration
              </SectionLabel>
              {has(node.crossFunctional) ? (
                <BulletList items={node.crossFunctional!} accent={accent} />
              ) : (
                <Todo />
              )}
            </section>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
