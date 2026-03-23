import { Download } from "lucide-react";
import type { Route } from "./+types/cv";

import { Containers, Row } from "@/components/common/Container";
import { DashedBorder } from "@/components/common/DashedBorder";
import { MyProfile } from "@/components/common/MyProfile";
import { AnchorUnderline, Paragraph } from "@/components/typography";
import { H1, H2 } from "@/components/typography/Heading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { portfolioTags } from "@/portfolio/tags";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Hire Vanya2h" },
    {
      name: "description",
      content: "My awesome CV so you can hire me.",
    },
  ];
}

export default function CV() {
  return (
    <div className="min-h-screen p-2 md:p-4">
      <div className="relative">
        <DashedBorder />
        <Containers className="relative">
          <Row>
            <div className="flex justify-between items-start">
              <HiJumbotronSimple />
              <DownloadPdfButton />
            </div>
          </Row>
          <Row>
            <SectionHeading index={1}>My Profile</SectionHeading>
            <MyProfile />
          </Row>
          <CoreSkills />
          <ExperienceSection />
        </Containers>
      </div>
    </div>
  );
}

function HiJumbotronSimple() {
  return (
    <div>
      <H1 className="text-2xl mb-2 tracking-wide font-primary">
        Vanya<span className="text-primary">2h</span>
      </H1>
      <Paragraph className="mb-3">
        Senior <span className="line-through">over</span>engineer, defi enjoyer, cypherpunk enthusiast, occasional
        thinker and a little bit of writer.
      </Paragraph>
      <div className="flex flex-row flex-wrap gap-2 max-w-100">
        {portfolioTags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

function CoreSkills() {
  return (
    <Row>
      <SectionHeading index={2}>Core Skills</SectionHeading>
      <div className="flex flex-col md:grid grid-cols-2 grid-rows-2 gap-6">
        <Quandrant title="Frontend">
          AI-first development, React, Next.js, Vite, TypeScript, RxJS, MobX, React Native, Tailwind, CSS Modules,
          Canvas, WebSockets, WebRTC, Playwright, Cypress
        </Quandrant>
        <Quandrant title="DApps">
          EVM (Ethereum), Solana, Tezos, Aptos, Flow, wagmi, viem, ethers.js, web3.js, Smart contract integrations,
          Blockchain indexers (ponder.sh, graph), IPFS
        </Quandrant>
        <Quandrant title="Backend">
          Prisma, Drizzle, Node.js, Express.js, Hono.js, Deno, SSR, Backend-for-Frontend, PostgreSQL, MongoDB,
          WebSockets, media streaming, REST API design, GraphQL
        </Quandrant>
        <Quandrant title="Infrastructure">
          Railway, Supabase, AWS (Lambda, S3, media processing), FFmpeg, Jest, Vitest, CI/CD pipelines, Docker,
          Open-source SDK development
        </Quandrant>
      </div>
    </Row>
  );
}

function ExperienceSection() {
  return (
    <Row>
      <SectionHeading index={3}>Professional Experience</SectionHeading>
      <div className="space-y-8">
        {experiences.map((x) => (
          <ExperienceItem key={x.company.name} {...x} />
        ))}
      </div>
    </Row>
  );
}

function Quandrant({ title, children, ...restProps }: React.ComponentProps<"div">) {
  return (
    <div className="flex flex-col gap-1" {...restProps}>
      <h3 className="font-semibold font-secondary text-2xl">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

type ExperienceItemProps = {
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

function ExperienceItem({
  company,
  role,
  period,
  description,
  responsibilities = [],
  techStack = [],
}: ExperienceItemProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-2">
        <div>
          <AnchorUnderline href={company.href} target="_blank" className="text-sm">
            {company.name}
          </AnchorUnderline>
          <h3 className="text-2xl font-secondary mt-1">{role}</h3>
        </div>
        <p className="text-white/70 text-sm text-nowrap">{period}</p>
      </div>
      <p className="mb-3 leading-relaxed">{description}</p>
      {responsibilities.length > 0 && (
        <div className="mb-2">
          <p className="mb-1">Responsibilities:</p>
          <ul>
            {responsibilities.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {techStack.length > 0 && (
        <p className="text-foreground/70 text-sm">
          <span className="text-white/70">Tech Stack:</span> {techStack.join(", ")}
        </p>
      )}
    </div>
  );
}

function SectionHeading({ index, children, className, ...restProps }: React.ComponentProps<"div"> & { index: number }) {
  const indexFormatted = index < 10 ? `0${index}` : index;
  return (
    <div className={cn("mb-4 pb-2 border-b-4 border-white/20", className)} {...restProps}>
      <H2>
        <span className="text-primary">{indexFormatted}.</span> {children}
      </H2>
    </div>
  );
}

export const experiences = [
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
      name: "Glowbe.com",
      href: "https://glowbe.com",
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
] satisfies ExperienceItemProps[];

function DownloadPdfButton() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <a href="/cv.pdf" target="_blank">
        <Download className="size-4" />
        PDF
      </a>
    </Button>
  );
}
