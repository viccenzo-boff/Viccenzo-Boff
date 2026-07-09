# Architecture Document - Currículo Técnico Premium

## 1. Stack Tecnológica Core
* **Framework:** Next.js (Versão estável mais recente, utilizando App Router).
* **Linguagem:** TypeScript (Strict Mode ativado para tipagem estática e segurança).
* **Estilização:** Tailwind CSS (Utilitários de CSS para design system).
* **Componentes UI:** shadcn/ui (Componentes primitivos e acessíveis injetados localmente).
* **Ícones:** Lucide React (Ícones consistentes e minimalistas).
* **Deploy/Hospedagem:** Vercel (Build estático altamente otimizado via CDN global).

---

## 2. Estrutura de Pastas e Organização do Projeto
O projeto seguirá o padrão de arquitetura modular do Next.js App Router:

```text
├── .claudecode/             # Arquivos de contexto da IA (PRD, Architecture, Claude, Tasks)
├── src/
│   ├── app/                 # Rotas e Páginas (App Router)
│   │   ├── layout.tsx       # Layout principal, metadados globais e fontes
│   │   ├── page.tsx         # Página única do currículo (Single Page Application)
│   │   └── providers.tsx    # Provedores de contexto global (se necessário)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes crus do shadcn/ui (gerenciados via CLI)
│   │   └── custom/          # Nossos componentes de negócio (Hero, Timeline, Dashboard)
│   ├── data/
│   │   └── cv.ts            # Arquivo de dados tipados contendo todas as informações do currículo
│   ├── types/
│   │   └── cv.types.ts      # Interfaces e Types do TypeScript para o currículo
│   └── lib/
│       └── utils.ts         # Funções utilitárias (padrão do shadcn/ui para mesclar classes)
├── public/                  # Arquivos estáticos (imagens, arquivos para download como o PDF)
├── tailwind.config.js       # Configurações de cores, fontes e tokens de design do Tailwind
└── tsconfig.json            # Configurações estritas do compilador TypeScript