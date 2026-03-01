"use client";

import { motion, easeOut } from "framer-motion";

const BoyLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full text-[var(--color-text)]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="40" r="22" fill="currentColor" />
    <path d="M28 40 Q50 10 72 40" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <circle cx="40" cy="40" r="6" stroke="var(--color-bg)" strokeWidth="2" fill="none" />
    <circle cx="60" cy="40" r="6" stroke="var(--color-bg)" strokeWidth="2" fill="none" />
    <line x1="46" y1="40" x2="54" y2="40" stroke="var(--color-bg)" strokeWidth="2" />
    <path d="M40 50 Q50 58 60 50" stroke="var(--color-bg)" strokeWidth="2" fill="none" />
  </svg>
);

type HeroContent = {
  title: string;
  tagline: string;
  bulletPoints: string[];
};

export default function Hero({ content }: { content: HeroContent }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen px-10 pt-0"
      style={{ background: "var(--color-bg)" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-[30vw] font-extrabold lowercase leading-none tracking-tight"
      >
        {content.title}
        <motion.div
          className="absolute left-[12%] bottom-[6%] w-[6vw]"
          initial={{ y: 40, opacity: 0 }}
          animate={{
            y: [40, 0, 0, 40],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <BoyLogo />
        </motion.div>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-3xl opacity-70 mb-10 mt-6"
      >
        {content.tagline}
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="w-full max-w-none text-6xl font-bold mt-19 opacity-80"
        >
          {content.bulletPoints.map((line, i) => (
            <span key={i}>
              {line}
              {i < content.bulletPoints.length - 1 && <br />}
            </span>
          ))}
        </motion.p>
      </motion.div>
    </section>
  );
}
