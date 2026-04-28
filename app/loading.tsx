export default function Loading() {
  return (
    <main className="page-skeleton" aria-label="Loading page content">
      <section className="skeleton-hero">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--subtitle" />
        <div className="skeleton-stack">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </section>

      <section className="skeleton-section">
        <div className="skeleton-heading" />
        <div className="skeleton-grid">
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
        </div>
      </section>

      <section className="skeleton-section">
        <div className="skeleton-heading" />
        <div className="skeleton-grid">
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-card__media" />
            <div className="skeleton-card__meta">
              <div className="skeleton-line skeleton-line--card" />
              <div className="skeleton-line skeleton-line--tiny" />
            </div>
          </div>
        </div>
      </section>

      <section className="skeleton-section skeleton-section--compact">
        <div className="skeleton-heading" />
        <div className="skeleton-stack">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </section>

      <style>{`
        .page-skeleton {
          min-height: 100vh;
          padding: 120px 24px 96px;
          background: var(--color-bg);
          color: var(--color-text);
        }

        .skeleton-hero,
        .skeleton-section {
          max-width: 1400px;
          margin: 0 auto;
        }

        .skeleton-section {
          padding-top: 72px;
        }

        .skeleton-section--compact {
          padding-bottom: 32px;
        }

        .skeleton-heading,
        .skeleton-line,
        .skeleton-card__media {
          background: linear-gradient(90deg, color-mix(in srgb, var(--color-border) 65%, transparent) 0%, color-mix(in srgb, var(--color-text) 12%, transparent) 50%, color-mix(in srgb, var(--color-border) 65%, transparent) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.35s ease-in-out infinite;
          border-radius: 999px;
        }

        .skeleton-heading {
          width: 220px;
          height: 22px;
          margin-bottom: 32px;
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .skeleton-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-card__media {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 20px;
        }

        .skeleton-card__meta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .skeleton-line {
          height: 14px;
          flex: 1;
        }

        .skeleton-line--title {
          width: min(72vw, 680px);
          height: clamp(64px, 10vw, 120px);
          border-radius: 24px;
          margin-bottom: 18px;
        }

        .skeleton-line--subtitle {
          width: min(42vw, 320px);
          height: 20px;
          margin-bottom: 28px;
        }

        .skeleton-stack {
          display: grid;
          gap: 14px;
          max-width: 900px;
        }

        .skeleton-line--short {
          width: min(36vw, 240px);
        }

        .skeleton-line--card {
          max-width: 180px;
        }

        .skeleton-line--tiny {
          max-width: 64px;
        }

        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 640px) {
          .page-skeleton {
            padding: 104px 16px 72px;
          }

          .skeleton-grid {
            grid-template-columns: 1fr;
          }

          .skeleton-heading {
            width: 180px;
          }

          .skeleton-line--title {
            width: 100%;
          }

          .skeleton-line--subtitle {
            width: 70%;
          }
        }
      `}</style>
    </main>
  );
}