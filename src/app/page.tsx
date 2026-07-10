import { AcademicBackground } from "@/components/custom/academic-background";
import { AcademicMonitoring } from "@/components/custom/academic-monitoring";
import { ExperienceTimeline } from "@/components/custom/experience-timeline";
import { Hero } from "@/components/custom/hero";
import { MetricsDashboard } from "@/components/custom/metrics-dashboard";
import { Projects } from "@/components/custom/projects";
import { SkillsMatrix } from "@/components/custom/skills-matrix";
import { SoftSkills } from "@/components/custom/soft-skills";
import { Technologies } from "@/components/custom/technologies";

export default function Home() {
  return (
    <main>
      <Hero />
      <MetricsDashboard />
      <ExperienceTimeline />
      <Projects />
      <Technologies />
      <SkillsMatrix />
      <SoftSkills />
      <AcademicBackground />
      <AcademicMonitoring />
    </main>
  );
}
