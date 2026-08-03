import type { Accent } from "./types";

/**
 * Maps a branch accent to concrete Tailwind classes. Centralized so a category's
 * color is defined once. Colors themselves live in globals.css / tailwind.config.
 *
 * `line` / `softBorder` / `focus` are the restrained states used on the top-level
 * category cards (connector line, open + hover border, focus ring).
 */
export const ACCENT: Record<
  Accent,
  {
    dot: string;
    text: string;
    ring: string;
    bar: string;
    border: string;
    softBg: string;
    line: string;
    softBorder: string;
    focus: string;
  }
> = {
  exp: {
    dot: "bg-accent-exp",
    text: "text-accent-exp",
    ring: "group-hover:border-accent-exp/40",
    bar: "bg-accent-exp",
    border: "border-accent-exp",
    softBg: "bg-accent-exp/[0.06]",
    line: "bg-accent-exp/60",
    softBorder: "border-accent-exp/40",
    focus: "focus-visible:ring-accent-exp/40",
  },
  ai: {
    dot: "bg-accent-ai",
    text: "text-accent-ai",
    ring: "group-hover:border-accent-ai/40",
    bar: "bg-accent-ai",
    border: "border-accent-ai",
    softBg: "bg-accent-ai/[0.06]",
    line: "bg-accent-ai/60",
    softBorder: "border-accent-ai/40",
    focus: "focus-visible:ring-accent-ai/40",
  },
  product: {
    dot: "bg-accent-product",
    text: "text-accent-product",
    ring: "group-hover:border-accent-product/40",
    bar: "bg-accent-product",
    border: "border-accent-product",
    softBg: "bg-accent-product/[0.06]",
    line: "bg-accent-product/60",
    softBorder: "border-accent-product/40",
    focus: "focus-visible:ring-accent-product/40",
  },
};
