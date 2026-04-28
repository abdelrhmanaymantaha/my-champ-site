import Link from "next/link";

export default function PlayGameNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold mb-4">GIF not found</h1>
      <Link href="/#play" className="opacity-70 hover:opacity-100">
        ← Back to Play
      </Link>
    </main>
  );
}