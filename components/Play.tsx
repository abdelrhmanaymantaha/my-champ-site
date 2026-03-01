type PlayContent = {
  text: string;
};

export default function Play({ content }: { content: PlayContent }) {
  return (
    <p className="max-w-2xl text-lg opacity-80" style={{ color: "var(--color-text)" }}>
      {content.text}
    </p>
  );
}
