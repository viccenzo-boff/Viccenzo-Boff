export interface ContactInfo {
  name: string;
  targetRole: string;
  phone: string;
  email: string;
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

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface SoftSkill {
  title: string;
  description: string;
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
  education: Education;
  monitorias: Monitoria[];
  technicalSkills: SkillGroup[];
  softSkills: SoftSkill[];
}