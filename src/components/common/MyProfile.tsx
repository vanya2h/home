import { AnchorUnderline, InlineBadge, Paragraph } from "@/components/typography";

export function MyProfile() {
  return (
    <div className="leading-relaxed space-y-3">
      <Paragraph>
        Hi, I'm <InlineBadge>Ivan</InlineBadge> — a software engineer with 10+ years of experience building
        well-designed, production-grade codebases. Many systems I've built from scratch are still running in production
        today. I care deeply about static analysis and <InlineBadge>TypeScript</InlineBadge>. I can write code for weeks
        straight and then run it with no errors (true story). I've been a founding engineer at startups that{" "}
        <AnchorUnderline href="https://cryptorank.io/ico/rarible" target="_blank">
          raised $17M
        </AnchorUnderline>{" "}
        in funding and are still operating.
      </Paragraph>

      <Paragraph>
        I'm strong in <InlineBadge>system architecture</InlineBadge> and enjoy hands-on work on mission-critical
        features. I do my best work as a full-cycle individual contributor, solving hard non-trivial problems and
        shipping systems to production. I've spent a lot of time building developer-facing{" "}
        <InlineBadge>SDKs and APIs</InlineBadge>, <InlineBadge>client-side applications</InlineBadge>, and{" "}
        <InlineBadge>backend services</InlineBadge>.
      </Paragraph>

      <Paragraph>
        I'm following SOLID principles, with a strong focus on static type-safety using{" "}
        <InlineBadge>TypeScript</InlineBadge>. I combine <InlineBadge>functional-reactive programming</InlineBadge> and{" "}
        <InlineBadge>pragmatic OOP</InlineBadge> to build well-designed and minimalistic abstractions to achieve
        balanced reusability and efficiency. I'm especially fond of RxJS and currently working on my own state
        management library focused on functional reactivity —{" "}
        <AnchorUnderline href="https://www.npmjs.com/package/rxfy" target="_blank">
          rxfy
        </AnchorUnderline>
        .
      </Paragraph>
      <Paragraph>
        Most of my time as an engineer I've spent building decentralized applications on{" "}
        <AnchorUnderline target="_blank" href="https://ethereum.org/">
          Ethereum
        </AnchorUnderline>
        , and it's my biggest long-term bet. I believe Ethereum will underpin the next evolution of finance by making it
        truly permissionless, trustless, and censorship-resistant — turning financial infrastructure into open software
        instead of closed institutions. ETH is the new{" "}
        <AnchorUnderline target="_blank" href="https://ethdigitaloil.com/">
          Digital oil
        </AnchorUnderline>{" "}
        and next generation{" "}
        <AnchorUnderline href="https://ultrasound.money/" target="_blank">
          Store of value
        </AnchorUnderline>
        .
      </Paragraph>
    </div>
  );
}
