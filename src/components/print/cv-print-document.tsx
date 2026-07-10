import { cvData } from "@/data/cv";
import { buildMailtoUrl } from "@/lib/email-links";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp-link";

// Template de impressão do currículo, renderizado para HTML estático por
// scripts/generate-cv-pdf.tsx (nunca servido pela aplicação). A ordem das
// seções é a de leitura de recrutador, deliberadamente diferente da tela.
// Sempre em light mode, coluna única e texto real — compatível com ATS.

const printStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #18181b;
    background: #ffffff;
  }
  a { color: #18181b; }
  header { border-bottom: 1.5pt solid #18181b; padding-bottom: 10pt; margin-bottom: 12pt; }
  h1 { font-size: 19pt; letter-spacing: -0.25pt; }
  .role { font-size: 11pt; color: #3f3f46; margin-top: 2pt; }
  .contact-line { font-size: 9pt; color: #3f3f46; margin-top: 6pt; }
  section { margin-bottom: 11pt; }
  h2 {
    font-size: 10pt;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    border-bottom: 0.75pt solid #d4d4d8;
    padding-bottom: 3pt;
    margin-bottom: 7pt;
    break-after: avoid;
  }
  h3 { font-size: 10pt; break-after: avoid; }
  article { margin-bottom: 8pt; break-inside: avoid; }
  article:last-child { margin-bottom: 0; }
  .item-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
  .meta { font-size: 9pt; color: #52525b; }
  ul { margin-top: 3pt; padding-left: 14pt; }
  li { margin-bottom: 2pt; }
`;

export function CVPrintDocument() {
  const {
    contact,
    summary,
    impactMetrics,
    experiences,
    projects,
    technologies,
    technicalSkills,
    education,
    languages,
    monitorias,
    softSkills,
  } = cvData;

  return (
    <html lang="pt-BR">
      {/* eslint-disable-next-line @next/next/no-head-element -- documento HTML
          autônomo gerado por script de build, nunca servido pelo Next */}
      <head>
        <meta charSet="utf-8" />
        <title>{`Currículo — ${contact.name}`}</title>
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      </head>
      <body>
        <header>
          <h1>{contact.name}</h1>
          <p className="role">{contact.targetRole}</p>
          <p className="contact-line">
            {contact.location} · E-mail:{" "}
            <a href={buildMailtoUrl(contact)}>{contact.email}</a> · WhatsApp:{" "}
            <a href={buildWhatsAppChatUrl(contact)}>+55 {contact.phone}</a> · GitHub:{" "}
            <a href={contact.github}>{contact.github}</a>
          </p>
        </header>

        <section>
          <h2>Resumo Profissional</h2>
          <p>{summary}</p>
        </section>

        <section>
          <h2>Resultados de Impacto</h2>
          <ul>
            {impactMetrics.map((metric) => (
              <li key={metric.label}>
                <strong>
                  {metric.value} — {metric.label}:
                </strong>{" "}
                {metric.description}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Experiência Profissional</h2>
          {experiences.map((experience) => (
            <article key={experience.id}>
              <div className="item-header">
                <h3>
                  {experience.role} · {experience.company}
                </h3>
                <p className="meta">
                  {experience.period} · {experience.location}
                </p>
              </div>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Projetos</h2>
          {projects.map((project) => (
            <article key={project.id}>
              <h3>{project.name}</h3>
              <p className="meta">Stack: {project.stack.join(" · ")}</p>
              <p>{project.description}</p>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <p className="meta">
                Repositório: <a href={project.repoUrl}>{project.repoUrl}</a>
              </p>
            </article>
          ))}
        </section>

        <section>
          <h2>Tecnologias</h2>
          <ul>
            {technologies.map((group) => (
              <li key={group.category}>
                <strong>{group.category}:</strong> {group.skills.join(", ")}.
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Competências e Metodologias</h2>
          <ul>
            {technicalSkills.map((group) => (
              <li key={group.category}>
                <strong>{group.category}:</strong> {group.skills.join(", ")}.
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Formação Acadêmica</h2>
          <article>
            <h3>
              {education.degree} — {education.institution}
            </h3>
            <p className="meta">
              {education.status} · Previsão de conclusão em {education.completionYear}
            </p>
            <p>Monitorias acadêmicas:</p>
            <ul>
              {monitorias.map((monitoria) => (
                <li key={monitoria.title}>
                  {monitoria.title} ({monitoria.period})
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section>
          <h2>Idiomas</h2>
          <ul>
            {languages.map((language) => (
              <li key={language.name}>
                <strong>{language.name}:</strong> {language.level}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Competências Comportamentais</h2>
          <ul>
            {softSkills.map((skill) => (
              <li key={skill.title}>
                <strong>{skill.title}:</strong> {skill.description}
                {skill.evidence ? ` Evidência: ${skill.evidence}` : null}
              </li>
            ))}
          </ul>
        </section>
      </body>
    </html>
  );
}
