import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
<<<<<<< HEAD
import { getContent } from "@/lib/content";
=======
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
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
<<<<<<< HEAD
        <LayoutWrapper navbarContent={content.navbar}>{children}</LayoutWrapper>
=======
        <LayoutWrapper>{children}</LayoutWrapper>
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
      </body>
    </html>
  );
}