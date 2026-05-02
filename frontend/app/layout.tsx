import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProviders } from "@/providers/root-providers";
import { SiteHeader } from "@/components/site/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Casamecate Challenge",
    template: "%s · Casamecate",
  },
  description:
    "Dashboard del reto técnico — métricas de StackOverflow y vuelos en México.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RootProviders>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </RootProviders>
      </body>
    </html>
  );
}
