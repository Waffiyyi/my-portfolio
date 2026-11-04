import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteShell } from "@/components/portfolio/site-shell";
import { site } from "@/data/site";
import "./globals.css";
const archivo = localFont({
  src: "../public/fonts/archivo-latin-variable.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  fallback: ["Arial"],
  adjustFontFallback: "Arial",
});
const mono = localFont({
  src: "../public/fonts/jetbrains-mono-latin-400.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
  fallback: ["monospace"],
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Waffiyyi Fashola — Software Engineer",
    template: "%s — Waffiyyi Fashola",
  },
  description:
    "Thoughtful interfaces. Dependable systems. Waffiyyi Fashola is a full-stack software engineer in Lagos working with TypeScript, React, Next.js, Java and Spring Boot.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Waffiyyi Fashola",
    title: "Waffiyyi Fashola — Surface / System",
    description: "I build what people experience. And the systems behind it.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/initialsLogo.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${mono.variable}`}>
        <noscript>
          <style>{`.loader{display:none!important}`}</style>
        </noscript>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
