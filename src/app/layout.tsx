import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Mass Save® - Commercial Battery-Powered Forklift Rebate Application",
  description:
    "Apply for rebates on commercial battery-powered forklifts and forklift battery chargers through Mass Save® 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bcd3udd.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
