"use client";

import { useEffect, useRef, useState } from "react";

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
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

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
        setGames(Array.isArray(data) ? data : []);
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

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => {
      cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="play-section">
      <div className="play-section__intro">
        <p className="play-text">{content.text}</p>
        <div className="play-section__meta">
          <span className="play-section__label">Games</span>
          <span className="play-section__count">
            {loading ? "Loading..." : `${games.length} uploaded`}
          </span>
        </div>
      </div>

      {loading && <PlaySkeleton />}

      {!loading && error && <p className="play-section__state">{error}</p>}

      {!loading && !error && games.length > 0 && (
        <div className="play-section__content">
          <div className="play-grid" aria-label="Game number grid">
            {games.map((game, index) => (
              <button
                key={game.id}
                type="button"
                className={`play-grid__tile ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => handleSelect(index)}
                aria-label={`Jump to game ${index + 1}`}
              >
                <span className="play-grid__number">{index + 1}</span>
              </button>
            ))}
          </div>

          <div className="play-gallery">
            {games.map((game, index) => (
              <div
                key={game.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`play-gallery__card ${index === activeIndex ? "is-active" : ""}`}
                id={`game-${index + 1}`}
              >
                <div className="play-gallery__media">
                  <img
                    src={game.gif_url}
                    alt={`Game ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="play-gallery__image"
                  />
                </div>
                <div className="play-gallery__info">
                  <span className="play-gallery__index">{index + 1}</span>
                  <span className="play-gallery__hint">Selected from the uploaded games list</span>
                </div>
              </div>
            ))}
          </div>
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
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .play-text {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 400;
          line-height: 1.7;
          color: var(--color-text-muted);
          margin: 0;
          max-width: 65ch;
        }

        .play-section__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          max-width: 520px;
          padding-top: 8px;
          border-top: 1px solid var(--color-border);
        }

        .play-section__label,
        .play-section__count {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .play-section__count {
          color: var(--color-text);
        }

        .play-section__state {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 1rem;
        }

        .play-section__content {
          display: grid;
          gap: 28px;
        }

        .play-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
          gap: 14px;
        }

        .play-grid__tile {
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          background: color-mix(in srgb, var(--color-card) 84%, transparent);
          color: var(--color-text);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .play-grid__tile:hover {
          transform: translateY(-2px);
          border-color: var(--color-text);
        }

        .play-grid__tile.is-active {
          background: var(--color-text);
          color: var(--color-bg);
          border-color: var(--color-text);
        }

        .play-grid__number {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          line-height: 1;
        }

        .play-gallery {
          display: grid;
          gap: 20px;
        }

        .play-gallery__card {
          border: 1px solid var(--color-border);
          border-radius: 24px;
          overflow: hidden;
          background: var(--color-card);
          scroll-margin-top: 120px;
        }

        .play-gallery__card.is-active {
          border-color: var(--color-text);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-text) 45%, transparent);
        }

        .play-gallery__media {
          aspect-ratio: 16 / 9;
          background: #111;
        }

        .play-gallery__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .play-gallery__info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 14px 18px 18px;
        }

        .play-gallery__index {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text);
        }

        .play-gallery__hint {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 640px) {
          .play-grid {
            grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
            gap: 10px;
          }

          .play-grid__tile {
            border-radius: 16px;
          }

          .play-gallery__info {
            flex-direction: column;
            align-items: flex-start;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
          gap: 14px;
        }

        .play-skeleton__tile,
        .play-skeleton__card {
          background: linear-gradient(90deg, color-mix(in srgb, var(--color-border) 65%, transparent) 0%, color-mix(in srgb, var(--color-text) 12%, transparent) 50%, color-mix(in srgb, var(--color-border) 65%, transparent) 100%);
          background-size: 200% 100%;
          animation: play-skeleton-shimmer 1.35s ease-in-out infinite;
          border-radius: 20px;
        }

        .play-skeleton__tile {
          aspect-ratio: 1 / 1;
        }

        .play-skeleton__card {
          aspect-ratio: 16 / 9;
        }

        @media (max-width: 640px) {
          .play-skeleton__grid {
            grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
