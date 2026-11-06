import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "lenis/dist/lenis.css";
import "./globals.css";

import AuroraBackground from "@/components/AuroraBackground";
import CursorTrail from "@/components/CursorTrail";
import MotionProvider from "@/components/providers/MotionProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { getSiteUrl, site } from "@/lib/data";
import { introBootScript } from "@/lib/intro-boot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false, // only used for small labels; don't compete with the hero fonts
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Mike Julius Coloma",
    "Web Developer",
    "Laravel",
    "React.js",
    "Inertia.js",
    "Full Stack Developer",
    "Portfolio",
    "Philippines",
  ],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The intro boot script sets data-intro before hydration.
      suppressHydrationWarning
      className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuroraBackground />
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
        <CursorTrail />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
