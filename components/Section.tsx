"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
  compact?: boolean;
};

export default function Section({ id, title, children, compact = false }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`page-section ${compact ? "page-section--compact" : ""}`}
    >
      <h2 className="page-section__title">{title}</h2>
      {children}

      <style>{`
        .page-section {
          min-height: 100vh;
          padding: 120px 24px 96px;
          background: transparent;
          position: relative;
        }
        .page-section--compact {
          min-height: auto;
        }
        .page-section__title {
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 800;
          font-family: "Degular Display", "Geist", system-ui, sans-serif;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0 0 32px 0;
          text-transform: uppercase;
          color: var(--color-text);
        }
        .page-section--compact .page-section__title {
          margin-bottom: 16px;
        }
        @media (min-width: 640px) {
          .page-section {
            padding-left: 48px;
            padding-right: 48px;
          }
        }
        @media (min-width: 1024px) {
          .page-section {
            padding-left: 96px;
            padding-right: 96px;
          }
        }
      `}</style>
    </motion.section>
  );
}
