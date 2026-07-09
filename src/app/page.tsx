import { AcademicBackground } from "@/components/custom/academic-background";
import { AcademicMonitoring } from "@/components/custom/academic-monitoring";
import { ExperienceTimeline } from "@/components/custom/experience-timeline";
import { Hero } from "@/components/custom/hero";
import { MetricsDashboard } from "@/components/custom/metrics-dashboard";
import { SkillsMatrix } from "@/components/custom/skills-matrix";
import { SoftSkills } from "@/components/custom/soft-skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <MetricsDashboard />
      <ExperienceTimeline />
      <SkillsMatrix />
      <SoftSkills />
      <AcademicBackground />
      <AcademicMonitoring />
    </main>
  );
}
