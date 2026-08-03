import { Fragment, type ReactNode } from "react";

/**
 * Renders a string with **bold** spans into React nodes.
 * Deliberately tiny - we only support the one inline mark the content uses.
 */
export function renderRichText(input: string): ReactNode {
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
