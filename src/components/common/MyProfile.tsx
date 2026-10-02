import { AnchorUnderline, InlineBadge, Paragraph } from "@/components/typography";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function MyProfile() {
  const { ref: containerRef, state } = useScrollReveal();

  return (
    <div ref={containerRef} className="leading-relaxed space-y-3">
      {(
        [
          <>
            Hi, I'm <InlineBadge>Ivan</InlineBadge> — a software engineer with 10+ years of experience building
            well-designed, production-grade codebases. Many systems I've built from scratch are still running in
            production today. I've been a founding engineer at startups that{" "}
            <AnchorUnderline href="https://cryptorank.io/ico/rarible" target="_blank">
              raised $17M
            </AnchorUnderline>{" "}
            in funding and are still operating.
          </>,
          <>
            Most of my career has been spent building decentralized applications on{" "}
            <AnchorUnderline target="_blank" href="https://ethereum.org/">
              Ethereum
            </AnchorUnderline>
            . I'm deeply invested in the decentralization technologies — not just as a technology stack, but as a new
            rails that makes finance open, permissionless, and censorship-resistant. I've been building developer-facing{" "}
            <InlineBadge>SDKs and APIs</InlineBadge>, <InlineBadge>client-side applications</InlineBadge>, and{" "}
            <InlineBadge>backend services</InlineBadge> in this space.
          </>,
          <>
            I'm strong in <InlineBadge>system and codebase architecture</InlineBadge> and{" "}
            <InlineBadge>design engineering</InlineBadge>. I do my best work as a full-cycle individual contributor,
            solving non-trivial problems and shipping products to production.
          </>,
          <>
            I follow SOLID principles with a strong focus on static type-safety using{" "}
            <InlineBadge>TypeScript</InlineBadge>. I combine <InlineBadge>functional-reactive programming</InlineBadge>{" "}
            and <InlineBadge>pragmatic OOP</InlineBadge> to keep codebases lean and easy to extend. I'm especially fond
            of RxJS and currently building my own model/store/state management framework focused on functional
            reactivity and state normalization —{" "}
            <AnchorUnderline href="https://rxfy.vanya2h.me" target="_blank">
              rxfy
            </AnchorUnderline>
            .
          </>,
        ] as React.ReactNode[]
      ).map((content, i) => (
        <Paragraph
          key={i}
          className={cn(state === "visible" && "animate-mask-reveal-up")}
          style={
            state === "hidden" ? { opacity: 0 } : state === "visible" ? { animationDelay: `${i * 120}ms` } : undefined
          }
        >
          {content}
        </Paragraph>
      ))}
    </div>
  );
}
