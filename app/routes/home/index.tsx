import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { Download, FileText, Send } from "lucide-react";
import React, { memo } from "react";
import { type AppLoadContext, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types";

import { Blog } from "@/components/common/Blog";
import { Containers, Row } from "@/components/common/Container";
import { DashedBorder } from "@/components/common/DashedBorder";
import { DataPaginatedTable, type IPaginatedResponse } from "@/components/common/DataPaginatedTable";
import { MyProfile } from "@/components/common/MyProfile";
import { OpenSource } from "@/components/common/OpenSource";
import { AnchorUnderline, H1, Paragraph } from "@/components/typography";
import { GlitchCharReveal } from "@/components/typography/FlickerText";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { Badge, Button } from "@/components/ui";
import { useIsDark } from "@/hooks/useIsDark";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildMeta, siteUrlFromMatches } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function meta({ matches }: Route.MetaArgs) {
  return buildMeta({
    siteUrl: siteUrlFromMatches(matches),
    title: "Hire Vanya2h",
    description: "This is my awesome homepage.",
    path: "/",
  });
}

export async function loader({ context }: LoaderFunctionArgs<AppLoadContext>) {
  return {
    transfers: [],
  };
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <Section>
        <HiJumbotronFull />
      </Section>
      <Section>
        <MyProfile />
      </Section>
      <Section className="hidden">
        <OpenSource />
      </Section>
      <Section>
        <Blog />
      </Section>
      <Section className="hidden">
        <NFTSection />
      </Section>
      <Section>
        <HireMeJumbotron />
      </Section>
    </div>
  );
}

