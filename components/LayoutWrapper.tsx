"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    const scrollToHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    };

    const tryScrollToHashTarget = () => {
      let attempts = 0;
      const maxAttempts = 20;

      const intervalId = window.setInterval(() => {
        const hash = window.location.hash.slice(1);
        const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;

        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          window.clearInterval(intervalId);
          return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
          window.clearInterval(intervalId);
        }
      }, 50);

      return () => window.clearInterval(intervalId);
    };

    scrollToHashTarget();
    const stopRetrying = tryScrollToHashTarget();

    window.addEventListener("hashchange", scrollToHashTarget);

    return () => {
      window.removeEventListener("hashchange", scrollToHashTarget);
      stopRetrying();
    };
  }, [pathname]);

  return (
    <>
      {!isAdminRoute && <AnimatedBackground />}
      {!isAdminRoute && <Navbar content={navbarContent} />}
      {children}
      {!isAdminRoute && <ContactModal />}
    </>
  );
}
