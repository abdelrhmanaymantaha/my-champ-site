"use client";

import Image from "next/image";
import styles from "./about.module.css";

function unwrapNextImageUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return raw;

  try {
    const parsed = new URL(raw, "http://localhost");
    if (parsed.pathname !== "/_next/image") return raw;

    const wrappedUrl = parsed.searchParams.get("url");
    if (!wrappedUrl) return raw;

    try {
      return decodeURIComponent(wrappedUrl).trim() || raw;
    } catch {
      return wrappedUrl.trim() || raw;
    }
  } catch {
    return raw;
  }
}

type AboutContent = {
  title: string;
  subtitle: string;
  image: string;
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
  const imageSrc = unwrapNextImageUrl(content.image || "") || "/me.jpg";
  const isExternalImage = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

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
              src={imageSrc}
              alt="Profile"
              width={500}
              height={600}
              className={styles.image}
              priority
              unoptimized={isExternalImage}
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
