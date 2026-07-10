import { CVData } from "@/types/cv.types";

export const cvData: CVData = {
  contact: {
    name: "Viccenzo Gottardo Boff",
    targetRole: "Analista de Tecnologia da Informação",
    phone: "49 99142-9722",
    whatsappMessage: "Olá Viccenzo! Vi seu currículo online e gostaria de conversar.",
    email: "viccenzoboff@gmail.com",
    emailSubject: "Oportunidade Profissional – Contato via Currículo Online",
    location: "Chapecó - SC",
    github: "https://github.com/viccenzo-boff",
  },
  summary: "Acadêmico de Sistemas de Informação na Unoesc com sólida experiência em Suporte Técnico avançado, Garantia de Qualidade (QA) e análise de regras de negócio em ERPs. Proficiente na administração de ambientes híbridos (Windows/Ubuntu) e na aplicação de frameworks de governança e gestão de serviços de TI. Destaca-se pela comunicação assertiva, liderança em treinamentos e foco na experiência do usuário.",
  impactMetrics: [
    {
      value: "+600",
      label: "Atendimentos de Alta Complexidade",
      description: "Suporte técnico conduzido em 8 meses, com satisfação média de 4,95/5,0.",
    },
    {
      value: "+150",
      label: "Melhorias e Falhas Reportadas",
      description: "Cartões de bug hunting documentados tecnicamente junto à equipe de desenvolvimento.",
    },
    {
      value: "< 5%",
      label: "Taxa de Retrabalho em QA",
      description: "Reopen/retorno sobre mais de 130 cartões homologados em produção.",
    },
  ],
  experiences: [
    {
      id: "dotse",
      role: "Analista de Suporte Técnico / QA",
      company: "Dotse",
      period: "10/2025 - Atuante",
      location: "Chapecó, SC",
      highlights: [
        "Atendimento Técnico e Experiência do Usuário: Condução de mais de 600 atendimentos de suporte de alta complexidade em um período de 8 meses, mantendo uma consistência rigorosa de qualidade com média de satisfação de 4,95/5,0.",
        "Triagem e Diagnóstico de Falhas (Bug Hunting): Atuação proativa na identificação de vulnerabilidades e oportunidades de evolução do sistema, resultando na abertura e documentação técnica de aproximadamente 150 cartões de melhorias e reportes de falha junto à equipe de desenvolvimento.",
        "Garantia de Qualidade (Quality Assurance): Responsável pela homologação e execução de testes de software em mais de 130 cartões mapeados, assegurando a estabilidade das entregas no ambiente de produção com uma taxa de retrabalho (reopen/retorno) inferior a 5%.",
      ],
    },
    {
      id: "ixcsoft",
      role: "Suporte Técnico Fiscal/Contábil",
      company: "IXC Soft",
      period: "10/2024 - 09/2025",
      location: "Chapecó, SC",
      highlights: [
        "Atuação consultiva na análise e resolução de problemas complexos em sistemas ERP, com foco em módulos fiscais e contábeis.",
        "Análise de regras de negócio para obrigações acessórias como SPED Fiscal, SPED Contribuições e Sintegra.",
        "Especialização em processos de emissão de notas fiscais de diversos modelos (NF-e 55, NFC-e 65, NFCom 62, NFSC 21/22).",
        "Elaboração de documentação técnica para melhorias no sistema e report de bugs para a equipe de gestão de produtos, participando indiretamente do ciclo de vida do software.",
        "Condução de treinamentos internos sobre proatividade, comunicação e oratória para 10 colaboradores, contribuindo para o desenvolvimento da equipe.",
        "Mentoria de 5 novos colaboradores, acelerando sua integração e compreensão dos conceitos do sistema e processos fiscais.",
      ],
    },
    {
      id: "donaloca",
      role: "Vendedor Líder",
      company: "Dona Loca",
      period: "02/2023 - 10/2024",
      location: "Chapecó, SC",
      highlights: [
        "Responsável pelo treinamento completo de 5 novos colaboradores, abordando desde o atendimento ao cliente até os processos operacionais da loja.",
        "Gestão de operações diárias, incluindo controle de caixa, organização de estoque, entrada de mercadoria e emissão de notas fiscais.",
        "Desenvolvimento de uma abordagem de venda consultiva, resultando no aumento de aproximadamente 10% no ticket médio e na fidelização de clientes.",
      ],
    },
  ],
  projects: [
    {
      id: "birthday-ai",
      name: "Birthday.ai",
      description: "Sistema full-stack de mensageria que automatiza felicitações de aniversário em grupos: orquestra o Gemini 2.5 Flash para gerar mensagens personalizadas com IA e as envia via WhatsApp.",
      stack: ["TypeScript", "Node.js", "Next.js", "Gemini 2.5 Flash", "WhatsApp", "Vercel"],
      highlights: [
        "Orquestração do Gemini 2.5 Flash para geração automática de mensagens de aniversário personalizadas por destinatário.",
        "Integração com WhatsApp via biblioteca não oficial — decisão deliberada de arquitetura, avaliada frente à API oficial do Meta, para operar com custo zero.",
        "Aplicação full-stack em TypeScript (backend + frontend Next.js) com painel administrativo, publicada na Vercel.",
        "Processo de desenvolvimento disciplinado com Spec-Driven Development (SDD) e ciclo Plan–Execute–Review–Test (PERT), da especificação à homologação.",
      ],
      repoUrl: "https://github.com/viccenzo-boff/birthday.ai",
      liveUrl: "https://birthday-ai-three.vercel.app",
    },
  ],
  education: {
    degree: "Sistemas de Informação",
    institution: "Unoesc",
    status: "Cursando 6º Período",
    completionYear: "2027",
  },
  languages: [
    { name: "Inglês", level: "Avançado" },
    { name: "Português", level: "Nativo" },
  ],
  monitorias: [
    { title: "Monitor de Gerência de Projetos", period: "2026/1" },
    { title: "Monitor de Interconectividade de Computadores", period: "2025/2" },
    { title: "Monitor de Engenharia de Software", period: "2025/1" },
    { title: "Monitor de Estrutura de Dados", period: "2024/2" },
    { title: "Monitor de Algoritmos e Lógica da Programação", period: "2024/1" },
  ],
  technologies: [
    {
      category: "Linguagens e Frameworks",
      skills: ["TypeScript", "Java", "HTML", "CSS", "Node.js", "React", "Next.js"],
    },
    {
      category: "Bancos de Dados",
      skills: ["SQL Avançado (gatilhos e procedures)", "PostgreSQL", "MariaDB", "Modelagem relacional", "Controle de concorrência"],
    },
    {
      category: "Infra, Deploy e Ferramentas",
      skills: ["Docker", "Vercel", "Supabase", "pgAdmin", "DBeaver", "Git"],
    },
    {
      category: "Integrações com IA",
      skills: ["Orquestração de LLM (Gemini 2.5 Flash)"],
    },
  ],
  technicalSkills: [
    {
      category: "Governança e Gestão de TI",
      skills: ["COBIT", "ITIL", "Alinhamento estratégico de infraestrutura de TIC", "Operação de processos de Service Desk"],
    },
    {
      category: "Gerência de Projetos",
      skills: ["Elaboração de escopo (TAP/EAP)", "Cronogramas com caminho crítico (Gantt, PERT)", "Abordagens tradicionais", "Abordagens ágeis (Scrum)", "Abordagens híbridas"],
    },
    {
      category: "Sistemas Distribuídos e IoT",
      skills: ["Arquiteturas distribuídas", "Modelagem de redes para Internet das Coisas", "Protocolos MQTT/CoAP", "Modelos Cloud/Edge Computing"],
    },
    {
      category: "Desenvolvimento de Software e DevOps",
      skills: ["Desenvolvimento web/mobile em multicamadas (MVC)", "Consumo de APIs RESTful estruturadas", "Práticas de escrita de código limpo (Clean Code)"],
    },
    {
      category: "Conhecimentos Fiscais e de Negócio",
      skills: ["Análise de regras de negócio em sistemas ERP", "Rotinas de obrigações acessórias (SPED, Sintegra)", "Múltiplos modelos de emissão de notas fiscais eletrônicas"],
    },
  ],
  softSkills: [
    {
      title: "Comunicação Estratégica e Oratória",
      description: "Habilidade consolidada em traduzir conceitos puramente técnicos para públicos diversos, mediar a interlocução direta entre as partes interessadas do negócio e conduzir apresentações para grandes grupos com desenvoltura.",
      evidence: "Palestra/workshop sobre o universo de Duna para ~40 pessoas na Unoesc (2026/1), além de treinamentos corporativos de comunicação e oratória para 10 colaboradores.",
    },
    {
      title: "Trabalho em Equipe e Liderança",
      description: "Experiência prática na liderança colaborativa de projetos de software em laboratório, mentoria de equipes e condução de treinamentos corporativos.",
    },
    {
      title: "Resolução de Problemas Complexos",
      description: "Perfil analítico focado no diagnóstico preciso de falhas de sistemas e melhoria contínua de infraestrutura por meio de metodologias de resolução de problemas reais.",
    },
    {
      title: "Adaptabilidade e Orientação ao Valor",
      description: "Alta resiliência psicológica para atuar sob a pressão de incidentes críticos e velocidade de autoestudo para assimilar imediatamente novas tecnologias emergentes.",
    },
  ],
};