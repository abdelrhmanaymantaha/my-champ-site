import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10">
      <h1 className="text-2xl font-bold mb-4">Project not found</h1>
      <Link href="/#projects" className="opacity-70 hover:opacity-100">
        ← Back to projects
      </Link>
    </div>
  );
}
