import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import SmoothScroll from "@/components/SmoothScroll";
import SiteLoader from "@/components/SiteLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ozmo.com.au"), // real domain eka
  title: "Ozmo | Web Design, Automation & AI for Small Businesses in Melbourne",
  description:
    "Melbourne-based team building websites, automation and AI systems for Australian small businesses. 3 months free support and interest-free payment plans.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Ozmo",
    url: "/",
    title: "Ozmo | Digital Solutions for Australian Businesses",
    description: "Websites, automation, AI and managed support from one team.",
    images: ["/og.jpg"], // 1200x630 image ekak hadanna
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Ozmo",
  url: "https://www.ozmo.com.au",
  telephone: "+61406079247",
  email: "roshan@adme.group",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3/80 Lloyd Street",
    addressLocality: "Heidelberg Heights",
    addressRegion: "VIC",
    postalCode: "3081",
    addressCountry: "AU",
  },
  areaServed: { "@type": "Country", name: "Australia" },
  serviceType: ["Web design", "Business automation", "AI solutions", "Managed hosting"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <SiteLoader />
        <SmoothScroll />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}