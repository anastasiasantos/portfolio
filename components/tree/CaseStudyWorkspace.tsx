"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent, Node } from "@/lib/types";
import { NodeDetail } from "./NodeDetail";
import { ProductDetail } from "./ProductDetail";
import { AIBuildDetail } from "./AIBuildDetail";
import { ContentfulPrototype } from "./ContentfulPrototype";
import { LifecycleCaseStudy } from "./LifecycleCaseStudy";
import { ConsentGateCaseStudy } from "./ConsentGateCaseStudy";
import { IndigoMooreCaseStudy } from "./IndigoMooreCaseStudy";
import { SkinLabCaseStudy } from "./SkinLabCaseStudy";
import { OnboardingChatbotCaseStudy } from "./OnboardingChatbotCaseStudy";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The case study currently open in the workspace. */
export interface ActiveCase {
  node: Node;
  accent: Accent;
  template: "experiment" | "product" | "ai";
  /** Category label shown in the header (e.g. "Products"). */
  category: string;
}

/** Picks the same detail renderer NodeCard used inline - content untouched. */
function CaseDetail({ active }: { active: ActiveCase }) {
  const { node, accent, template } = active;
  if (node.diagram === "lifecycle")
    return <LifecycleCaseStudy node={node} accent={accent} />;
  if (node.diagram === "consent-gate")
    return <ConsentGateCaseStudy node={node} accent={accent} />;
  if (node.diagram === "ai-ops")
    return <IndigoMooreCaseStudy node={node} accent={accent} />;
  if (node.diagram === "skin-lab")
    return <SkinLabCaseStudy node={node} accent={accent} />;
  if (node.diagram === "onboarding-chatbot")
    return <OnboardingChatbotCaseStudy node={node} accent={accent} />;
  if (node.variant === "prototype")
    return <ContentfulPrototype node={node} accent={accent} />;
  if (template === "product")
    return <ProductDetail node={node} accent={accent} />;
  if (template === "ai") return <AIBuildDetail node={node} accent={accent} />;
  return <NodeDetail node={node} accent={accent} />;
}

/**
 * A dedicated, full-page reading workspace for a single case study. Rendered in
 * a portal on <body> so it escapes the tree's layout and stacking contexts.
 *
 * Entry expands the panel from the clicked card (transform-origin) with a soft
 * scrim behind; exit reverses it. While open, the page scroll is locked (so the
 * portfolio's scroll position is preserved), focus is trapped inside, Escape
 * closes, and closing restores focus to the originating card.
 *
 * Content and layout of the case study itself are reused verbatim.
 */
export function CaseStudyWorkspace({
  active,
  onClose,
}: {
  active: ActiveCase | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // While open: lock body scroll (preserving position), focus the header, trap
  // Tab within the dialog, and close on Escape.
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadRight = document.body.style.paddingRight;
    // Lock scroll (preserving position) and compensate for the removed
    // scrollbar so the page behind doesn't shift under the expanding panel.
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    // Focus the back control once the panel is present.
    const focusTimer = window.setTimeout(() => backRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadRight;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.node.title} - case study`}
        >
          {/* Backdrop - the portfolio stays mounted behind, blurred + dimmed so
              the user knows they're still inside the app. Blocks interaction. */}
          <motion.div
            className="absolute inset-0 bg-canvas/55 backdrop-blur-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          />

          {/* Centering frame - its padding lets the blurred portfolio show
              around the surface; clicking it (outside the surface) closes. */}
          <div
            className="absolute inset-0 flex justify-center overflow-hidden p-0 sm:p-5 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {/* Workspace surface - the immersive document */}
            <motion.div
              ref={panelRef}
              className="relative flex w-full max-w-[1080px] flex-col overflow-hidden border-line bg-canvas sm:rounded-2xl sm:border sm:shadow-raised"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <WorkspaceHeader
                active={active}
                onClose={onClose}
                backRef={backRef}
              />

              {/* Scroll body - the header above stays put while this scrolls */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-[900px] pb-24 pt-6 sm:pt-8">
                  <CaseDetail active={active} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Compact sticky header: back link · category · project name (~64px tall). */
function WorkspaceHeader({
  active,
  onClose,
  backRef,
}: {
  active: ActiveCase;
  onClose: () => void;
  backRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-canvas px-5 sm:px-8">
      <button
        ref={backRef}
        type="button"
        onClick={onClose}
        className="group/back inline-flex shrink-0 items-center gap-1.5 rounded-md text-[13px] font-medium text-ink-secondary transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-exp/45 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <ArrowLeft className="size-4 transition-transform duration-200 ease-premium group-hover/back:-translate-x-0.5" />
        <span className="hidden sm:inline">Back to Portfolio</span>
        <span className="sm:hidden">Back</span>
      </button>

      <span aria-hidden className="h-6 w-px shrink-0 bg-line" />

      <div className="min-w-0">
        <p className={cn("label-eyebrow", ACCENT[active.accent].text)}>
          {active.category}
        </p>
        <p className="mt-1 truncate text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {active.node.title}
        </p>
      </div>
    </header>
  );
}
