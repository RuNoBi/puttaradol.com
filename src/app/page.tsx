import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Pipeline } from "@/components/sections/Pipeline";
import { Showroom } from "@/components/sections/Showroom";
import { Metrics } from "@/components/sections/Metrics";
import { Stack } from "@/components/sections/Stack";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <div id="work">
        <Showroom projects={projects} />
      </div>
      <Metrics />
      <About />
      <Pipeline />
      <Experience />
      <Stack />
      <Contact />
    </>
  );
}
