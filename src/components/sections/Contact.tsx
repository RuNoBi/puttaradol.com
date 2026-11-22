import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactLinks } from "@/components/sections/ContactLinks";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

export function Contact() {
  return (
    <Section id="contact" className="pb-16 md:pb-20">
      <div className="mb-10 flex items-center gap-3 border-t border-line pt-4 text-label font-medium uppercase text-muted md:mb-14">
        <span className="tnum text-accent">06</span>
        <span>Contact</span>
      </div>

      <SplitHeading className="mb-6 text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
        Let&apos;s talk.
      </SplitHeading>
      <p className="mb-14 max-w-[46ch] text-lg leading-relaxed text-muted md:mb-20">
        {profile.status}. Email me, or send a message on LinkedIn or Instagram.
      </p>

      <Reveal stagger={0.08}>
        <ContactLinks />
      </Reveal>
    </Section>
  );
}
