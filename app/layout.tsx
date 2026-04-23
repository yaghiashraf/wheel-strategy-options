import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopNav } from "@/components/top-nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://wheel-strategy-options.vercel.app"),
  title: {
    default: "Wheel Strategy Income Lab",
    template: "%s | Wheel Strategy Income Lab",
  },
  description:
    "A Vercel-ready wheel strategy screener using Alpaca option data with covered-call, cash-secured-put, fundamentals, and calculator workflows.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071116",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="pb-20">{children}</main>
      </body>
    </html>
  );
}
