"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";
import ContactModal from "./ContactModal";

type NavbarContent = {
  name: string;
  location: string;
};

export default function LayoutWrapper({
  children,
  navbarContent,
}: {
  children: React.ReactNode;
  navbarContent: NavbarContent;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <AnimatedBackground />}
      {!isAdminRoute && <Navbar content={navbarContent} />}
      {children}
      {!isAdminRoute && <ContactModal />}
    </>
  );
}
