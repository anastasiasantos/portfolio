import { cn } from "@/lib/cn";

/**
 * The uppercase, letter-spaced micro-label used to head sections
 * (e.g. "PORTFOLIO", "HYPOTHESES", "RESULT").
 */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("label-eyebrow text-ink-tertiary", className)}>
      {children}
    </Tag>
  );
}
