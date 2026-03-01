import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getContent } from "@/lib/content";
import React from "react";

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
    <html lang="en">
      <body>
        <LayoutWrapper navbarContent={content.navbar}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}