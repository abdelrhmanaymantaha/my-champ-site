"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  fallbackHash?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function BackToSection({ fallbackHash = "projects", className, children }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    let from = undefined;
    try {
      const params = new URLSearchParams(window.location.search);
      from = params.get("from") ?? undefined;
    } catch (err) {
      /* ignore */
    }

    const target = from ? `/#${from}` : `/#${fallbackHash}`;
    router.push(target);
  }

  return (
    <a href={`/#${fallbackHash}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
