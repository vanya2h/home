export type ExperienceItem = {
  company: {
    name: string;
    href: string;
  };
  role: string;
  period: string;
  description: string;
  responsibilities?: string[];
  techStack?: string[];
};

export const experiences: ExperienceItem[] = [
  {
    company: {
      name: "Evergonlabs.com",
      href: "https://evergonlabs.com",
    },
    role: "Tech Lead / Fullstack Engineer",
    period: "2024 — Present",
    description:
      "Building infrastructure for RWA tokenization on EVM blockchains, based on a proprietary data standard ERC-7208. Grew the protocol to $42M TVL while delivering an integrator API, investor and issuer applications.",
    responsibilities: [
      "Architected and implemented the main client application from the ground up",
      "Built backend services and REST APIs powering investor and issuer workflows",
      "Designed a decentralized protocol and shipped a public SDK for third-party integrators",
      "Set up blockchain indexing infrastructure to track on-chain asset activity in real time",
    ],
    techStack: [
      "React",
      "Vite",
      "Tailwind",
      "wagmi",
      "TypeScript",
      "Playwright",
      "Vitest",
      "Hono.js",
      "PostgreSQL",
      "Ponder.sh",
    ],
  },

  {
    company: {
      name: "Rarible.com",
      href: "https://rarible.org",
    },
    role: "Lead Frontend Engineer",
    period: "2019 — 2024",
    description:
      "Co-founded and scaled an NFT marketplace from scratch. Grew the team from 5 engineers to 100+ employees, reaching 100K daily active users and 100+ third-party API integrators at peak.",
    responsibilities: [
      "Designed and implemented the frontend architecture powering the core marketplace",
      "Hired, mentored, and led the frontend team through rapid company growth",
      "Integrated five blockchain ecosystems (Ethereum, Solana, Tezos, Aptos, Flow) into a unified UI",
      "Co-authored the Rarible SDK, adopted by 100+ third-party integrators",
      "Established full E2E test coverage, significantly reducing regressions across releases",
    ],
    techStack: [
      "TypeScript",
      "RxJS",
      "Express.js (BFF)",
      "Jest",
      "Playwright",
      "wagmi",
      "viem",
      "ethers.js",
      "Ethereum (EVM)",
      "Solana",
      "Tezos",
      "Aptos",
      "Flow",
    ],
  },

  {
    company: {
      name: "Sticker.Place",
      href: "https://www.facebook.com/mystickerplace/",
    },
    role: "Senior Frontend / React Native Engineer",
    period: "2018 — 2019",
    description:
      "Developed and shipped mobile applications at a product-focused studio. The flagship Glowbe app ranked Top 10 in Health & Fitness for several consecutive months, sustaining 1,000+ active paid subscribers.",
    responsibilities: [
      "Single-handedly built and shipped the Glowbe app as the sole developer",
      "Engineered a cross-platform architecture sharing code between mobile and web",
      "Built a custom animated video player with smooth playback and transitions",
      "Optimized the video streaming backend to reduce latency and buffering",
      "Implemented full E2E test coverage with Cypress to ensure release stability",
    ],
    techStack: [
      "React Native",
      "React Native Web",
      "TypeScript",
      "MobX",
      "Express.js (BFF)",
      "Cypress",
      "Observable / Publisher-Subscriber state model",
    ],
  },

  {
    company: {
      name: "Daonomic.io",
      href: "https://daonomic.io",
    },
    role: "Frontend Engineer (Web3)",
    period: "2017 — 2018",
    description:
      "Built a platform for launching ICOs on Ethereum, facilitating over $20M in total funds raised across hosted projects.",
    responsibilities: [
      "Architected the client-side Web3 layer handling wallet connections and transaction signing",
      "Integrated IPFS for decentralized content storage and embedded wallet flows",
      "Built token sale dashboards giving issuers real-time visibility into fundraising progress",
    ],
    techStack: ["React", "CSS Modules", "web3.js", "Webpack", "Express.js (BFF)", "MetaMask"],
  },

  {
    company: {
      name: "Levelup.worlds",
      href: "https://levelup.worlds",
    },
    role: "Tech Lead / Fullstack Engineer",
    period: "2015 — 2017",
    description:
      "Developed an online education platform for building courses, presentations, and live streams, reaching 1,000 daily active users at peak.",
    responsibilities: [
      "Built interactive presentation editors using React and Canvas",
      "Implemented live streaming pipeline with WebRTC, WebSockets, and FFmpeg",
      "Developed content monetization features enabling creators to earn from courses",
      "Designed scalable cloud architecture on AWS to handle growing user traffic",
    ],
    techStack: ["Next.js", "React", "MongoDB", "Express.js", "AWS (Lambda, S3, media servers)"],
  },

  {
    company: {
      name: "Freelance",
      href: "/meme.jpg",
    },
    role: "Web Developer",
    period: "2014 — 2015",
    description: "Started my professional career in web development.",
    responsibilities: [
      "Built PHP-based websites and e-commerce solutions for local clients",
      "Designed UI layouts and implemented them end-to-end",
      "Collaborated in a small team, picking up core development workflows and version control",
    ],
    techStack: ["PHP, mysql, html, css, javascript"],
  },
];

export const skills = {
  frontend:
    "AI-first development, React, Next.js, Vite, TypeScript, RxJS, MobX, React Native, Tailwind, CSS Modules, Canvas, WebSockets, WebRTC, Playwright, Cypress",
  dapps:
    "EVM (Ethereum), Solana, Tezos, Aptos, Flow, wagmi, viem, ethers.js, web3.js, Smart contract integrations, Blockchain indexers (ponder.sh, graph), IPFS",
  backend:
    "Prisma, Drizzle, Node.js, Express.js, Hono.js, Deno, SSR, Backend-for-Frontend, PostgreSQL, MongoDB, WebSockets, media streaming, REST API design, GraphQL",
  infrastructure:
    "Railway, Supabase, AWS (Lambda, S3, media processing), FFmpeg, Jest, Vitest, CI/CD pipelines, Docker, Open-source SDK development",
};

export const profileSummary = [
  "Software engineer with 10+ years of experience building well-designed, production-grade codebases. Many systems built from scratch are still running in production today. Founding engineer at startups that raised $17M in funding and are still operating.",
  "Most of my career has been spent building decentralized applications on Ethereum. Deeply invested in the decentralized web — not just as a technology stack, but as infrastructure that makes finance open, permissionless, and censorship-resistant. Extensive experience building developer-facing SDKs and APIs, client-side applications, and backend services in this space.",
  "Strong in system architecture with hands-on work on mission-critical features. Full-cycle individual contributor, solving hard non-trivial problems and shipping systems to production. Passionate about AI-driven development — working with Claude as a daily driver has boosted productivity 10x.",
  "Follow SOLID principles with a strong focus on static type-safety using TypeScript. Combine functional-reactive programming and pragmatic OOP to keep codebases lean and easy to extend.",
];
