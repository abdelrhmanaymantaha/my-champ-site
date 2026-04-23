import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getContent } from "@/lib/content";
import React from "react";
import { Manrope, Libre_Baskerville } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre",
  display: "swap",
});

export const metadata = {
  title: "Champ Studio",
  description: "Creative Studio Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = getContent();
  return (
    <html lang="en" className={`${manrope.variable} ${libreBaskerville.variable}`}>
      <body>
        <LayoutWrapper navbarContent={content.navbar}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}