function NFTSection() {
  //   const { transfers } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Marketing Banner - Large card on left (desktop), full width on mobile */}
        <div className="md:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>My silly NFT collection</CardTitle>
              <CardDescription>
                Mint one of{" "}
                <AnchorUnderline
                  href="https://opensea.io/collection/0xc4b8f3272abbb7e63b0c021e22f0429a5e20ba45"
                  target="_blank"
                >
                  9 unique NFTs
                </AnchorUnderline>
                . Holders of these NFTs will gain exclusive access to my future projects.
              </CardDescription>
            </CardHeader>
            <div className="grow" />
            <CardFooter>
              <Button size="lg" variant="default">
                Connect Wallet
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Stats Cards - 2x2 grid on right (desktop), full width on mobile */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Total Supply" content="222" />
            <StatCard title="Mint price" content="Free" />
            <StatCard title="Circulation" content="42" />
            <StatCard title="Holders" content="20" />
          </div>
        </div>

        {/* Latest Mints Table - Full width below */}
        <div className="md:col-span-12">
          <DataPaginatedTable pageSize={3} fetchPage={fetchMintsWithCursor} columns={columns} queryKey="latest-mints" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, content }: { title: React.ReactNode; content: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-sm">{title}</CardDescription>
        <CardTitle className="text-3xl font-heading">{content}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function Section({ className, children, ...restProps }: React.ComponentProps<"section">) {
  return (
    <section className={cn("flex min-h-screen p-2 md:p-4", className)} {...restProps}>
      <div className="flex w-full relative">
        <DashedBorder />
        <Containers>
          <Row className="relative">{children}</Row>
        </Containers>
      </div>
    </section>
  );
}

const HiJumbotronFull = memo(function HiJumbotronFull() {
  return (
    <div className="flex flex-col text-center items-center justify-center">
      <div className="relative mb-6 p-4 rounded-4xl overflow-hidden">
        <img src={"/asterisk.png"} className="w-28 h-28 select-none animate-micro-scale-fade" draggable={false} />
        <DashedBorder className="animate-micro-scale-fade" />
      </div>
      <H1 className="text-3xl mb-4 text-foreground/90 tracking-wide font-primary">
        <GlitchCharReveal words="Vanya2h" />
      </H1>
      <Paragraph className="text-foreground/80 mb-4 animate-mask-reveal-up" style={{ animationDelay: "500ms" }}>
        Senior <span className="line-through">over</span>engineer, DeFi builder, cypherpunk enthusiast, occasional
        thinker and a little bit of writer. Based in <span className="text-foreground/50 line-through">Moscow</span> →
        Lisbon.
      </Paragraph>

      <div className="animate-micro-scale-fade" style={{ animationDelay: "800ms" }}>
        <span className="text-foreground/80 text-sm md:text-lg">
          <span className="text-nowrap">
            I push to{" "}
            <AnchorUnderline href="https://github.com/vanya2h" target="_blank">
              <GitHubLogoIcon className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" />
              GitHub
            </AnchorUnderline>
          </span>{" "}
          ·{" "}
          <span className="text-nowrap">
            Write on{" "}
            <AnchorUnderline href="https://x.com/vanya2h4u" target="_blank">
              <TwitterLogoIcon className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" /> X
            </AnchorUnderline>
          </span>{" "}
          ·{" "}
          <span className="text-nowrap">
            Chat in{" "}
            <AnchorUnderline href="https://telegram.me/kv9991" target="_blank">
              <Send className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" />
              Telegram
            </AnchorUnderline>
          </span>{" "}
          ·{" "}
          <span className="text-nowrap">
            Post in{" "}
            <AnchorUnderline href="https://t.me/vanya2htrades" target="_blank">
              <Send className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" />
              Telegram
            </AnchorUnderline>
          </span>{" "}
          ·{" "}
          <span className="text-nowrap">
            You can{" "}
            <AnchorUnderline href={`/cv.pdf?v=${__CV_BUILD_VERSION__}`} target="_blank">
              <FileText className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" />
              View my CV
            </AnchorUnderline>
          </span>{" "}
          ·{" "}
          <span className="text-nowrap">
            Or{" "}
            <AnchorUnderline href={`/cv.pdf?v=${__CV_BUILD_VERSION__}`} download="Ivan_K_CV.pdf">
              <Download className="inline align-middle w-[1em] h-[1em] mr-1 mb-0.5" />
              Download my CV
            </AnchorUnderline>
          </span>
        </span>
      </div>
    </div>
  );
});

function HireMeJumbotron({ ...restProps }: React.ComponentProps<"div">) {
  const { ref, state } = useScrollReveal();

  const lines = [
    <p>Let's connect, I will design</p>,
    <p className="text-nowrap">
      UI = ƒ(query)(data) <span className="text-foreground/40">&</span> query = ƒ(state)
    </p>,
    <p>
      Say <AnchorUnderline href="mailto:hi@vanya2h.me">hi@vanya2h.me</AnchorUnderline> or{" "}
      <span className="text-nowrap">
        DM me in{" "}
        <AnchorUnderline href="https://telegram.me/kv9991" target="_blank">
          Telegram
        </AnchorUnderline>
      </span>
    </p>,
  ];

  return (
    <div ref={ref} className="flex flex-col items-center" {...restProps}>
      <div className="text-center text-lg md:text-2xl">
        {lines.map((line, i) =>
          React.cloneElement(line, {
            key: i,
            className: cn(line.props.className, state === "visible" && "animate-mask-reveal-up"),
            style:
              state === "hidden"
                ? { opacity: 0 }
                : state === "visible"
                  ? { animationDelay: `${i * 120}ms` }
                  : undefined,
          }),
        )}
      </div>
    </div>
  );
}

type IMint = {
  id: string;
  image: string;
  date: string;
  minter: string;
  rarity: "legendary" | "common";
};

const mockMints: IMint[] = [
  {
    id: "1",
    image: "",
    date: "Dec 28, 2024, 3:45 PM",
    minter: "0x1a2b...3c4d",
    rarity: "legendary",
  },
  {
    id: "2",
    image: "",
    date: "Dec 28, 2024, 2:30 PM",
    minter: "0x5e6f...7g8h",
    rarity: "common",
  },
  {
    id: "3",
    image: "",
    date: "Dec 28, 2024, 1:15 PM",
    minter: "0x9i0j...1k2l",
    rarity: "common",
  },
  {
    id: "4",
    image: "",
    date: "Dec 27, 2024, 11:20 AM",
    minter: "0x3m4n...5o6p",
    rarity: "legendary",
  },
  {
    id: "5",
    image: "",
    date: "Dec 27, 2024, 9:05 AM",
    minter: "0x7q8r...9s0t",
    rarity: "common",
  },
  {
    id: "6",
    image: "",
    date: "Dec 26, 2024, 8:45 PM",
    minter: "0x1u2v...3w4x",
    rarity: "common",
  },
];

// function fetchMints(perPage: number, page: number) {
//   return mockMints.slice();
// }

const columns: ColumnDef<IMint>[] = [
  {
    accessorKey: "image",
    header: "NFT",
    cell: ({ row }) => <img src={row.original.image} alt="NFT" className="size-8 rounded-lg object-cover" />,
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    cell: ({ getValue }) => <span className="text-foreground text-sm">{getValue<string>()}</span>,
  },
  {
    accessorKey: "minter",
    header: "Minter Address",
    cell: ({ getValue }) => <code className="text-sm text-foreground">{getValue<string>()}</code>,
  },
  {
    accessorKey: "rarity",
    header: "Rarity",
    cell: ({ getValue }) => {
      const rarity = getValue<"legendary" | "common">();

      return (
        <Badge
          className={
            rarity === "legendary"
              ? "bg-emerald-500/30 text-emerald-300 border-0"
              : "bg-indigo-600/50 text-indigo-200 border-0"
          }
        >
          <span className="mr-1.5">●</span>
          {rarity === "legendary" ? "Legendary" : "Common"}
        </Badge>
      );
    },
  },
];

async function fetchMintsWithCursor(cursor: string | null, limit: number): Promise<IPaginatedResponse<IMint>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const pageIndex = cursor ? Number(cursor) : 0;
  const start = pageIndex * limit;
  const end = start + limit;

  const data = mockMints.slice(start, end);

  const hasNextPage = end < mockMints.length;

  return {
    data,
    hasNext: hasNextPage,
    cursor: hasNextPage ? String(pageIndex + 1) : null,
  };
}
