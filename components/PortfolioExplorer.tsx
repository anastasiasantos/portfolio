"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Branch, BranchId, Profile } from "@/lib/types";
import { ProfileCard } from "./ProfileCard";
import { BranchCard } from "./tree/BranchCard";
import { NodeCard } from "./tree/NodeCard";
import {
  CaseStudyWorkspace,
  type ActiveCase,
} from "./tree/CaseStudyWorkspace";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Root interactive view. Owns the accordion state for the whole tree:
 * one branch open at a time, one node detail open at a time. Rendering the
 * connectors is co-located here so the trunk/stub geometry stays in one place.
 */
export function PortfolioExplorer({
  profile,
  branches,
}: {
  profile: Profile;
  branches: Branch[];
}) {
  // Start with every branch collapsed so a new visit / refresh always shows the
  // three categories closed.
  const [openBranch, setOpenBranch] = useState<BranchId | null>(null);
  // The case study open in the dedicated workspace (null = browsing the tree).
  const [active, setActive] = useState<ActiveCase | null>(null);
  // The card that opened the workspace, so focus returns to it on exit.
  const triggerRef = useRef<HTMLElement | null>(null);

  function toggleBranch(id: BranchId) {
    setOpenBranch((prev) => (prev === id ? null : id));
  }

  function openCase(
    branch: Branch,
    node: Branch["nodes"][number],
    trigger: HTMLElement,
  ) {
    triggerRef.current = trigger;
    setActive({
      node,
      accent: branch.accent,
      template: branch.template ?? "experiment",
      category: branch.label,
    });
  }

  function closeCase() {
    setActive(null);
    // Restore focus to the card that launched the workspace.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="mx-auto w-full max-w-content px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
      {/* Portfolio stays mounted behind the workspace, but is made inert +
          hidden from assistive tech while a case study is open. */}
      <div inert={active ? true : undefined}>
      <header className="mb-16 sm:mb-20">
        <p className="label-eyebrow text-ink-tertiary">
          Portfolio
          <span className="mx-2.5 text-ink-faint">·</span>
          <span className="text-ink-faint">
            Click a branch, then a node to open it
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,336px)_minmax(0,1fr)] lg:gap-x-20">
        <ProfileCard profile={profile} />

        {/* Tree */}
        <div className="min-w-0">
          {branches.map((branch, bIdx) => {
            const isBranchOpen = openBranch === branch.id;
            const isFirst = bIdx === 0;
            const isLast = bIdx === branches.length - 1;

            return (
              <div key={branch.id} className="relative pb-4 last:pb-0">
                {/* Main trunk segment (continuous across contiguous groups) */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-[7px] w-px bg-line",
                    isFirst ? "top-[36px]" : "top-0",
                    isLast ? "h-[36px]" : "bottom-0",
                  )}
                />

                {/* Branch row */}
                <div className="relative pl-8 sm:pl-9">
                  <Stub color={ACCENT[branch.accent].line} />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[4px] top-[36px] size-[7px] -translate-y-1/2 rounded-full ring-[3px] ring-canvas transition-colors duration-300",
                      ACCENT[branch.accent].dot,
                    )}
                  />
                  <BranchCard
                    branch={branch}
                    open={isBranchOpen}
                    onToggle={() => toggleBranch(branch.id)}
                  />
                </div>

                {/* Node list */}
                <AnimatePresence initial={false}>
                  {isBranchOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="relative ml-4 mt-4 pl-8 sm:ml-10 sm:pl-9">
                        {branch.nodes.map((node, nIdx) => {
                          const nFirst = nIdx === 0;
                          const nLast = nIdx === branch.nodes.length - 1;
                          return (
                            <div
                              key={node.id}
                              className="relative pb-4 pl-8 last:pb-0 sm:pl-9"
                            >
                              {/* Sub-trunk segment */}
                              <span
                                aria-hidden
                                className={cn(
                                  "pointer-events-none absolute left-[7px] w-px bg-line",
                                  nFirst ? "top-[34px]" : "top-0",
                                  nLast ? "h-[34px]" : "bottom-0",
                                )}
                              />
                              <Stub top="top-[34px]" />
                              <span
                                aria-hidden
                                className="absolute left-[5px] top-[34px] size-[5px] -translate-y-1/2 rounded-full bg-line-strong ring-[3px] ring-canvas"
                              />
                              <NodeCard
                                node={node}
                                accent={branch.accent}
                                onOpen={(trigger) =>
                                  openCase(branch, node, trigger)
                                }
                                template={branch.template}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      <CaseStudyWorkspace active={active} onClose={closeCase} />
    </div>
  );
}

/** Horizontal connector from a trunk to a card. `color` tints the line. */
function Stub({
  top = "top-[36px]",
  color = "bg-line",
}: {
  top?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-[7px] h-px w-6 sm:w-7",
        color,
        top,
      )}
    />
  );
}
