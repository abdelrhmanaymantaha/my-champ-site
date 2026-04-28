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
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: easeOut },
    },
  };

  return (
    <section id="home" className="hero-section">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hero-title-wrapper"
      >
        <span className="hero-title-text">Aleven</span>

        {/* نفس مكان وأنيميشن الكود التاني */}
        <motion.div
          className="hero-boy-logo"
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
      </motion.div>

      <div className="hero-split">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-tagline-container"
        >
          <a
            href="#projects"
            className="hero-tagline"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            The Studio <span>→</span>
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-description-container"
        >
          <motion.h2 variants={itemVariants} className="hero-description">
            We bring ideas to life through sleek, innovative animation, crafting experiences that go beyond visuals to captivate and engage.
          </motion.h2>
        </motion.div>
      </div>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 160px 24px 64px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .hero-title-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 64px;
          width: 100%;
        }
        .hero-title-text {
          font-size: clamp(6rem, 28vw, 36rem);
          font-weight: 800;
          line-height: 0.72;
          letter-spacing: -0.06em;
          margin: 0;
          color: var(--color-text);
          text-align: center;
        }

        /* نفس مكان الكود التاني بالظبط */
        .hero-boy-logo {
          position: absolute;
          left: 15%;
          bottom: 6%;
          width: clamp(4rem, 15vw, 18rem);
          pointer-events: none;
        }

        .hero-split {
          display: flex;
          flex-direction: column;
          gap: 32px;
          margin-top: auto;
          width: 100%;
          border-top: 1px solid var(--color-border);
          padding-top: 32px;
        }
        .hero-tagline-container {
          flex: 1;
        }
        .hero-tagline {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
          letter-spacing: -0.01em;
          text-decoration: underline;
          text-underline-offset: 4px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .hero-tagline span {
          text-decoration: none;
          font-weight: 400;
        }
        .hero-description-container {
          flex: 3;
        }
        .hero-description {
          font-size: clamp(1.5rem, 3.5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          font-family: "Degular Display", "Geist", system-ui, sans-serif;
          color: var(--color-text);
          margin: 0;
          letter-spacing: -0.02em;
          max-width: 1400px;
        }
        @media (min-width: 768px) {
          .hero-split {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        @media (min-width: 1024px) {
          .hero-section {
            padding: 180px 48px 64px;
          }
        }
      `}</style>
    </section>
  );
}