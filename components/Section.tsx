"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, title, children }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-10 py-40"
      style={{ background: "var(--color-bg)" }}
    >
      <h2 className="text-5xl font-bold mb-10">{title}</h2>
      {children}
    </motion.section>
  );
}

