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

  for (const project of cvData.projects) {
    items.push({
      id: `project-${project.id}`,
      sectionId: "projetos",
      sectionLabel: "Projetos",
      title: project.name,
      subtitle: project.stack.join(", "),
      // "projeto" é propriedade da coleção (vale para todos); o resto é
      // propriedade do item e vem de `project.searchKeywords`. Enquanto havia um
      // projeto só, as duas coisas eram indistinguíveis e os termos do
      // Birthday.ai ("IA", "mensageria", "SDD"…) moravam aqui — indexando
      // qualquer projeto novo por palavras sem relação com ele.
      keywords: [
        project.description,
        ...project.stack,
        ...project.highlights,
        "projeto",
        ...(project.searchKeywords ?? []),
      ],
    });
  }

  for (const group of cvData.technologies) {
    items.push({
      id: `technology-group-${group.category}`,
      sectionId: "tecnologias",
      sectionLabel: "Tecnologias",
      title: group.category,
      subtitle: group.skills.join(", "),
      keywords: group.skills,
    });
  }

  for (const group of cvData.technicalSkills) {
    items.push({
      id: `skill-group-${group.category}`,
      sectionId: "matriz-de-competencias",
      sectionLabel: "Competências e Metodologias",
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
      keywords: skill.evidence
        ? [skill.description, skill.evidence, "oratória", "palestra", "workshop", "apresentações"]
        : [skill.description],
    });
  }

  items.push({
    id: "education",
    sectionId: "formacao-academica",
    sectionLabel: "Formação Acadêmica e Idiomas",
    title: cvData.education.degree,
    subtitle: cvData.education.institution,
    keywords: [cvData.education.status, cvData.education.completionYear],
  });

  items.push({
    id: "languages",
    sectionId: "formacao-academica",
    sectionLabel: "Formação Acadêmica e Idiomas",
    title: "Idiomas",
    subtitle: cvData.languages
      .map((language) => `${language.name} — ${language.level}`)
      .join(", "),
    keywords: cvData.languages.flatMap((language) => [language.name, language.level]),
  });

  for (const certification of cvData.certifications) {
    items.push({
      id: `certification-${certification.id}`,
      sectionId: "certificacoes-e-cursos",
      sectionLabel: "Certificações e Cursos",
      title: certification.name,
      subtitle: `${certification.institution} · ${certification.period}`,
      keywords: [
        certification.institution,
        certification.period,
        ...(certification.workload ? [certification.workload] : []),
        ...(certification.credential ? [certification.credential] : []),
        ...(certification.sponsor ? [certification.sponsor] : []),
        ...(certification.description ? [certification.description] : []),
        ...certification.highlights,
        "certificação",
        "curso",
      ],
    });
  }

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

/**
 * Ordem canônica das seções na busca. Fonte única de verdade compartilhada
 * com `SearchCommand`: cada `sectionId` produzido por `buildSearchIndex` DEVE
 * existir aqui, senão o grupo é filtrado e some da busca (foi a raiz do bug de
 * busca corrigido na V2.0). Coberto por `search-index.test.ts`.
 */
export const SECTION_ORDER = [
  "inicio",
  "painel-de-impacto",
  "experiencia-profissional",
  "projetos",
  "tecnologias",
  "matriz-de-competencias",
  "competencias-comportamentais",
  "formacao-academica",
  "certificacoes-e-cursos",
  "monitorias-academicas",
] as const;

export interface SearchGroup {
  sectionId: string;
  sectionLabel: string;
  items: SearchIndexItem[];
}

/** Índice agrupado por seção, na ordem do `SECTION_ORDER`, sem grupos vazios. */
export const groupedSearchIndex: SearchGroup[] = SECTION_ORDER.map((sectionId) => {
  const items = searchIndex.filter((item) => item.sectionId === sectionId);
  return { sectionId, sectionLabel: items[0]?.sectionLabel ?? sectionId, items };
}).filter((group) => group.items.length > 0);
