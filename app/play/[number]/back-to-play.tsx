"use client";

export default function BackToPlay() {
  return (
    <button
      type="button"
      className="back-to-play"
      onClick={() => {
        window.location.href = "/#play";
      }}
    >
      ← Back to Play
      <style>{`
        .back-to-play {
          width: fit-content;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </button>
  );
}