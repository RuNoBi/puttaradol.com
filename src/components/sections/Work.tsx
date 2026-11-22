import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <Section id="work">
      <SectionHeader
        index="01"
        label="Work"
        title="Selected projects"
        aside={<span>Hover a project for a quick look, click for the full story.</span>}
      />
      <Reveal stagger={0.1}>
        <ProjectIndex projects={projects} />
      </Reveal>
    </Section>
  );
}
