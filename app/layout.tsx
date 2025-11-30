import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CYSMF - Christian Youth and Students Missionary Fellowship",
  description: "Empowering young believers on campuses across Rwanda and beyond.",
  keywords: ["CYSMF", "Christian", "Youth", "Students", "Missionary", "Fellowship", "Campus Ministry", "Rwanda", "Kigali"],
  authors: [{ name: "CYSMF Rwanda" }],
  openGraph: {
    title: "CYSMF - Christian Youth and Students Missionary Fellowship",
    description: "Empowering young believers on campuses across Rwanda and beyond.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
