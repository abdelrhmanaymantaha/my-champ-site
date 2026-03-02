"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type AboutContent = {
  title: string;
  subtitle: string;
  mainText: string;
  description: string;
  quote: string;
  bottomTitle: string;
  bottomText: string;
};

type Project = {
  id?: number;
  title: string;
  slug: string;
  gif: string;
  description?: string;
  images?: string[];
};

type ProjectsContent = {
  branding: Project[];
  motion: Project[];
};

type HeroContent = {
  title: string;
  tagline: string;
  bulletPoints: string[];
};

type PlayContent = {
  text: string;
};

type NavbarContent = {
  name: string;
  location: string;
};

type SectionsContent = {
  about: string;
  projects: string;
  play: string;
};

type Content = {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  play: PlayContent;
  navbar: NavbarContent;
  sections: SectionsContent;
};

export default function AdminDashboardPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newProject, setNewProject] = useState({ title: "", slug: "", description: "", gif: "", images: [] as string[], section: "branding" as "branding" | "motion" });
  const [editingProject, setEditingProject] = useState<{ section: "branding" | "motion"; index: number } | null>(null);
  const [editProjectDraft, setEditProjectDraft] = useState<Project | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setMessage({ type: "error", text: "Failed to load content" }))
      .finally(() => setLoading(false));
  }, []);

  const save = async (payload: Partial<Content>) => {
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setContent({ ...content, ...payload });
      setMessage({ type: "success", text: "Saved!" });
      setEditingProject(null);
      setEditProjectDraft(null);
    } catch {
      setMessage({ type: "error", text: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const saveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    save({ hero: content.hero });
  };

  const saveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    save({ about: content.about });
  };

  const savePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    save({ play: content.play });
  };

  const saveNavbar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    save({ navbar: content.navbar });
  };

  const saveSections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    save({ sections: content.sections });
  };

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const compressImage = (file: File): Promise<File> => {
    // Only compress regular images; keep GIFs as-is to avoid breaking animation
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      return Promise.resolve(file);
    }
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          resolve(file);
          return;
        }
        img.src = e.target.result as string;
      };

      reader.onerror = () => resolve(file);

      img.onload = () => {
        const maxSize = 1600; // max width/height
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const quality = 0.72;

        // Prefer AVIF (smaller) if supported; fall back to WebP.
        canvas.toBlob(
          (avifBlob) => {
            if (avifBlob) {
              const optimized = new File([avifBlob], file.name.replace(/\.[^.]+$/, ".avif"), {
                type: "image/avif",
              });
              resolve(optimized);
              return;
            }
            canvas.toBlob(
              (webpBlob) => {
                if (!webpBlob) {
                  resolve(file);
                  return;
                }
                const optimized = new File([webpBlob], file.name.replace(/\.[^.]+$/, ".webp"), {
                  type: "image/webp",
                });
                resolve(optimized);
              },
              "image/webp",
              0.8
            );
          },
          "image/avif",
          quality
        );
      };

      img.onerror = () => resolve(file);

      reader.readAsDataURL(file);
    });
  };

  const uploadOneImage = async (file: File, setUploading: (v: boolean) => void): Promise<string | null> => {
    const optimized = await compressImage(file);
    const formData = new FormData();
    formData.append("file", optimized);
    setUploading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data.error ?? data.detail ?? "Upload failed";
        setMessage({ type: "error", text: typeof err === "string" ? err : JSON.stringify(err) });
        return null;
      }
      const urls = data.urls as string[] | undefined;
      const url = urls?.[0];
      if (url) return url;
      setMessage({ type: "error", text: "No URL returned from upload" });
      return null;
    } catch {
      setMessage({ type: "error", text: "Failed to upload image" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadCoverImage = (file: File) => uploadOneImage(file, setUploadingCover);

  const uploadMultipleImages = async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];
    if (fileArray.length === 1) {
      const url = await uploadOneImage(fileArray[0], setUploadingImages);
      return url ? [url] : [];
    }
    setUploadingImages(true);
    setMessage(null);
    try {
      const formData = new FormData();
      for (const file of fileArray) {
        const optimized = await compressImage(file);
        formData.append("files", optimized);
      }
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data.error ?? data.detail ?? "Upload failed";
        setMessage({ type: "error", text: typeof err === "string" ? err : JSON.stringify(err) });
        return [];
      }
      const urls = (data.urls as string[]) ?? [];
      return urls;
    } catch {
      setMessage({ type: "error", text: "Failed to upload images" });
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const refetchContent = async () => {
    const res = await fetch("/api/admin/content");
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    }
  };

  const doAddProject = async () => {
    if (!content) return;
    if (!newProject.title.trim() || !newProject.gif.trim()) {
      setMessage({ type: "error", text: "Please enter a project title and GIF/Image URL." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProject.title.trim(),
          slug: (newProject.slug?.trim() || slugify(newProject.title.trim())),
          description: (newProject.description ?? "").trim(),
          gif: newProject.gif.trim(),
          images: newProject.images ?? [],
          project_type: newProject.section,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.detail ?? data.message ?? data.error ?? "Failed to add project";
        const text = Array.isArray(msg) ? msg.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join(", ") : String(msg);
        throw new Error(text);
      }
      setNewProject({ title: "", slug: "", description: "", gif: "", images: [], section: "branding" });
      setMessage({ type: "success", text: "Project added!" });
      await refetchContent();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to add project" });
    } finally {
      setSaving(false);
    }
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    void doAddProject();
  };

  const startEditProject = (section: "branding" | "motion", index: number) => {
    if (!content) return;
    const p = content.projects[section][index];
    setEditProjectDraft({
      title: p.title,
      slug: p.slug ?? slugify(p.title),
      gif: p.gif,
      description: p.description ?? "",
      images: p.images ?? [],
    });
    setEditingProject({ section, index });
  };

  const saveEditedProject = async () => {
    if (!content || !editingProject || !editProjectDraft) return;
    const p = content.projects[editingProject.section][editingProject.index];
    const id = p.id;
    if (id == null) {
      setMessage({ type: "error", text: "Project has no id" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editProjectDraft.title,
          slug: editProjectDraft.slug,
          description: (editProjectDraft.description ?? "").trim(),
          gif: editProjectDraft.gif,
          images: editProjectDraft.images ?? [],
          project_type: editingProject.section,
        }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      setEditingProject(null);
      setEditProjectDraft(null);
      setMessage({ type: "success", text: "Project updated!" });
      await refetchContent();
    } catch {
      setMessage({ type: "error", text: "Failed to update project" });
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (section: "branding" | "motion", index: number) => {
    if (!content) return;
    const p = content.projects[section][index];
    const id = p.id;
    if (id == null) {
      setMessage({ type: "error", text: "Project has no id" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setMessage({ type: "success", text: "Project deleted!" });
      await refetchContent();
    } catch {
      setMessage({ type: "error", text: "Failed to delete project" });
    } finally {
      setSaving(false);
    }
  };

  const addBulletPoint = () => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        bulletPoints: [...content.hero.bulletPoints, ""],
      },
    });
  };

  const removeBulletPoint = (index: number) => {
    if (!content || content.hero.bulletPoints.length <= 1) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        bulletPoints: content.hero.bulletPoints.filter((_, i) => i !== index),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <p className="opacity-70">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <p className="opacity-70">Failed to load</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-sm opacity-70 hover:opacity-100">
            ← View site
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="text-sm opacity-70 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`mb-6 text-sm ${
            message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Hero */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Hero Section</h2>
        <form onSubmit={saveHero} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tagline</label>
            <input
              value={content.hero.tagline}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bullet Points</label>
            {content.hero.bulletPoints.map((bp, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  value={bp}
                  onChange={(e) => {
                    const pts = [...content.hero.bulletPoints];
                    pts[i] = e.target.value;
                    setContent({ ...content, hero: { ...content.hero, bulletPoints: pts } });
                  }}
                  rows={2}
                  className="flex-1 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                />
                <button
                  type="button"
                  onClick={() => removeBulletPoint(i)}
                  className="text-red-500 hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addBulletPoint} className="text-sm opacity-70 hover:opacity-100 mt-2">
              + Add bullet
            </button>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </form>
      </section>

      {/* Navbar */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Navbar</h2>
        <form onSubmit={saveNavbar} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              value={content.navbar.name}
              onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, name: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              value={content.navbar.location}
              onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, location: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
          >
            Save Navbar
          </button>
        </form>
      </section>

      {/* Section Titles */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Section Titles</h2>
        <form onSubmit={saveSections} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">About</label>
            <input
              value={content.sections.about}
              onChange={(e) => setContent({ ...content, sections: { ...content.sections, about: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Projects</label>
            <input
              value={content.sections.projects}
              onChange={(e) => setContent({ ...content, sections: { ...content.sections, projects: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Play</label>
            <input
              value={content.sections.play}
              onChange={(e) => setContent({ ...content, sections: { ...content.sections, play: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
          >
            Save Section Titles
          </button>
        </form>
      </section>

      {/* About */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">About Section</h2>
        <form onSubmit={saveAbout} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              value={content.about.title}
              onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Subtitle</label>
            <input
              value={content.about.subtitle}
              onChange={(e) => setContent({ ...content, about: { ...content.about, subtitle: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Main Text</label>
            <textarea
              value={content.about.mainText}
              onChange={(e) => setContent({ ...content, about: { ...content.about, mainText: e.target.value } })}
              rows={6}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={content.about.description}
              onChange={(e) => setContent({ ...content, about: { ...content.about, description: e.target.value } })}
              rows={3}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Quote</label>
            <textarea
              value={content.about.quote}
              onChange={(e) => setContent({ ...content, about: { ...content.about, quote: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bottom Title</label>
            <input
              value={content.about.bottomTitle}
              onChange={(e) => setContent({ ...content, about: { ...content.about, bottomTitle: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bottom Text</label>
            <input
              value={content.about.bottomText}
              onChange={(e) => setContent({ ...content, about: { ...content.about, bottomText: e.target.value } })}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
          >
            Save About
          </button>
        </form>
      </section>

      {/* Play */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Play Section</h2>
        <form onSubmit={savePlay} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Text</label>
            <textarea
              value={content.play.text}
              onChange={(e) => setContent({ ...content, play: { ...content.play, text: e.target.value } })}
              rows={3}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
          >
            Save Play
          </button>
        </form>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Projects</h2>
        <p className="text-sm opacity-70 mb-4">
          Project schema: <strong>title</strong>, <strong>slug</strong> (URL), <strong>description</strong>, <strong>cover (gif)</strong>, <strong>images</strong> (list). Additional images can be added when editing.
        </p>
        <form onSubmit={addProject} className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Project title"
                value={newProject.title}
                onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                className="flex-1 min-w-[200px] px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                aria-label="Project title"
              />
              <select
                value={newProject.section}
                onChange={(e) => setNewProject((prev) => ({ ...prev, section: e.target.value as "branding" | "motion" }))}
                className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                aria-label="Project section"
              >
                <option value="branding">Branding</option>
                <option value="motion">Motion</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">URL slug (optional)</label>
              <input
                type="text"
                placeholder="Leave empty to generate from title (e.g. my-project → /project/my-project)"
                value={newProject.slug}
                onChange={(e) => setNewProject((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                aria-label="URL slug"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cover image (gif) — required</label>
              {newProject.gif ? (
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                    <img src={newProject.gif} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewProject((prev) => ({ ...prev, gif: "" }))}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/90 text-white text-sm leading-none flex items-center justify-center hover:bg-red-600 shadow"
                    aria-label="Remove cover image"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90">
                  <input
                    type="file"
                    accept="image/*,.gif"
                    className="sr-only"
                    disabled={uploadingCover}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadCoverImage(file);
                      if (url) setNewProject((prev) => ({ ...prev, gif: url }));
                      e.target.value = "";
                    }}
                  />
                  {uploadingCover ? "Uploading…" : newProject.gif ? "Change cover" : "Upload from PC"}
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Description (optional)</label>
              <textarea
                placeholder="Short project description..."
                value={newProject.description}
                onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                aria-label="Project description"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Images (optional) — gallery images</label>
              {(newProject.images?.length ?? 0) > 0 && (
                <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
                  {(newProject.images ?? []).map((url, idx) => (
                    <li key={`${url}-${idx}`} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewProject((prev) => ({
                            ...prev,
                            images: (prev.images ?? []).filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/90 text-white text-xs leading-none flex items-center justify-center hover:bg-red-600 shadow"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 items-center">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90">
                  <input
                    type="file"
                    accept="image/*,.gif"
                    multiple
                    className="sr-only"
                    disabled={uploadingImages}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      const urls = await uploadMultipleImages(files);
                      if (urls.length) setNewProject((prev) => ({ ...prev, images: [...(prev.images ?? []), ...urls] }));
                      e.target.value = "";
                    }}
                  />
                  {uploadingImages ? "Uploading…" : "Add more images"}
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={saving || uploadingCover || uploadingImages}
                onClick={doAddProject}
                className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
              >
                {saving ? "Adding…" : "Add Project"}
              </button>
            </div>
          </div>
        </form>

        {(["branding", "motion"] as const).map((section) => (
          <div key={section} className="mb-12">
            <h3 className="text-lg font-medium mb-4 capitalize">{section} Projects</h3>
            <ul className="space-y-4">
              {content.projects[section].map((p, i) => (
                <li key={`${section}-${i}`} className="p-4 border border-[var(--color-border)] rounded-lg">
                  {editingProject?.section === section && editingProject?.index === i && editProjectDraft ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1">Title</label>
                        <input
                          value={editProjectDraft.title}
                          onChange={(e) => setEditProjectDraft({ ...editProjectDraft, title: e.target.value })}
                          className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                          placeholder="Project title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">URL slug (used in /project/your-slug)</label>
                        <input
                          value={editProjectDraft.slug}
                          onChange={(e) => setEditProjectDraft({ ...editProjectDraft, slug: e.target.value })}
                          className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                          placeholder="e.g. abyan-trading"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Cover (gif)</label>
                        {editProjectDraft.gif ? (
                          <div className="relative inline-block mb-2">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                              <img src={editProjectDraft.gif} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditProjectDraft({ ...editProjectDraft, gif: "" })}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/90 text-white text-sm leading-none flex items-center justify-center hover:bg-red-600 shadow"
                              aria-label="Remove cover image"
                            >
                              ×
                            </button>
                          </div>
                        ) : null}
                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90 text-sm">
                          <input
                            type="file"
                            accept="image/*,.gif"
                            className="sr-only"
                            disabled={uploadingCover}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await uploadCoverImage(file);
                              if (url && editProjectDraft) setEditProjectDraft({ ...editProjectDraft, gif: url });
                              e.target.value = "";
                            }}
                          />
                          {uploadingCover ? "Uploading…" : editProjectDraft.gif ? "Change cover" : "Upload from PC"}
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Description</label>
                        <textarea
                          value={editProjectDraft.description ?? ""}
                          onChange={(e) => setEditProjectDraft({ ...editProjectDraft, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
                          placeholder="Project description..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Images (gallery)</label>
                        {(editProjectDraft.images?.length ?? 0) > 0 && (
                          <ul className="flex flex-wrap gap-3 list-none p-0 m-0 mb-2">
                            {(editProjectDraft.images ?? []).map((url, idx) => (
                              <li key={`${url}-${idx}`} className="relative group">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditProjectDraft({
                                      ...editProjectDraft,
                                      images: (editProjectDraft.images ?? []).filter((_, i) => i !== idx),
                                    })
                                  }
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/90 text-white text-xs leading-none flex items-center justify-center hover:bg-red-600 shadow"
                                  aria-label="Remove image"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90 text-sm">
                          <input
                            type="file"
                            accept="image/*,.gif"
                            multiple
                            className="sr-only"
                            disabled={uploadingImages}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files?.length) return;
                              const urls = await uploadMultipleImages(files);
                              if (urls.length) setEditProjectDraft({ ...editProjectDraft, images: [...(editProjectDraft.images ?? []), ...urls] });
                              e.target.value = "";
                            }}
                          />
                          {uploadingImages ? "Uploading…" : "Add more images"}
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveEditedProject}
                          disabled={saving}
                          className="px-4 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded text-sm disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingProject(null); setEditProjectDraft(null); }}
                          className="px-4 py-2 border border-[var(--color-border)] rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProject(section, i)}
                          className="text-red-600 dark:text-red-400 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{p.title}</span>
                        <span className="text-sm opacity-60 ml-2">/project/{p.slug || "—"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/project/${p.slug || ""}`}
                          target="_blank"
                          className="text-sm opacity-70 hover:opacity-100"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => startEditProject(section, i)}
                          className="text-sm opacity-70 hover:opacity-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeProject(section, i)}
                          disabled={saving}
                          className="text-red-600 dark:text-red-400 text-sm hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
