type PlayContent = {
  text: string;
};

export default function Play({ content }: { content: PlayContent }) {
  return (
    <div>
      <p className="play-text">{content.text}</p>
      <style>{`
        .play-text {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 400;
          line-height: 1.7;
          color: var(--color-text-muted);
          margin: 0;
          max-width: 65ch;
        }
      `}</style>
    </div>
  );
}
