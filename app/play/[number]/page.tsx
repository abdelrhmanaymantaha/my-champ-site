import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGamesFromApi } from "@/lib/games-api";

type Props = {
  params: Promise<{ number: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { number } = await params;
  const index = Number.parseInt(number, 10);
  if (!Number.isFinite(index) || index < 1) {
    return { title: "GIF not found" };
  }
  return { title: `GIF ${index} | Champ Studio` };
}

export default async function PlayGamePage({ params }: Props) {
  const { number } = await params;
  const index = Number.parseInt(number, 10);

  if (!Number.isFinite(index) || index < 1) {
    notFound();
  }

  const games = await fetchGamesFromApi();
  const game = games[index - 1];

  if (!game) {
    notFound();
  }

  return (
    <main className="play-game-page">
      <div className="play-game-page__inner">
        <Link href="/#play" className="play-game-page__back">
          ← Back to Play
        </Link>

        <div className="play-game-page__header">
          <p className="play-game-page__eyebrow">GIF {index}</p>
          <h1 className="play-game-page__title">Uploaded game {index}</h1>
        </div>

        <div className="play-game-page__frame">
          <img src={game.gif_url} alt={`GIF ${index}`} className="play-game-page__image" />
        </div>
      </div>

      <style>{`
        .play-game-page {
          min-height: 100vh;
          padding: 120px 24px 80px;
          background: var(--color-bg);
          color: var(--color-text);
        }

        .play-game-page__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 28px;
        }

        .play-game-page__back {
          width: fit-content;
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .play-game-page__header {
          display: grid;
          gap: 10px;
        }

        .play-game-page__eyebrow {
          margin: 0;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .play-game-page__title {
          margin: 0;
          font-size: clamp(2.4rem, 5vw, 5rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .play-game-page__frame {
          border: 1px solid var(--color-border);
          border-radius: 28px;
          overflow: hidden;
          background: var(--color-card);
        }

        .play-game-page__image {
          width: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 16 / 9;
        }

        @media (max-width: 640px) {
          .play-game-page {
            padding: 104px 16px 64px;
          }

          .play-game-page__frame {
            border-radius: 20px;
          }
        }
      `}</style>
    </main>
  );
}