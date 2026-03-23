import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { experiences, skills } from "./data";

Font.register({
  family: "BBH Bartle",
  src: "https://fonts.gstatic.com/s/bbhbartle/v1/zYXjKVYuMYMaN-IMqP3RSm4.ttf",
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
      fontWeight: 700,
    },
  ],
});

const colors = {
  primary: "#373fb0",
  text: "#1a1a1a",
  textMuted: "#555555",
  border: "#d4d4d4",
  sectionLine: "#0033ff",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    color: colors.text,
    padding: "36 44",
    lineHeight: 1.4,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  header: {
    flex: 1,
  },
  name: {
    fontFamily: "BBH Bartle",
    fontSize: 22,
    letterSpacing: 0.5,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.primary,
    marginTop: 16,
  },
  contactRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    fontSize: 8.5,
    color: colors.textMuted,
  },
  contactLink: {
    fontSize: 8.5,
    color: colors.primary,
    textDecoration: "none",
  },
  contactSeparator: {
    color: colors.border,
  },

  // Section headings — centered with colored underline
  sectionHeadingWrap: {
    marginTop: 14,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Profile summary
  profileText: {
    fontSize: 9.5,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  bold: {
    fontWeight: 700,
  },

  // Core competencies — bullet list
  competencyItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 1.5,
    fontSize: 9.5,
  },

  // Skills
  skillRow: {
    flexDirection: "column",
    gap: 2,
    fontSize: 9,
    marginBottom: 6,
  },
  skillLabel: {
    fontWeight: 700,
    fontSize: 9,
  },

  // Experience
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  role: {
    fontSize: 10.5,
    fontWeight: 700,
  },
  period: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  companyLine: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 3,
  },
  companyLink: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: 600,
    textDecoration: "none",
  },
  companyLocation: {
    fontSize: 9,
    color: colors.textMuted,
  },
  responsibilityItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 1.5,
    paddingLeft: 2,
  },
  bullet: {
    fontSize: 9.5,
  },
  responsibilityText: {
    fontSize: 9.5,
    flex: 1,
    lineHeight: 1.4,
  },
  techStack: {
    fontSize: 8.5,
    color: colors.textMuted,
    marginTop: 3,
  },
  techStackLabel: {
    fontWeight: 600,
    color: colors.textMuted,
  },

  // Circle accent
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
});

const coreCompetencies = [
  "Building dApps on Ethereum since 2017 — deep in DeFi protocols, tokenization standards/specifications, and the broader Web3 ecosystem",
  "Full-cycle individual contributor: architect, build, test, and ship end-to-end — many systems built from scratch are still running in production",
  "Hired, mentored, and scaled engineering teams through rapid startup growth (5 → 100+ at Rarible)",
  "Follow SOLID principles with strict TypeScript type-safety, combining functional-reactive programming and pragmatic OOP to keep codebases lean",
  "AI-first engineer — Claude is my daily driver, boosting my output 10x. Currently building rxfy, an open-source state management library",
];

export function CvPdfDocument() {
  return (
    <Document title="Ivan — Senior Fullstack Engineer CV" author="Ivan (Vanya2h)">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.header}>
            <Text style={s.name}>VANYA2H</Text>
            <Text style={s.subtitle}>Senior Fullstack Engineer | Tech Lead</Text>
          </View>
          <View style={s.circle} />
        </View>

        {/* Profile Summary */}
        <SectionHeading>Profile Summary</SectionHeading>
        <View>
          <Text style={s.profileText}>
            Software engineer with <Text style={s.bold}>10+ years of experience</Text> building well-designed,
            production-grade codebases. Founding engineer at startups that raised{" "}
            <Text style={s.bold}>$17M in funding</Text>. Most of my career has been spent building{" "}
            <Text style={s.bold}>decentralized applications on Ethereum</Text>. Deeply invested in the decentralized web
            — not just as a technology stack, but as infrastructure that makes finance open, permissionless, and
            censorship-resistant. Extensive experience building developer-facing{" "}
            <Text style={s.bold}>SDKs and APIs</Text>, <Text style={s.bold}>client-side applications</Text>, and{" "}
            <Text style={s.bold}>backend services</Text>. Strong in <Text style={s.bold}>system architecture</Text> and
            hands-on work on mission-critical features. Follow SOLID principles with a strong focus on static
            type-safety using <Text style={s.bold}>TypeScript</Text>.
          </Text>
        </View>

        {/* Core Competencies */}
        <SectionHeading>Core Competencies</SectionHeading>
        <View>
          {coreCompetencies.map((item, i) => (
            <View key={i} style={s.competencyItem}>
              <Text>•</Text>
              <Text>{item}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <SectionHeading>Skills</SectionHeading>

        <View style={s.skillRow}>
          <Text>
            <Text style={s.bold}>Languages & Frameworks:</Text> {skills.frontend}
          </Text>
        </View>
        <View style={s.skillRow}>
          <Text>
            <Text style={s.bold}>Blockchain:</Text> {skills.dapps}
          </Text>
        </View>
        <View style={s.skillRow}>
          <Text>
            <Text style={s.bold}>Backend & Infra:</Text> {skills.backend}, {skills.infrastructure}
          </Text>
        </View>

        {/* Professional Experience */}
        <SectionHeading>Professional Experience</SectionHeading>
        {experiences.map((exp) => (
          <View key={exp.company.name} style={s.experienceItem} wrap={false}>
            <View style={s.experienceHeader}>
              <Text style={s.role}>{exp.role}</Text>
              <Text style={s.period}>{exp.period}</Text>
            </View>
            <View style={s.companyLine}>
              <Link src={exp.company.href} style={s.companyLink}>
                {exp.company.name}
              </Link>
              <Text style={s.companyLocation}>- remote</Text>
            </View>
            {exp.responsibilities &&
              exp.responsibilities.map((item, i) => (
                <View key={i} style={s.responsibilityItem}>
                  <Text style={s.bullet}>•</Text>
                  <Text style={s.responsibilityText}>{item}</Text>
                </View>
              ))}
            {exp.techStack && exp.techStack.length > 0 && (
              <Text style={s.techStack}>
                <Text style={s.techStackLabel}>Technologies: </Text>
                {exp.techStack.join(", ")}
              </Text>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <View style={s.sectionHeadingWrap}>
      <Text style={s.sectionHeading}>{children}</Text>
    </View>
  );
}
