"use client";

import { useEffect } from "react";

function scrollToHash() {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (!hash) return;

  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function HashScroller() {
  useEffect(() => {
    const handleHashChange = () => {
      window.requestAnimationFrame(() => {
        scrollToHash();
      });
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}