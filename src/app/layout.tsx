import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DataField } from "@/components/background/DataField";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { education } from "@/content/experience";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.fullName} — ${profile.role}`;
const description = `${profile.role} portfolio of ${profile.fullName} (${profile.nickname}). ${profile.summary}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s — ${profile.fullName}` },
  description,
  applicationName: profile.fullName,
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  keywords: [
    "Puttaradol Pongpanich",
    "Data Engineer",
    "Data Engineering",
    "Chulalongkorn University",
    "CEDT",
    "Airflow",
    "dbt",
    "PySpark",
    "Databricks",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: profile.siteUrl,
    siteName: profile.fullName,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  alternateName: [profile.nickname, "ภัทรดล พงษ์พานิช"],
  url: profile.siteUrl,
  jobTitle: profile.role,
  email: `mailto:${profile.links.email}`,
  image: `${profile.siteUrl}/images/portrait.png`,
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
  knowsAbout: ["Data Engineering", "ETL/ELT", "Data Warehousing", "Apache Airflow", "dbt", "PySpark", "Databricks", "SQL", "Python"],
  sameAs: [profile.links.linkedin, profile.links.github, profile.links.instagram],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <noscript>
          <style>{`.split-pending{visibility:visible}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[200] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg focus:translate-y-0"
        >
          Skip to content
        </a>
        <span id="top" aria-hidden className="absolute top-0" />
        <DataField />
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
