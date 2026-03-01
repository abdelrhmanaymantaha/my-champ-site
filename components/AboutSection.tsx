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
        <h1 className={styles.title}>
<<<<<<< HEAD
          {firstWord}
          {rest && (
            <>
              <br /> {rest}{" "}
            </>
          )}
          <span className={styles.dash}>{content.subtitle}</span>
=======
          Please <br /> Call Me aleven 
          
          <span className={styles.dash}> — Motion Designer —</span>
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
        </h1>

        <div className={styles.imageWrapper}>
          <Image
            src="/me.jpg"
            alt="Your Name"
            width={500}
            height={600}
            className={styles.image}
          />
        </div>
      </section>

      <section className={styles.aboutText}>
        (about)
        <p className="w-full max-w-none text-6xl font-bold mt-19 opacity-80 whitespace-pre-line">
          {content.mainText}
        </p>
      </section>

      <p className={styles.description}>{content.description}</p>

      <section className={styles.quoteSection}>
        <blockquote>{content.quote}</blockquote>
        <span className={styles.quoteLine}></span>
      </section>

      <section className={styles.bottom}>
        <h2 className="whitespace-pre-line">{content.bottomTitle}</h2>
        <p>{content.bottomText}</p>
      </section>
    </main>
  );
}
