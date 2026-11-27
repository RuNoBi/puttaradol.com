import { ArrowRight } from "@/components/ui/icons";

/** Direct link to the pre-rendered PDF (regenerate with `npm run resume:pdf`). */
export function PrintButton() {
  return (
    <a
      href="/resume.pdf"
      download="Puttaradol-Pongpanich-Resume.pdf"
      className="group inline-flex items-center gap-3 rounded-full bg-text py-2.5 pr-3 pl-5 text-sm text-bg transition-colors duration-500 hover:bg-accent"
    >
      Download PDF
      <span className="flex size-6 rotate-90 items-center justify-center rounded-full bg-bg/15">
        <ArrowRight className="size-3" />
      </span>
    </a>
  );
}
