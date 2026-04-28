"use client";

import { motion, easeOut } from "framer-motion";

type HeroContent = {
  title: string;
  logo?: string;
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
        <motion.div
          className="hero-boy-logo"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={content.logo || "/aleven-logo.svg"} alt={content.title} className="hero-logo-image" />
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
          padding: 88px 24px 40px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .hero-title-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: clamp(200px, 32vh, 420px);
          margin-bottom: 16px;
          width: 100%;
        }
        .hero-boy-logo {
          width: min(92vw, 1200px);
          max-width: 100%;
          margin-top: 28px;
          transform: none;
          pointer-events: none;
        }

        .hero-logo-image {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          transition: filter 0.4s ease;
        }

        html[data-theme="light"] .hero-logo-image {
          filter: invert(1);
        }

        .hero-split {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 12px;
          width: 100%;
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
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
            padding: 84px 48px 48px;
          }
          .hero-boy-logo {
            width: min(82vw, 1400px);
            transform: none;
          }
          .hero-title-wrapper {
            min-height: clamp(220px, 34vh, 480px);
            margin-bottom: 20px;
          }
        }
      `}</style>
    </section>
  );
}