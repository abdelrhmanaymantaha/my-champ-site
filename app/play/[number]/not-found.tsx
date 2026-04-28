import Link from "next/link";
import BackToPlay from "./back-to-play";

export default function PlayGameNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold mb-4">GIF not found</h1>
      <BackToPlay />
    </main>
  );
}