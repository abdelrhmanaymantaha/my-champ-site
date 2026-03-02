"use client";

import { useState } from "react";
import styles from "./ProjectGallery.module.css";

type Props = {
  title: string;
  mainImage: string;
  images: string[];
};

export default function ProjectGallery({ title, mainImage, images }: Props) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  return (
    <>
      {/* Main GIF */}
      <button
        type="button"
        onClick={() => setPreviewSrc(mainImage)}
        className={styles.mainImage}
        aria-label={`View ${title} full size`}
      >
        <img
          src={mainImage}
          alt={title}
          loading="lazy"
          className={styles.mainImageImg}
        />
        <div className={styles.mainImageOverlay}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle
              cx="16"
              cy="16"
              r="15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 12V20M12 16H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      {/* Additional images grid */}
      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPreviewSrc(src)}
              className={styles.imageCard}
              aria-label={`View image ${i + 1} of ${title}`}
            >
              <img
                src={src}
                alt={`${title} - ${i + 1}`}
                loading="lazy"
                className={styles.imageCardImg}
              />
              <div className={styles.imageCardOverlay}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 12V20M12 16H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewSrc && (
        <div
          className={styles.previewModal}
          onClick={() => setPreviewSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setPreviewSrc(null)}
            className={styles.closeButton}
            aria-label="Close preview"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 8L24 24M24 8L8 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <img
            src={previewSrc}
            alt={title}
            className={styles.previewImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
