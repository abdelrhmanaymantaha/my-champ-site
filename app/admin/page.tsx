"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type AboutContent = {
  title: string;
  subtitle: string;
  image: string;
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

type SocialMedia = {
  linkedin?: string;
  behance?: string;
  facebook?: string;
  instagram?: string;
};

type GameGif = {
  id: number;
  gif_url: string;
};

type Content = {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  play: PlayContent;
  navbar: NavbarContent;
  sections: SectionsContent;
  socialMedia: SocialMedia;
};

export default function AdminDashboardPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<GameGif[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newProject, setNewProject] = useState({ title: "", slug: "", description: "", gif: "", images: [] as string[], section: "branding" as "branding" | "motion" });
  const [editingProject, setEditingProject] = useState<{ section: "branding" | "motion"; index: number } | null>(null);
  const [editProjectDraft, setEditProjectDraft] = useState<Project | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [imageProgressMap, setImageProgressMap] = useState<Record<string, number>>({});
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [aboutImageProgress, setAboutImageProgress] = useState(0);
  const [newGameGif, setNewGameGif] = useState("");
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editGameGif, setEditGameGif] = useState("");
  const [uploadingGameGif, setUploadingGameGif] = useState(false);
  const [gameGifProgress, setGameGifProgress] = useState(0);
  const [gamesSaving, setGamesSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setMessage({ type: "error", text: "Failed to load content" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setGamesLoading(true);
        const res = await fetch("/api/games", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load games");
        const data = (await res.json()) as GameGif[];
        setGames(Array.isArray(data) ? data : []);
      } catch {
        setGames([]);
      } finally {
        setGamesLoading(false);
      }
    };

    void loadGames();
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

  const saveAllContent = () => {
    if (!content) return;
    save({
      hero: content.hero,
      navbar: content.navbar,
      sections: content.sections,
      socialMedia: content.socialMedia,
      about: content.about,
      play: content.play,
    });
  };

  const slugify = (t: string) => {
    const base = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    // Keep slug always non-empty for stricter backend validation.
    return base || `project-${Date.now()}`;
  };

  const normalizeProjectType = (section: string): "branding" | "motion" => {
    return section === "motion" ? "motion" : "branding";
  };

  const normalizeImageList = (images: string[] | undefined): string[] => {
    if (!images?.length) return [];
    return images.map((s) => s.trim()).filter(Boolean);
  };

  const uploadOneImage = async (
    setUploading: (v: boolean) => void,
    setProgress?: (pct: number) => void,
    file?: File,
    uploadPath = "/api/upload"
  ): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setMessage(null);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadPath);
      xhr.responseType = "text";

      xhr.upload.onprogress = (event) => {
        if (setProgress && event.lengthComputable && event.total > 0) {
          // Cap at 90% during upload, leave 10% for server processing
          const pct = Math.max(0, Math.min(90, Math.round((event.loaded / event.total) * 90)));
          setProgress(pct);
        }
      };

      return new Promise((resolve) => {
        xhr.onload = () => {
          try {
            // Set progress to 100% once response is received
            if (setProgress) setProgress(100);
            
            const text = xhr.responseText || "{}";
            console.log("Upload response status:", xhr.status);
            console.log("Upload response text:", text);
            
            const data = JSON.parse(text) as { urls?: string[]; error?: unknown; detail?: unknown };
            if (xhr.status >= 200 && xhr.status < 300) {
              const urls = data.urls as string[] | undefined;
              const url = urls?.[0];
              if (url) {
                console.log("Upload successful, URL:", url);
                resolve(url);
                return;
              }
              console.log("Upload response has no urls array:", data);
              // Surface backend response to the user so debugging is easier
              const detailText = JSON.stringify(data);
              setMessage({ type: "error", text: "No URL returned from upload: " + detailText });
            } else {
              const err = data.error ?? data.detail ?? `Upload failed (${xhr.status})`;
              console.error("Upload error:", err);
              setMessage({ type: "error", text: typeof err === "string" ? err : JSON.stringify(err) });
            }
            resolve(null);
          } catch (e) {
            console.error("Parse error:", e);
            setMessage({ type: "error", text: "Invalid response from upload: " + String(e) });
            resolve(null);
          } finally {
            setUploading(false);
            // Small delay before clearing progress
            setTimeout(() => {
              if (setProgress) setProgress(0);
            }, 500);
          }
        };

        xhr.onerror = () => {
          console.error("Network error during upload");
          setMessage({ type: "error", text: "Network error during upload" });
          setUploading(false);
          if (setProgress) setProgress(0);
          resolve(null);
        };

        xhr.ontimeout = () => {
          console.error("Upload timeout");
          setMessage({ type: "error", text: "Upload timeout - try again" });
          setUploading(false);
          if (setProgress) setProgress(0);
          resolve(null);
        };

        xhr.send(formData);
      });
    } catch {
      setMessage({ type: "error", text: "Failed to upload image" });
      setUploading(false);
      if (setProgress) setProgress(0);
      return null;
    }
  };

  const uploadCoverImage = (file: File) => uploadOneImage(setUploadingCover, setCoverProgress, file);
  const uploadAboutImage = (file: File) => uploadOneImage(setUploadingAboutImage, setAboutImageProgress, file);
  // Use the generic upload proxy (`/api/upload`) which rewrites public URLs
  // This matches the working tester page and ensures URLs are returned.
  const uploadGameImage = (file: File) => uploadOneImage(setUploadingGameGif, setGameGifProgress, file, "/api/upload");

  const refetchGames = async () => {
    const res = await fetch("/api/games", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as GameGif[];
      setGames(Array.isArray(data) ? data : []);
    }
  };

  const addGame = async () => {
    const gif_url = newGameGif.trim();
    if (!gif_url) {
      setMessage({ type: "error", text: "Please upload or paste a GIF URL." });
      return;
    }
    setGamesSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gif_url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as { detail?: unknown; message?: unknown; error?: unknown }).detail
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).message
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).error
          ?? "Failed to add game";
        const text = Array.isArray(msg) ? msg.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join(", ") : String(msg);
        throw new Error(text);
      }
      setNewGameGif("");
      setMessage({ type: "success", text: "Game added!" });
      await refetchGames();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to add game" });
    } finally {
      setGamesSaving(false);
    }
  };

  const startEditGame = (game: GameGif) => {
    setEditingGameId(game.id);
    setEditGameGif(game.gif_url);
  };

  const saveEditedGame = async () => {
    if (editingGameId == null) return;
    const gif_url = editGameGif.trim();
    if (!gif_url) {
      setMessage({ type: "error", text: "Please provide a GIF URL." });
      return;
    }
    setGamesSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/games/${editingGameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gif_url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as { detail?: unknown; message?: unknown; error?: unknown }).detail
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).message
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).error
          ?? "Failed to update game";
        const text = Array.isArray(msg) ? msg.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join(", ") : String(msg);
        throw new Error(text);
      }
      setEditingGameId(null);
      setEditGameGif("");
      setMessage({ type: "success", text: "Game updated!" });
      await refetchGames();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update game" });
    } finally {
      setGamesSaving(false);
    }
  };

  const removeGame = async (gameId: number) => {
    setGamesSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/games/${gameId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete game");
      setMessage({ type: "success", text: "Game deleted!" });
      if (editingGameId === gameId) {
        setEditingGameId(null);
        setEditGameGif("");
      }
      await refetchGames();
    } catch {
      setMessage({ type: "error", text: "Failed to delete game" });
    } finally {
      setGamesSaving(false);
    }
  };

  const uploadMultipleImages = async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];
    
    setUploadingImages(true);
    setMessage(null);
    
    // Initialize progress map
    const initMap: Record<string, number> = {};
    fileArray.forEach((_, idx) => {
      initMap[`file-${idx}`] = 0;
    });
    setImageProgressMap(initMap);

    try {
      // Upload with concurrency limit of 3 files at a time
      const concurrencyLimit = 3;
      const results: (string | null)[] = new Array(fileArray.length).fill(null);
      
      const uploadFile = async (idx: number) => {
        const file = fileArray[idx];
        const key = `file-${idx}`;
        const url = await uploadOneImage(setUploadingImages, (pct) => {
          setImageProgressMap((prev) => ({ ...prev, [key]: pct }));
        }, file);
        results[idx] = url;
      };

      // Create upload tasks
      const uploadTasks = fileArray.map((_, idx) => uploadFile(idx));
      
      // Execute with concurrency limit
      for (let i = 0; i < uploadTasks.length; i += concurrencyLimit) {
        const batch = uploadTasks.slice(i, i + concurrencyLimit);
        await Promise.all(batch);
      }

      return results.filter((url) => url !== null) as string[];
    } catch {
      setMessage({ type: "error", text: "Failed to upload images" });
      return [];
    } finally {
      setUploadingImages(false);
      setImageProgressMap({});
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
      const title = newProject.title.trim();
      const slug = (newProject.slug?.trim() || slugify(title)).trim();
      const description = (newProject.description ?? "").trim();
      const gif = newProject.gif.trim();
      const images = normalizeImageList(newProject.images);
      const project_type = normalizeProjectType(newProject.section);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          gif,
          images,
          project_type,
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
      const title = editProjectDraft.title.trim();
      const slug = (editProjectDraft.slug?.trim() || slugify(title)).trim();
      const description = (editProjectDraft.description ?? "").trim();
      const gif = editProjectDraft.gif.trim();
      const images = normalizeImageList(editProjectDraft.images);
      const project_type = normalizeProjectType(editingProject.section);

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          gif,
          images,
          project_type,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as { detail?: unknown; message?: unknown; error?: unknown }).detail
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).message
          ?? (data as { detail?: unknown; message?: unknown; error?: unknown }).error
          ?? "Failed to update project";
        const text = Array.isArray(msg) ? msg.map((x: { msg?: string }) => x.msg ?? JSON.stringify(x)).join(", ") : String(msg);
        throw new Error(text);
      }
      setEditingProject(null);
      setEditProjectDraft(null);
      setMessage({ type: "success", text: "Project updated!" });
      await refetchContent();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update project" });
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">Admin</p>
            <h1 className="text-lg sm:text-xl font-semibold">Content Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm opacity-70 hover:opacity-100">
              View site
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
            <button
              type="button"
              onClick={saveAllContent}
              disabled={saving || uploadingCover || uploadingImages || uploadingAboutImage}
              className="px-5 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-20">
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
        <div className="space-y-4">
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
        </div>
      </section>

      {/* Navbar */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Navbar</h2>
        <div className="space-y-4">
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
        </div>
      </section>

      {/* Section Titles */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Section Titles</h2>
        <div className="space-y-4">
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
        </div>
      </section>

      {/* Social Media */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={content.socialMedia?.linkedin || ""}
              onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, linkedin: e.target.value } })}
              placeholder="https://www.linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Behance URL</label>
            <input
              type="url"
              value={content.socialMedia?.behance || ""}
              onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, behance: e.target.value } })}
              placeholder="https://www.behance.net/yourprofile"
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Facebook URL</label>
            <input
              type="url"
              value={content.socialMedia?.facebook || ""}
              onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, facebook: e.target.value } })}
              placeholder="https://www.facebook.com/yourprofile"
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Instagram URL</label>
            <input
              type="url"
              value={content.socialMedia?.instagram || ""}
              onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, instagram: e.target.value } })}
              placeholder="https://www.instagram.com/yourprofile"
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">About Section</h2>
        <div className="space-y-4">
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
          <div className="space-y-2">
            <label className="block text-sm mb-1">Profile Image</label>
            {(content.about.image || "").trim() ? (
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                  <img src={content.about.image} alt="About profile" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setContent({ ...content, about: { ...content.about, image: "" } })}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/90 text-white text-sm leading-none flex items-center justify-center hover:bg-red-600 shadow"
                  aria-label="Remove about image"
                >
                  ×
                </button>
              </div>
            ) : null}
            {aboutImageProgress > 0 && aboutImageProgress < 100 && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs opacity-60">
                  <span>Uploading image...</span>
                  <span>{aboutImageProgress}%</span>
                </div>
                <div className="w-32 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${aboutImageProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90">
                <input
                  type="file"
                  accept="image/*,.gif"
                  className="sr-only"
                  disabled={uploadingAboutImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadAboutImage(file);
                    if (url) setContent({ ...content, about: { ...content.about, image: url } });
                    e.target.value = "";
                  }}
                />
                {uploadingAboutImage ? "Uploading…" : "Upload from PC"}
              </label>
            </div>
            <input
              type="url"
              placeholder="https://... or /uploads/..."
              value={content.about.image || ""}
              onChange={(e) => setContent({ ...content, about: { ...content.about, image: e.target.value } })}
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
        </div>
      </section>

      {/* Play */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Play Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Text</label>
            <textarea
              value={content.play.text}
              onChange={(e) => setContent({ ...content, play: { ...content.play, text: e.target.value } })}
              rows={3}
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>
        </div>
      </section>

      {/* Games / GIFs */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Games / GIFs</h2>
        <p className="text-sm opacity-70 mb-4">
          Upload, view, and edit the GIFs that power the Play section. The numbered grid on the site follows this list.
        </p>

        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium">GIF URL</label>
            <input
              type="url"
              value={newGameGif}
              onChange={(e) => setNewGameGif(e.target.value)}
              placeholder="Paste a GIF URL or upload one from your computer"
              className="w-full px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload GIF from computer</label>
            {gameGifProgress > 0 && gameGifProgress < 100 && (
              <div className="space-y-1 max-w-md">
                <div className="flex justify-between items-center text-xs opacity-60">
                  <span>Uploading GIF...</span>
                  <span>{gameGifProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${gameGifProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90">
                <input
                  type="file"
                  accept="image/gif,.gif"
                  className="sr-only"
                  disabled={uploadingGameGif}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadGameImage(file);
                    if (url) setNewGameGif(url);
                    e.target.value = "";
                  }}
                />
                {uploadingGameGif ? "Uploading…" : "Upload GIF"}
              </label>
              <button
                type="button"
                onClick={addGame}
                disabled={gamesSaving || uploadingGameGif || !newGameGif.trim()}
                className="px-6 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded font-medium disabled:opacity-50"
              >
                {gamesSaving ? "Adding…" : "Add GIF"}
              </button>
            </div>
          </div>
        </div>

        {gamesLoading ? (
          <p className="text-sm opacity-70">Loading uploaded GIFs...</p>
        ) : games.length === 0 ? (
          <p className="text-sm opacity-70">No GIFs uploaded yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game, index) => {
              const isEditing = editingGameId === game.id;
              return (
                <div key={game.id} className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] opacity-60 mb-1">GIF #{index + 1}</p>
                      <p className="text-sm opacity-70 break-all">ID: {game.id}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border border-[var(--color-border)] opacity-70">
                      {index + 1}
                    </span>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-[var(--color-border)] bg-black mb-3">
                    <img src={isEditing ? editGameGif || game.gif_url : game.gif_url} alt={`GIF ${index + 1}`} className="w-full aspect-video object-cover block" />
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="block text-xs mb-1">GIF URL</label>
                        <input
                          type="url"
                          value={editGameGif}
                          onChange={(e) => setEditGameGif(e.target.value)}
                          className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs mb-1">Replace with upload</label>
                        {gameGifProgress > 0 && gameGifProgress < 100 && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs opacity-60">
                              <span>Uploading GIF...</span>
                              <span>{gameGifProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${gameGifProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded cursor-pointer hover:opacity-90 text-sm">
                          <input
                            type="file"
                            accept="image/gif,.gif"
                            className="sr-only"
                            disabled={uploadingGameGif}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await uploadGameImage(file);
                              if (url) setEditGameGif(url);
                              e.target.value = "";
                            }}
                          />
                          {uploadingGameGif ? "Uploading…" : "Upload new GIF"}
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={saveEditedGame}
                          disabled={gamesSaving}
                          className="px-4 py-2 bg-[var(--color-text)] text-[var(--color-bg)] rounded text-sm disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGameId(null);
                            setEditGameGif("");
                          }}
                          className="px-4 py-2 border border-[var(--color-border)] rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGame(game.id)}
                          disabled={gamesSaving}
                          className="text-red-600 dark:text-red-400 text-sm hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                      <span className="text-xs break-all opacity-70">{game.gif_url}</span>
                      <div className="flex gap-2">
                        <a href={game.gif_url} target="_blank" rel="noreferrer" className="text-sm opacity-70 hover:opacity-100">
                          View
                        </a>
                        <button onClick={() => startEditGame(game)} className="text-sm opacity-70 hover:opacity-100">
                          Edit
                        </button>
                        <button
                          onClick={() => removeGame(game.id)}
                          disabled={gamesSaving}
                          className="text-red-600 dark:text-red-400 text-sm hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
              {coverProgress > 0 && coverProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs opacity-60">
                    <span>Uploading cover...</span>
                    <span>{coverProgress}%</span>
                  </div>
                  <div className="w-32 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${coverProgress}%` }}
                    />
                  </div>
                </div>
              )}
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
                      console.log("Uploaded cover image URL:", url);
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
                    <li key={idx} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                        <img 
                          src={url} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Failed to load image:", url);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-red-500">Failed</div>';
                          }}
                        />
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
              {Object.keys(imageProgressMap).length > 0 && (
                <div className="space-y-2 mt-3">
                  <label className="block text-xs font-medium opacity-70">Uploading...</label>
                  <div className="space-y-2">
                    {Object.entries(imageProgressMap).map(([key, progress]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center text-xs opacity-60">
                          <span>{key}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                      console.log("Uploaded image URLs:", urls);
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
                        {coverProgress > 0 && coverProgress < 100 && (
                          <div className="space-y-1 mb-2">
                            <div className="flex justify-between items-center text-xs opacity-60">
                              <span>Uploading cover...</span>
                              <span>{coverProgress}%</span>
                            </div>
                            <div className="w-32 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${coverProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
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
                              <li key={idx} className="relative group">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
                                  <img 
                                    src={url} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Failed to load image:", url);
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-red-500">Failed</div>';
                                    }}
                                  />
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
                        {Object.keys(imageProgressMap).length > 0 && (
                          <div className="space-y-2 mb-3">
                            <label className="block text-xs font-medium opacity-70">Uploading...</label>
                            <div className="space-y-2">
                              {Object.entries(imageProgressMap).map(([key, progress]) => (
                                <div key={key} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs opacity-60">
                                    <span>{key}</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
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
    </div>
  );
}
