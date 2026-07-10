export interface ContactInfo {
  name: string;
  targetRole: string;
  phone: string;
  whatsappMessage: string;
  email: string;
  emailSubject: string;
  location: string;
  github: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  status: string;
  completionYear: string;
}

export interface Monitoria {
  title: string;
  period: string;
}

export type LanguageLevel =
  | "Básico"
  | "Intermediário"
  | "Avançado"
  | "Fluente"
  | "Nativo";

export interface Language {
  name: string;
  level: LanguageLevel;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  highlights: string[];
  repoUrl: string;
  liveUrl?: string;
}

export interface SoftSkill {
  title: string;
  description: string;
  evidence?: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
  description: string;
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  impactMetrics: ImpactMetric[];
  experiences: Experience[];
  projects: Project[];
  education: Education;
  languages: Language[];
  monitorias: Monitoria[];
  technologies: SkillGroup[];
  technicalSkills: SkillGroup[];
  softSkills: SoftSkill[];
}