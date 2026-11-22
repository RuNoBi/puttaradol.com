import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Pipeline } from "@/components/sections/Pipeline";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Pipeline />
      <Experience />
      <Stack />
      <Contact />
    </>
  );
}
