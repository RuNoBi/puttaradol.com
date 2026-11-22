import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactLinks } from "@/components/sections/ContactLinks";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

export function Contact() {
  return (
    <Section id="contact" className="pb-10 md:pb-14">
      <p className="eyebrow mb-12 md:mb-16">Contact</p>

      <div className="mb-16 grid grid-cols-12 items-end gap-x-6 gap-y-8 md:mb-24">
        <SplitHeading className="col-span-12 text-[clamp(3.5rem,10vw,10rem)] leading-[0.86] font-extralight tracking-[-0.06em] lg:col-span-8">
          Let&apos;s talk.
        </SplitHeading>
        <p className="col-span-12 max-w-[38ch] text-lg leading-relaxed text-muted lg:col-span-4 lg:text-right">
          {profile.status}. Email me, or send a message on LinkedIn or Instagram.
        </p>
      </div>

      <Reveal stagger={0.08}>
        <ContactLinks />
      </Reveal>
    </Section>
  );
}
