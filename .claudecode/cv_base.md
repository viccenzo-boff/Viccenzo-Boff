# Currículo Base — Viccenzo Gottardo Boff

> **Papel deste arquivo (importante):** este `.md` é o **espelho legível e a spec de
> entrada** do currículo. A fonte de verdade técnica que alimenta a tela e o PDF é
> `src/data/cv.ts` (objeto `cvData`, tipado por `src/types/cv.types.ts`) — mas **este
> arquivo deve refletir 100% do conteúdo daquele**, campo a campo.
>
> **Fluxo de trabalho:** quando o currículo real mudar (curso concluído, novo emprego,
> novo projeto, novo idioma, nova skill, nova métrica…), **o Viccenzo edita primeiro
> aqui**, em linguagem natural, como uma spec. O Claude então propaga a mudança para
> `src/data/cv.ts` seguindo os padrões do projeto (tipos em `src/types/cv.types.ts`,
> design system por tokens, regeneração do PDF via `pnpm generate:cv-pdf` se `cvData`
> mudou, testes) e mantém os dois em sincronia. Detalhes do fluxo: `CLAUDE.md` §3.
>
> A ordem das seções abaixo espelha a ordem dos campos de `cvData`, para facilitar a
> sincronização campo a campo. Os nomes entre parênteses (ex.: `targetRole`) apontam o
> campo correspondente no `cv.ts` — pode ignorá-los ao digitar; servem para a sincronização.

---

## 1. Contato (`contact`)

- **Nome (`name`):** Viccenzo Gottardo Boff
- **Cargo alvo (`targetRole`):** Analista de Tecnologia da Informação
- **Telefone (`phone`):** 49 99142-9722
- **E-mail (`email`):** <viccenzoboff@gmail.com>
- **Assunto automático do e-mail (`emailSubject`):** Oportunidade Profissional – Contato via Currículo Online
- **Mensagem padrão do WhatsApp (`whatsappMessage`):** Olá Viccenzo! Vi seu currículo online e gostaria de conversar.
- **Localização (`location`):** Chapecó - SC
- **GitHub (`github`):** <https://github.com/viccenzo-boff>

---

## 2. Resumo Profissional (`summary`)

Acadêmico de Sistemas de Informação na Unoesc com sólida experiência em Suporte Técnico avançado, Garantia de Qualidade (QA) e análise de regras de negócio em ERPs. Proficiente na administração de ambientes híbridos (Windows/Ubuntu) e na aplicação de frameworks de governança e gestão de serviços de TI. Destaca-se pela comunicação assertiva, liderança em treinamentos e foco na experiência do usuário.

---

## 3. Métricas de Impacto (`impactMetrics`)

- **+600 — Atendimentos de Alta Complexidade:** Suporte técnico conduzido em 8 meses, com satisfação média de 4,95/5,0.
- **+150 — Melhorias e Falhas Reportadas:** Cartões de bug hunting documentados tecnicamente junto à equipe de desenvolvimento.
- **< 5% — Taxa de Retrabalho em QA:** Reopen/retorno sobre mais de 130 cartões homologados em produção.

---

## 4. Experiências Profissionais (`experiences`)

### 4.1 Analista de Suporte Técnico / QA — Dotse

**Período:** 10/2025 - Atuante | **Localização:** Chapecó, SC

- **Atendimento Técnico e Experiência do Usuário:** Condução de mais de 600 atendimentos de suporte de alta complexidade em um período de 8 meses, mantendo uma consistência rigorosa de qualidade com média de satisfação de 4,95/5,0.
- **Triagem e Diagnóstico de Falhas (Bug Hunting):** Atuação proativa na identificação de vulnerabilidades e oportunidades de evolução do sistema, resultando na abertura e documentação técnica de aproximadamente 150 cartões de melhorias e reportes de falha junto à equipe de desenvolvimento.
- **Garantia de Qualidade (Quality Assurance):** Responsável pela homologação e execução de testes de software em mais de 130 cartões mapeados, assegurando a estabilidade das entregas no ambiente de produção com uma taxa de retrabalho (reopen/retorno) inferior a 5%.

### 4.2 Suporte Técnico Fiscal/Contábil — IXC Soft

**Período:** 10/2024 - 09/2025 | **Localização:** Chapecó, SC

