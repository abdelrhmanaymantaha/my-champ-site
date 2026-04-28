"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PlayContent = {
  text: string;
};

type GameGif = {
  id: number;
  gif_url: string;
};

function getGamesEndpoint() {
  const baseUrl = process.env.NEXT_PUBLIC_GAMES_API_BASE_URL?.replace(/\/$/, "");
  return baseUrl ? `${baseUrl}/api/games` : "/api/games";
}

export default function Play({ content }: { content: PlayContent }) {
  const [games, setGames] = useState<GameGif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(getGamesEndpoint(), {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load games (${response.status})`);
        }

        const data = (await response.json()) as GameGif[];
        const nextGames = Array.isArray(data) ? data : [];
        setGames(nextGames);
        setActiveIndex(0);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load games");
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    loadGames();

    return () => controller.abort();
  }, []);

  const activeGame = games[activeIndex] ?? games[0] ?? null;

  return (
    <div className="play-section">
      <div className="play-section__intro">
        <p className="play-text">{content.text}</p>
        <span className="play-section__label">Games</span>
      </div>

      {loading && <PlaySkeleton />}

      {!loading && error && <p className="play-section__state">{error}</p>}

      {!loading && !error && games.length > 0 && (
        <div className="play-section__content">
          {activeGame && (
            <div className="play-preview" aria-live="polite">
              <div className="play-preview__frame">
                <img
                  src={activeGame.gif_url}
                  alt={`Game ${activeIndex + 1}`}
                  className="play-preview__image"
                />
                <div className="play-preview__overlay" aria-label="Game number selector">
                  <div className="play-grid">
                    {games.map((game, index) => (
                      <Link
                        key={game.id}
                        href={`/play/${index + 1}`}
                        className={`play-grid__tile ${index === activeIndex ? "is-active" : ""}`}
                        aria-label={`Open game ${index + 1}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onFocus={() => setActiveIndex(index)}
                      >
                        <span className="play-grid__number">{String(index + 1).padStart(3, "0")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <p className="play-section__state">No games have been uploaded yet.</p>
      )}

      <style>{`
        .play-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .play-section__intro {
          display: grid;
          gap: 14px;
        }

        .play-text {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 400;
          line-height: 1.7;
          color: var(--color-text-muted);
          margin: 0;
          max-width: 65ch;
        }

        .play-section__label {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .play-section__state {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 1rem;
        }

        .play-section__content {
          display: grid;
          gap: 24px;
        }

        .play-grid {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px 10px;
          justify-content: center;
          align-items: center;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }

        .play-grid::-webkit-scrollbar {
          height: 8px;
        }

        .play-grid::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--color-border) 60%, transparent);
          border-radius: 999px;
        }

        .play-grid__tile {
          flex: 0 0 auto;
          width: 64px;
          height: 64px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: color-mix(in srgb, var(--color-card) 88%, transparent);
          display: grid;
          place-items: center;
          cursor: pointer;
          text-decoration: none;
          scroll-snap-align: center;
          transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .play-grid__tile:hover,
        .play-grid__tile.is-active {
          transform: translateY(-3px) scale(1.03);
          border-color: var(--color-text);
          background: color-mix(in srgb, var(--color-card) 92%, transparent);
        }

        .play-grid__number {
          font-size: 1rem;
          font-weight: 800;
          line-height: 1;
          color: var(--color-text);
        }

        .play-preview {
          display: grid;
          gap: 14px;
          justify-items: center;
        }

        .play-preview__frame {
          position: relative;
          width: min(100%, 860px);
          border-radius: 24px;
          border: 1px solid var(--color-border);
          background: var(--color-card);
          overflow: hidden;
        }

        .play-preview__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.28));
          backdrop-filter: blur(2px);
        }

        .play-preview__image {
          display: block;
          width: 100%;
          max-height: 460px;
          object-fit: contain;
          background: #050505;
        }

        @media (max-width: 640px) {
          .play-grid {
            justify-content: center;
            gap: 10px;
          }

          .play-grid__tile {
            width: 54px;
            height: 54px;
          }

          .play-grid__number {
            font-size: 0.9rem;
          }

          .play-preview__frame {
            border-radius: 18px;
          }

          .play-preview__overlay {
            padding: 12px;
          }
        }

        @keyframes play-skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

function PlaySkeleton() {
  return (
    <div className="play-skeleton" aria-hidden="true">
      <div className="play-skeleton__grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="play-skeleton__tile" />
        ))}
      </div>
      <div className="play-skeleton__card" />

      <style>{`
        .play-skeleton {
          display: grid;
          gap: 24px;
        }

        .play-skeleton__grid {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .play-skeleton__tile,
        .play-skeleton__card {
          background: linear-gradient(90deg, color-mix(in srgb, var(--color-border) 65%, transparent) 0%, color-mix(in srgb, var(--color-text) 12%, transparent) 50%, color-mix(in srgb, var(--color-border) 65%, transparent) 100%);
          background-size: 200% 100%;
          animation: play-skeleton-shimmer 1.35s ease-in-out infinite;
          border-radius: 20px;
        }

        .play-skeleton__tile {
          width: 56px;
          height: 56px;
          border-radius: 999px;
        }

        .play-skeleton__card {
          height: 320px;
        }

        @media (max-width: 640px) {
          .play-skeleton__card {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
