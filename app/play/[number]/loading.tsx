export default function Loading() {
  return (
    <main className="play-game-loading" aria-label="Loading GIF page">
      <div className="play-game-loading__inner">
        <div className="play-game-loading__line play-game-loading__line--back" />
        <div className="play-game-loading__line play-game-loading__line--title" />
        <div className="play-game-loading__frame" />
      </div>

      <style>{`
        .play-game-loading {
          min-height: 100vh;
          padding: 120px 24px 80px;
          background: var(--color-bg);
        }

        .play-game-loading__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
        }

        .play-game-loading__line,
        .play-game-loading__frame {
          background: linear-gradient(90deg, color-mix(in srgb, var(--color-border) 65%, transparent) 0%, color-mix(in srgb, var(--color-text) 12%, transparent) 50%, color-mix(in srgb, var(--color-border) 65%, transparent) 100%);
          background-size: 200% 100%;
          animation: gif-skeleton-shimmer 1.35s ease-in-out infinite;
          border-radius: 20px;
        }

        .play-game-loading__line--back {
          width: 140px;
          height: 18px;
        }

        .play-game-loading__line--title {
          width: min(60vw, 420px);
          height: clamp(48px, 7vw, 84px);
          border-radius: 24px;
        }

        .play-game-loading__frame {
          aspect-ratio: 16 / 9;
        }

        @keyframes gif-skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 640px) {
          .play-game-loading {
            padding: 104px 16px 64px;
          }

          .play-game-loading__line--title {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
