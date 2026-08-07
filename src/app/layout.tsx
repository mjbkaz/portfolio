import type { Metadata } from "next";
import "./globals.css";
import CursorTrail from "@/components/CursorTrail";
import LoadingVideo from "@/components/LoadingVideo";

export const metadata: Metadata = {
  title: "Mike Julius Coloma | Web Developer",
  description:
    "Portfolio of Mike Julius Coloma - Web Developer specializing in Laravel, React.js, Inertia.js, PHP, JavaScript, and Tailwind CSS. Based in Orani, Bataan, Philippines.",
  keywords: [
    "Mike Julius Coloma",
    "Web Developer",
    "Laravel",
    "React.js",
    "Portfolio",
    "Philippines",
    "Gamer",
    "Full Stack Developer",
  ],
  authors: [{ name: "Mike Julius Coloma" }],
  openGraph: {
    title: "Mike Julius Coloma | Web Developer",
    description:
      "Portfolio of Mike Julius Coloma - Web Developer specializing in Laravel, React.js, and Tailwind CSS.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans antialiased">
        <LoadingVideo />
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
