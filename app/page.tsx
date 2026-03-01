import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Projects from "@/components/Projects";
import Play from "@/components/Play";
import About from "@/components/AboutSection";
import { getContentWithProjects } from "@/lib/content";

export default async function Home() {
  const content = await getContentWithProjects();
  return (
    <>
      <Hero content={content.hero} />
      <Section id="about" title={content.sections.about}>
        <About content={content.about} />
      </Section>
      <Section id="projects" title={content.sections.projects}>
        <Projects projects={content.projects} />
      </Section>
      <Section id="play" title={content.sections.play}>
        <Play content={content.play} />
      </Section>
    </>
  );
  
}
