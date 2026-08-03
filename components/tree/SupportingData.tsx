"use client";

import { Sparkle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCENT } from "@/lib/accents";
import type { Accent } from "@/lib/types";
import { Collapsible } from "../ui/Collapsible";

/** Collapsible "supporting data" evidence list behind a Show/Hide toggle. */
export function SupportingData({
  items,
  accent,
}: {
  items: string[];
  accent: Accent;
}) {
  return (
    <Collapsible label="supporting data">
      <ul className="mt-5 space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 text-[15px] leading-[1.65]">
            <span className="mt-[3px] flex w-6 shrink-0">
              <Sparkle
                className={cn("size-3.5 fill-current", ACCENT[accent].text)}
              />
            </span>
            <span className="text-ink-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
