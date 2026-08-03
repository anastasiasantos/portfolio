/** A skill tag. Quiet by default; subtle lift on hover. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-canvas px-2.5 py-[5px] text-[12.5px] font-medium text-ink-secondary transition-colors duration-200 hover:border-line-strong hover:text-ink">
      {children}
    </span>
  );
}
