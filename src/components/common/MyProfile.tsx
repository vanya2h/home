import { AnchorUnderline, InlineBadge, Paragraph } from "@/components/typography";

export function MyProfile() {
  return (
    <div className="leading-relaxed space-y-3">
      <Paragraph>
        Hi, I'm <InlineBadge>Ivan</InlineBadge> — a software engineer with 10+ years of experience building
        well-designed, production-grade codebases. Many systems I've built from scratch are still running in production
        today. I've been a founding engineer at startups that{" "}
        <AnchorUnderline href="https://cryptorank.io/ico/rarible" target="_blank">
          raised $17M
        </AnchorUnderline>{" "}
        in funding and are still operating.
      </Paragraph>

      <Paragraph>
        Most of my career has been spent building decentralized applications on{" "}
        <AnchorUnderline target="_blank" href="https://ethereum.org/">
          Ethereum
        </AnchorUnderline>
        . I'm deeply invested in the decentralized web — not just as a technology stack, but as infrastructure that
        makes finance open, permissionless, and censorship-resistant. I've spent a lot of time building developer-facing{" "}
        <InlineBadge>SDKs and APIs</InlineBadge>, <InlineBadge>client-side applications</InlineBadge>, and{" "}
        <InlineBadge>backend services</InlineBadge> in this space.
      </Paragraph>

      <Paragraph>
        I'm strong in <InlineBadge>system architecture</InlineBadge> and enjoy hands-on work on mission-critical
        features. I do my best work as a full-cycle individual contributor, solving hard non-trivial problems and
        shipping systems to production. I'm passionate about <InlineBadge>AI-driven development</InlineBadge> — working
        with <InlineBadge>Claude</InlineBadge> as my daily driver has boosted my productivity 10x, and I believe
        AI-first engineering is the future of how great software gets built.
      </Paragraph>

      <Paragraph>
        I follow SOLID principles with a strong focus on static type-safety using <InlineBadge>TypeScript</InlineBadge>.
        I combine <InlineBadge>functional-reactive programming</InlineBadge> and{" "}
        <InlineBadge>pragmatic OOP</InlineBadge> to keep codebases lean and easy to extend. I'm especially fond of RxJS
        and currently building my own state management library focused on functional reactivity —{" "}
        <AnchorUnderline href="https://www.npmjs.com/package/rxfy" target="_blank">
          rxfy
        </AnchorUnderline>
        .
      </Paragraph>
    </div>
  );
}
