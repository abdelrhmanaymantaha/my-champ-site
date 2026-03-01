"use client";

import { useState } from "react";

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
        className="w-full rounded-lg overflow-hidden border border-[var(--color-border)] mb-12 cursor-zoom-in block text-left"
        style={{ background: "var(--color-card)" }}
      >
        <img
          src={mainImage}
          alt={title}
          className="w-full h-auto object-contain"
        />
      </button>

      {/* Additional images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPreviewSrc(src)}
              className="rounded-lg overflow-hidden border border-[var(--color-border)] aspect-square cursor-zoom-in block text-left"
              style={{ background: "var(--color-card)" }}
            >
              <img
                src={src}
                alt={`${title} - ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewSrc(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={previewSrc}
            alt={title}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
