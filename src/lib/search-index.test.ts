import { describe, it, expect } from "vitest";

import {
  searchIndex,
  groupedSearchIndex,
  SECTION_ORDER,
} from "./search-index";
import { cvData } from "@/data/cv";

describe("searchIndex", () => {
  it("não tem ids duplicados (evita colisão de key no React)", () => {
    const ids = searchIndex.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo item tem título não-vazio", () => {
    for (const item of searchIndex) {
      expect(item.title.trim().length).toBeGreaterThan(0);
    }
  });

  it("todo sectionId pertence ao SECTION_ORDER (guarda do bug de busca da V2.0)", () => {
    const order = new Set<string>(SECTION_ORDER);
    for (const item of searchIndex) {
      expect(order.has(item.sectionId)).toBe(true);
    }
  });

  it("cobre todas as seções com as contagens derivadas de cvData", () => {
    const countIn = (id: string) =>
      searchIndex.filter((item) => item.sectionId === id).length;

    expect(countIn("inicio")).toBe(1);
    expect(countIn("painel-de-impacto")).toBe(cvData.impactMetrics.length);
    expect(countIn("experiencia-profissional")).toBe(cvData.experiences.length);
    expect(countIn("projetos")).toBe(cvData.projects.length);
    expect(countIn("tecnologias")).toBe(cvData.technologies.length);
    expect(countIn("matriz-de-competencias")).toBe(cvData.technicalSkills.length);
    expect(countIn("competencias-comportamentais")).toBe(cvData.softSkills.length);
    expect(countIn("formacao-academica")).toBe(2); // formação + idiomas
    expect(countIn("certificacoes-e-cursos")).toBe(cvData.certifications.length);
    expect(countIn("monitorias-academicas")).toBe(cvData.monitorias.length);
  });

  it("indexa cada projeto apenas pelas próprias searchKeywords", () => {
    // Guarda da regressão do laço genérico: até esta entrega, "IA",
    // "mensageria", "SDD", "Spec-Driven Development" e "PERT" — que descrevem
    // UM projeto — estavam na constante do laço de `buildSearchIndex`, e
    // portanto entravam nas keywords de todo projeto novo. Nenhum teste
    // acusava: a contagem por seção continuava correta com as palavras erradas.
    //
    // A comparação é por elemento exato, e não por substring: as keywords de um
    // item incluem descrição e highlights inteiros, e uma palavra curta como
    // "processo" aparece dentro do texto de outro projeto por coincidência de
    // prosa ("Processo de desenvolvimento disciplinado…"). O que esta guarda
    // proíbe é a *contribuição* de searchKeywords alheias, que é o defeito real.
    for (const project of cvData.projects) {
      const item = searchIndex.find((i) => i.id === `project-${project.id}`);
      expect(item).toBeDefined();

      const alheias = cvData.projects
        .filter((other) => other.id !== project.id)
        .flatMap((other) => other.searchKeywords ?? [])
        .filter((keyword) => !(project.searchKeywords ?? []).includes(keyword));

      for (const keyword of alheias) {
        expect(item?.keywords).not.toContain(keyword);
      }
    }
  });

  it("indexa cada projeto pelas próprias searchKeywords", () => {
    for (const project of cvData.projects) {
      const item = searchIndex.find((i) => i.id === `project-${project.id}`);
      for (const keyword of project.searchKeywords ?? []) {
        expect(item?.keywords).toContain(keyword);
      }
    }
  });

  it("formata o título da experiência como 'cargo · empresa'", () => {
    const first = cvData.experiences[0];
    expect(first).toBeDefined();
    const item = searchIndex.find((i) => i.id === `experience-${first?.id}`);
    expect(item?.title).toBe(`${first?.role} · ${first?.company}`);
  });

  it("lista idiomas com nível no subtítulo", () => {
    const languages = searchIndex.find((i) => i.id === "languages");
    expect(languages?.subtitle).toBe(
      cvData.languages.map((l) => `${l.name} — ${l.level}`).join(", ")
    );
  });
});

describe("groupedSearchIndex", () => {
  it("segue a ordem do SECTION_ORDER, filtrando grupos vazios", () => {
    const groupedIds = groupedSearchIndex.map((g) => g.sectionId);
    const expected = SECTION_ORDER.filter((id) =>
      searchIndex.some((item) => item.sectionId === id)
    );
    expect(groupedIds).toEqual(expected);
  });

  it("nenhum grupo é vazio", () => {
    for (const group of groupedSearchIndex) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("todos os itens de um grupo pertencem à sua seção", () => {
    for (const group of groupedSearchIndex) {
      for (const item of group.items) {
        expect(item.sectionId).toBe(group.sectionId);
      }
    }
  });
});
