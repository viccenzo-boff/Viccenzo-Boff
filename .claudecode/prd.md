# Product Requirement Document (PRD) - Currículo Técnico Premium

## 1. Visão Geral do Produto
O projeto consiste em um portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, com foco em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site deve transparecer rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

---

## 2. Objetivos Estratégicos
* **Conversão:** Reter a atenção do recrutador nos primeiros 10 segundos através de uma proposta de valor clara e um visual minimalista impecável.
* **Autoridade:** Demonstrar proficiência técnica não apenas pelo texto, mas pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** Substituir a ideia de "jogos" por um **Painel de Impacto Interativo** (Dashboard de Métricas), provando capacidade analítica e foco em qualidade.

---

## 3. Escopo de Funcionalidades (MVP)

### Requisitos Funcionais (RF)
* **RF01 - Hero Section Editorial:** Apresentação de alto impacto com nome, cargo alvo, links de contato diretos (GitHub, E-mail, Telefone, LinkedIn) e um resumo profissional cirúrgico.
* **RF02 - Painel de Impacto Quanti-Qualitativo:** Um mini-dashboard interativo e minimalista que destaca as principais métricas do profissional:
  * +600 atendimentos de alta complexidade com 4.95/5 de satisfação.
  * +150 cartões de melhorias e reportes de falhas (Bug Hunting).
  * Taxa de retrabalho inferior a 5% em QA (Garantia de Qualidade).
* **RF03 - Linha do Tempo Profissional (Timeline):** Exibição cronológica e limpa das experiências (Dotse, IXC Soft, Dona Loca), destacando conquistas em formato de tópicos de alto impacto.
* **RF04 - Matriz de Competências:** Organização das habilidades técnicas em blocos lógicos (Governança, Gerência de Projetos, IoT/Sistemas Distribuídos, DevOps/Desenvolvimento, Banco de Dados, Conhecimentos de Negócio).
* **RF05 - Seção Acadêmica e Liderança:** Espaço limpo detalhando a graduação na Unoesc e o histórico consistente de 5 monitorias consecutivas (2024 a 2026).

### Requisitos Não-Funcionais (RNF)
* **RNF01 - Estética Visual:** Light Mode estrito para o MVP. Design minimalista corporativo, paleta monocromática com tons de cinza refinados (ex: zinc/slate do Tailwind) e tipografia premium de alta legibilidade (ex: Inter ou Geist).
* **RNF02 - Performance Absoluta:** Nota próxima a 100 no Google Lighthouse (Performance, Acessibilidade, Melhores Práticas e SEO).
* **RNF03 - Custo Zero de Infraestrutura:** Deploy automatizado e hospedagem gratuita utilizando a infraestrutura serverless/estática da Vercel.
* **RNF04 - Responsividade Total:** Adaptação perfeita de telas mobile (smartphones dos recrutadores) até monitores ultrawide.

---

## 4. Fora de Escopo (V1)
* Modo escuro nativo (planejado para a V2).
* Backend dedicado em Node.js com banco de dados relacional ativo (toda a estrutura de dados do currículo será estática e tipada no próprio Next.js).
* Formulário de contato com persistência em banco (substituído por links diretos de e-mail e WhatsApp para fricção zero).