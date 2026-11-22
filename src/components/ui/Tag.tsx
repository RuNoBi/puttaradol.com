export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 text-[0.72rem] leading-none text-muted">
      {children}
    </span>
  );
}
