type PlayContent = {
  text: string;
};

export default function Play({ content }: { content: PlayContent }) {
  return (
    <p className="max-w-2xl text-base sm:text-lg md:text-xl opacity-80 leading-relaxed" style={{ color: "var(--color-text)" }}>
      {content.text}
    </p>
  );
}
