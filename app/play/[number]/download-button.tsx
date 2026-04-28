"use client";

export default function DownloadButton({
  gifUrl,
  gifNumber,
}: {
  gifUrl: string;
  gifNumber: number;
}) {
  const handleDownload = async () => {
    try {
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gif-${gifNumber}.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download GIF:", error);
    }
  };

  return (
    <>
      <button onClick={handleDownload} className="download-btn">
        ⬇ Download GIF
      </button>
      <style>{`
        .download-btn {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 60;
          padding: 8px 16px;
          background: var(--color-text);
          color: var(--color-bg);
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s ease;
          width: fit-content;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
        }

        .download-btn:hover {
          opacity: 0.8;
        }

        .download-btn:active {
          opacity: 0.7;
        }

        @media (max-width: 640px) {
          .download-btn {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </>
  );
}
