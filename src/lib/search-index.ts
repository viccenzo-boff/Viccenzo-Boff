import { cvData } from "@/data/cv";

export interface SearchIndexItem {
  id: string;
  sectionId: string;
  sectionLabel: string;
  title: string;
  subtitle?: string;
  keywords: string[];
}

function buildSearchIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  items.push({
    id: "hero-perfil",
    sectionId: "inicio",
    sectionLabel: "Início",
    title: cvData.contact.name,
    subtitle: cvData.contact.targetRole,
    keywords: [cvData.contact.location, cvData.contact.email, "contato", "perfil"],
  });

  for (const metric of cvData.impactMetrics) {
    items.push({
      id: `metric-${metric.label}`,
      sectionId: "painel-de-impacto",
      sectionLabel: "Painel de Impacto",
      title: metric.label,
      subtitle: metric.value,
      keywords: [metric.description],
    });
  }

  for (const experience of cvData.experiences) {
    items.push({
      id: `experience-${experience.id}`,
      sectionId: "experiencia-profissional",
      sectionLabel: "Experiência Profissional",
      title: `${experience.role} · ${experience.company}`,
      subtitle: `${experience.period} · ${experience.location}`,
      keywords: experience.highlights,
    });
  }

  for (const group of cvData.technicalSkills) {
    items.push({
      id: `skill-group-${group.category}`,
      sectionId: "matriz-de-competencias",
      sectionLabel: "Matriz de Competências",
      title: group.category,
      subtitle: group.skills.join(", "),
      keywords: group.skills,
    });
  }

  for (const skill of cvData.softSkills) {
    items.push({
      id: `soft-skill-${skill.title}`,
      sectionId: "competencias-comportamentais",
      sectionLabel: "Competências Comportamentais",
      title: skill.title,
      keywords: [skill.description],
    });
  }

  items.push({
    id: "education",
    sectionId: "formacao-academica",
    sectionLabel: "Formação Acadêmica",
    title: cvData.education.degree,
    subtitle: cvData.education.institution,
    keywords: [cvData.education.status, cvData.education.completionYear],
  });

  for (const monitoria of cvData.monitorias) {
    items.push({
      id: `monitoria-${monitoria.title}`,
      sectionId: "monitorias-academicas",
      sectionLabel: "Monitorias Acadêmicas",
      title: monitoria.title,
      subtitle: monitoria.period,
      keywords: [],
    });
  }

  return items;
}

export const searchIndex: SearchIndexItem[] = buildSearchIndex();
