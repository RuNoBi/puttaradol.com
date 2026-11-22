import { DarkZone } from "@/components/motion/DarkZone";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Pipeline } from "@/components/sections/Pipeline";
import { Showroom } from "@/components/sections/Showroom";
import { Specs } from "@/components/sections/Specs";
import { Stack } from "@/components/sections/Stack";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <Hero />
      {/* The page cross-fades to black while the showroom is on screen. */}
      <DarkZone id="work">
        <Showroom projects={projects} />
      </DarkZone>
      <Specs />
      <About />
      <Pipeline />
      <Experience />
      <Stack />
      <Contact />
    </>
  );
}