- Atuação consultiva na análise e resolução de problemas complexos em sistemas ERP, com foco em módulos fiscais e contábeis.
- Análise de regras de negócio para obrigações acessórias como SPED Fiscal, SPED Contribuições e Sintegra.
- Especialização em processos de emissão de notas fiscais de diversos modelos (NF-e 55, NFC-e 65, NFCom 62, NFSC 21/22).
- Elaboração de documentação técnica para melhorias no sistema e report de bugs para a equipe de gestão de produtos, participando indiretamente do ciclo de vida do software.
- Condução de treinamentos internos sobre proatividade, comunicação e oratória para 10 colaboradores, contribuindo para o desenvolvimento da equipe.
- Mentoria de 5 novos colaboradores, acelerando sua integração e compreensão dos conceitos do sistema e processos fiscais.

### 4.3 Vendedor Líder — Dona Loca

**Período:** 02/2023 - 10/2024 | **Localização:** Chapecó, SC

- Responsável pelo treinamento completo de 5 novos colaboradores, abordando desde o atendimento ao cliente até os processos operacionais da loja.
- Gestão de operações diárias, incluindo controle de caixa, organização de estoque, entrada de mercadoria e emissão de notas fiscais.
- Desenvolvimento de uma abordagem de venda consultiva, resultando no aumento de aproximadamente 10% no ticket médio e na fidelização de clientes.

---

## 5. Projetos (`projects`)

### 5.1 Birthday.ai

- **Descrição:** Sistema full-stack de mensageria que automatiza felicitações de aniversário em grupos: orquestra o Gemini 2.5 Flash para gerar mensagens personalizadas com IA e as envia via WhatsApp.
- **Stack:** TypeScript, Node.js, Next.js, Gemini 2.5 Flash, WhatsApp, Vercel
- **Repositório (`repoUrl`):** <https://github.com/viccenzo-boff/birthday.ai>
- **Demo (`liveUrl`):** <https://birthday-ai-three.vercel.app> — guardada nos dados, mas **não renderizada** no site (a demo exige login; só o repositório é exibido — `prd.md` §6).

**Destaques (`highlights`):**

- Orquestração do Gemini 2.5 Flash para geração automática de mensagens de aniversário personalizadas por destinatário.
- Integração com WhatsApp via biblioteca não oficial — decisão deliberada de arquitetura, avaliada frente à API oficial do Meta, para operar com custo zero.
- Aplicação full-stack em TypeScript (backend + frontend Next.js) com painel administrativo, publicada na Vercel.
- Processo de desenvolvimento disciplinado com Spec-Driven Development (SDD) e ciclo Plan–Execute–Review–Test (PERT), da especificação à homologação.

---

## 6. Educação (`education`)

- **Graduação (`degree`):** Sistemas de Informação
- **Instituição (`institution`):** Unoesc
- **Status (`status`):** Cursando 6º Período
- **Previsão de conclusão (`completionYear`):** 2027

---

## 7. Idiomas (`languages`)

- **Inglês:** Avançado
- **Português:** Nativo

Níveis válidos no tipo `LanguageLevel`: Básico | Intermediário | Avançado | Fluente | Nativo.

---

## 8. Monitorias Acadêmicas (`monitorias`)

- **Monitor de Gerência de Projetos** — 2026/1
- **Monitor de Interconectividade de Computadores** — 2025/2
- **Monitor de Engenharia de Software** — 2025/1
- **Monitor de Estrutura de Dados** — 2024/2
- **Monitor de Algoritmos e Lógica da Programação** — 2024/1

---

## 9. Stack Tecnológica / Ferramentas (`technologies`)

Ferramental hands-on concreto (bloco otimizado para ATS — só hard-tech; `prd.md` §6).

- **Linguagens e Frameworks:** TypeScript, Java, HTML, CSS, Node.js, React, Next.js
- **Bancos de Dados:** SQL Avançado (gatilhos e procedures), PostgreSQL, MariaDB, Modelagem relacional, Controle de concorrência
- **Infra, Deploy e Ferramentas:** Docker, Vercel, Supabase, pgAdmin, DBeaver, Git
- **Integrações com IA:** Orquestração de LLM (Gemini 2.5 Flash)

---

## 10. Competências e Metodologias (`technicalSkills`)

Competências conceituais de engenharia, governança e gestão.

