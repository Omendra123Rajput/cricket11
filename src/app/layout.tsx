import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CrickContest - Fantasy Cricket with Friends",
  description:
    "Private fantasy cricket contests for IPL season. Create leagues, build teams, compete with friends.",
  keywords: ["fantasy cricket", "IPL", "Dream11", "private contest"],
  openGraph: {
    title: "CrickContest - Fantasy Cricket with Friends",
    description:
      "Private fantasy cricket contests for IPL season. Build your dream team and compete with friends.",
    type: "website",
    siteName: "CrickContest",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrickContest - Fantasy Cricket with Friends",
    description:
      "Private fantasy cricket contests for IPL season. Build your dream team and compete with friends.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://crickcontest.vercel.app"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
