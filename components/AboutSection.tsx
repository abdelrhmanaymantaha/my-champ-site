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
  const imageSrc = unwrapNextImageUrl(content.image || "") || "/me.jpg";
  const isExternalImage = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <main className={styles.container}>
      <section className={styles.heroGrid}>
        <div className={styles.textContent}>
          <h1 className={styles.giantTitle}>{content.title}</h1>
          <p className={styles.mainDescription}>{content.mainText}</p>
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.imageFrame}>
            <Image
              src={imageSrc}
              alt="Profile"
              width={800}
              height={1000}
              className={styles.image}
              priority
              unoptimized={isExternalImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.quoteSection}>
        <h2 className={styles.hugeQuote}>{content.quote}</h2>
      </section>
    </main>
  );
}
