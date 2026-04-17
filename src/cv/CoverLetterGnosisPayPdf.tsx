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
  white: "#ffffff",
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

export function CoverLetterGnosisPayPdf() {
  return (
    <Document title="Ivan K. — Cover Letter — Gnosis Pay" author="Ivan K.">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.circle} />
        </View>

        {/* Body */}
        <Text style={s.greeting}>Gm Gnosis Pay!</Text>

        <Text style={s.paragraph}>
          I've been building decentralized applications on Ethereum since 2017 — from ICO platforms and NFT marketplaces
          to RWA tokenization protocols. As a DeFi-native user, the idea of a Visa card backed by a Safe smart account
          resonates deeply with me. Spending on-chain assets in the real world is exactly the kind of infrastructure I
          want to help build.
        </Text>

        <Text style={s.paragraph}>
          My experience maps closely to what Gnosis Pay is solving. At Evergonlabs I architected a full DeFi stack from
          scratch — client app, REST APIs, on-chain indexing, and a public SDK — growing the protocol to $42M TVL.
          Before that I spent five years at Rarible as a founding engineer, scaling the frontend team from 5 to 100+ and
          co-authoring an SDK adopted by 100+ third-party integrators across 5 blockchains. I'm comfortable owning
          systems end-to-end and working at the intersection of on-chain mechanics and real-world UX.
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
