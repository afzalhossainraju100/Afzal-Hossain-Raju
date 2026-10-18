import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Syne } from "next/font/google";
import { about, contact, profile, socials } from "@/data/portfolio";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["600", "700", "800"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const title = `${profile.name} — ${profile.roles[0]} & ${profile.roles[1]}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: `${about.intro} ${profile.tagline}`,
  keywords: [profile.name, ...profile.roles, "Portfolio", "Dhaka", "Bangladesh", "React", "Node.js", "MongoDB"],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    title,
    description: profile.tagline,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.tagline, creator: "@AfzalHossa7558" },
};

export const viewport: Viewport = {
  themeColor: "#05040f",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.roles[0],
  url: siteUrl,
  email: `mailto:${contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Daffodil International University" },
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