- **Governança e Gestão de TI:** COBIT, ITIL, Alinhamento estratégico de infraestrutura de TIC, Operação de processos de Service Desk
- **Gerência de Projetos:** Elaboração de escopo (TAP/EAP), Cronogramas com caminho crítico (Gantt, PERT), Abordagens tradicionais, Abordagens ágeis (Scrum), Abordagens híbridas
- **Sistemas Distribuídos e IoT:** Arquiteturas distribuídas, Modelagem de redes para Internet das Coisas, Protocolos MQTT/CoAP, Modelos Cloud/Edge Computing
- **Desenvolvimento de Software e DevOps:** Desenvolvimento web/mobile em multicamadas (MVC), Consumo de APIs RESTful estruturadas, Práticas de escrita de código limpo (Clean Code)
- **Conhecimentos Fiscais e de Negócio:** Análise de regras de negócio em sistemas ERP, Rotinas de obrigações acessórias (SPED, Sintegra), Múltiplos modelos de emissão de notas fiscais eletrônicas

---

## 11. Competências Comportamentais (`softSkills`)

### 11.1 Comunicação Estratégica e Oratória

Habilidade consolidada em traduzir conceitos puramente técnicos para públicos diversos, mediar a interlocução direta entre as partes interessadas do negócio e conduzir apresentações para grandes grupos com desenvoltura.

- **Evidência (`evidence`):** Palestra/workshop sobre o universo de Duna para ~40 pessoas na Unoesc (2026/1), além de treinamentos corporativos de comunicação e oratória para 10 colaboradores.

### 11.2 Trabalho em Equipe e Liderança

Experiência prática na liderança colaborativa de projetos de software em laboratório, mentoria de equipes e condução de treinamentos corporativos.

### 11.3 Resolução de Problemas Complexos

Perfil analítico focado no diagnóstico preciso de falhas de sistemas e melhoria contínua de infraestrutura por meio de metodologias de resolução de problemas reais.

### 11.4 Adaptabilidade e Orientação ao Valor

Alta resiliência psicológica para atuar sob a pressão de incidentes críticos e velocidade de autoestudo para assimilar imediatamente novas tecnologias emergentes.

---

## 12. Certificações e Cursos (`certifications`)

Bloco **"Certificações e Cursos"** da macro-seção "Formação e Desenvolvimento", agora
alimentado pelo campo `certifications` de `cvData` (tipo `Certification`) — renderizado na
tela e no PDF.

**Fluxo para novos cursos:** o usuário descreve o curso abaixo (nome, instituição, período,
carga horária, credencial e os domínios que dominou); ao receber o **OK**, o Claude
adiciona o item em `cv.ts`, no índice de busca e na seção do PDF, regenera o PDF e roda os
testes. Um campo novo no tipo `Certification` só é criado quando o formato do curso exigir.

### 12.1 Contabilidade Básica

- **Instituição:** UCEFF
- **Patrocínio:** custeado pela IXC Soft (empresa onde atuava), cursado em horário de trabalho — um encontro por semana ao longo de um semestre.
- **Período:** 2025/2
- **Carga horária:** 80 horas
- **Credencial:** conclusão com diploma e certificação.
- **Relevância:** aprofunda a competência "Conhecimentos Fiscais e de Negócio" — dá base contábil formal à análise de regras de negócio fiscais/contábeis em ERPs (leitura de Balanço Patrimonial e DRE, domínio do regime de competência), diferencial para atuar na fronteira entre TI e o financeiro.

**Domínios adquiridos (`highlights`):**

- **Fundamentos e equação patrimonial** — Ativo, Passivo e Patrimônio Líquido; a igualdade Ativo = Passivo + PL e a leitura das situações líquidas (incluindo passivo a descoberto), sob o Princípio da Entidade.
- **Método das partidas dobradas** — lógica de débito e crédito, escrituração no Livro Diário e no Razão (razonetes) e fechamento do Balancete de Verificação.
- **Regimes e apuração de resultado** — regime de competência vs. caixa, classificação de fatos contábeis (permutativos, modificativos e mistos) e encerramento do exercício (ARE).
- **Demonstrações contábeis** — estruturação do Balanço Patrimonial (Circulante / Não Circulante) e da DRE, e cálculo do CMV (Estoque Inicial + Compras − Estoque Final).
