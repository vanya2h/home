import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

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
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: colors.text,
    padding: "52 60",
    lineHeight: 1.6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
  },
  name: {
    fontFamily: "BBH Bartle",
    fontSize: 22,
    letterSpacing: 0.5,
    color: colors.primary,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
  meta: {
    marginBottom: 28,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: colors.textMuted,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 28,
  },
  greeting: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 18,
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.7,
    marginBottom: 16,
    textAlign: "justify",
  },
  closing: {
    marginTop: 28,
    fontSize: 10.5,
  },
  signature: {
    fontFamily: "BBH Bartle",
    fontSize: 18,
    color: colors.primary,
    marginTop: 6,
  },
});

export function CoverLetterTangemPayPdf() {
  return (
    <Document title="Ivan K. — Cover Letter — Tangem Pay" author="Ivan K.">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.circle} />
        </View>

        {/* Meta */}
        <View style={s.meta}>
          <Text style={s.metaLabel}>Applying for</Text>
          <Text style={s.metaValue}>System Analyst — Tangem Pay</Text>
        </View>

        <View style={s.divider} />

        {/* Body */}
        <Text style={s.greeting}>Hi Tangem team,</Text>

        <Text style={s.paragraph}>
          I've been building on-chain systems since 2017 — from ICO platforms and NFT marketplaces to RWA tokenization
          protocols — and Tangem Pay is exactly the kind of product I want to be close to. Enabling crypto spending
          through a virtual Visa card is non-trivial infrastructure, and I've spent years working on precisely this
          intersection: connecting mobile apps, backend services, and external APIs in systems where transaction
          correctness is not optional.
        </Text>

        <Text style={s.paragraph}>
          At Evergonlabs I led the design and delivery of a full DeFi stack from scratch — defining API contracts
          between the client app and backend, integrating third-party services, documenting sequence flows, and shipping
          a public SDK consumed by external integrators. At Rarible I co-authored an SDK adopted by 60+ third-party
          integrators across 5 blockchains, which required deep work on API specification, edge-case analysis across
          complex transaction flows, and tight collaboration with mobile, backend, and product teams. I've lived the
          System Analyst responsibilities from the engineering side.
        </Text>

        <Text style={s.paragraph}>
          I also have hands-on mobile experience — I built and shipped a React Native app as the sole developer at
          Sticker.Place, handling both the mobile-backend architecture and the cross-platform code sharing strategy.
          Understanding what the mobile layer needs from the backend makes my API definitions and specs more grounded.
        </Text>

        <Text style={s.paragraph}>
          I'm comfortable producing technical documentation, sequence diagrams, and decomposing product requirements
          into actionable tasks — and I do all of this faster and more precisely with Claude as my daily driver.
        </Text>

        {/* Closing */}
        <View style={s.closing}>
          <Text>Best,</Text>
          <Text style={s.signature}>Ivan K.</Text>
        </View>
      </Page>
    </Document>
  );
}