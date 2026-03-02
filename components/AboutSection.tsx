"use client";

import Image from "next/image";
import styles from "./about.module.css";

type AboutContent = {
  title: string;
  subtitle: string;
  mainText: string;
  description: string;
  quote: string;
  bottomTitle: string;
  bottomText: string;
};

export default function About({ content }: { content: AboutContent }) {
  const titleParts = content.title.split(" ");
  const firstWord = titleParts[0] || "";
  const rest = titleParts.slice(1).join(" ");
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            {firstWord}
            {rest && (
              <>
                <br /> {rest}{" "}
              </>
            )}
          </h1>
          <span className={styles.subtitle}>{content.subtitle}</span>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.imageFrame}>
            <Image
              src="/me.jpg"
              alt="Profile"
              width={500}
              height={600}
              className={styles.image}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.aboutText}>
        <span className={styles.label}>(about)</span>
        <p className={styles.mainText}>
          {content.mainText}
        </p>
      </section>

      <div className={styles.descriptionSection}>
        <p className={styles.description}>{content.description}</p>
      </div>

      <section className={styles.quoteSection}>
        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>{content.quote}</blockquote>
          <span className={styles.quoteLine}></span>
        </div>
      </section>

      <section className={styles.bottom}>
        <h2 className={styles.bottomTitle}>{content.bottomTitle}</h2>
        <p className={styles.bottomText}>{content.bottomText}</p>
      </section>
    </main>
  );
}
