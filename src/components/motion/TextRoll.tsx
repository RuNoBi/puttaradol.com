import type { ReactNode } from "react";

/**
 * Text that rolls up on hover — the label slides out the top while a copy
 * slides in from below. The parent must have the `group` class.
 */
export function TextRoll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ""}`}>
      <span className="block transition-transform duration-500 ease-lux group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-lux group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
