import { AcademicBackground } from "@/components/custom/academic-background";
import { AnimatedScrollLine } from "@/components/custom/animated-scroll-line";
import { AcademicMonitoring } from "@/components/custom/academic-monitoring";
import { ExperienceTimeline } from "@/components/custom/experience-timeline";
import { Hero } from "@/components/custom/hero";
import { MetricsDashboard } from "@/components/custom/metrics-dashboard";
import { Projects } from "@/components/custom/projects";
import { SkillsAndTools } from "@/components/custom/skills-and-tools";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <MetricsDashboard />
        <ExperienceTimeline />
        <Projects />
        <SkillsAndTools />
        <AcademicBackground />
        <AcademicMonitoring />
      </main>
      <AnimatedScrollLine />
    </>
  );
}
