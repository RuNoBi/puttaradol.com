"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-text px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent"
    >
      Download PDF
    </button>
  );
}
