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

export function CoverLetterSpeechifyPdf() {
  return (
    <Document title="Ivan K. — Cover Letter — Speechify" author="Ivan K.">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.circle} />
        </View>

        {/* Body */}
        <Text style={s.greeting}>Hi Speechify team,</Text>

        <Text style={s.paragraph}>
          I'm an AI-first engineer and I want to work on products where AI is genuinely central to the experience.
          Speechify is exactly that — AI-driven audio at 50M users is a hard, interesting problem at real scale, and
          it's the kind of product I want to spend my time building.
        </Text>

        <Text style={s.paragraph}>
          My background maps well to this role. I've spent 10+ years building web products end-to-end in TypeScript and
          React, including developer-facing SDKs adopted by 100+ third-party integrators. At Rarible I grew as a
          founding engineer and scaled the frontend team from 5 to 100+, shipping production systems that are still
          running today. At Evergonlabs I architected a full product stack from scratch — client app, APIs, and a public
          SDK — and took it to $200 TTV. I'm comfortable owning complex surfaces like a Chrome extension and a web
          product simultaneously, and I know what it takes to lead without losing touch with the code.
        </Text>

        <Text style={s.paragraph}>
          What draws me to Speechify beyond the scale is the mission — making information accessible to people who learn
          differently is tangibly impactful. I'd love to bring both the technical depth and the product intuition I've
          built over a decade to help push that forward.
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
