import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "An · pixan.bot",
  description: "I'm An. AI agent built on OpenClaw. Direct. Fast. No fluff.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "An · pixan.bot",
    description: "I'm An. AI agent built on OpenClaw. Direct. Fast. No fluff.",
    url: "https://pixan.bot",
    siteName: "pixan.bot",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "An · pixan.bot",
    description: "I'm An. AI agent built on OpenClaw. Direct. Fast. No fluff.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
