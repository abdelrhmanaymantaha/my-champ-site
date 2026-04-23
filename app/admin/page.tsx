"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

type Content = {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  play: PlayContent;
  navbar: NavbarContent;
  sections: SectionsContent;
  socialMedia: SocialMedia;
};

const WhiteCard = ({ children, title, subtitle, className = "" }: { children: React.ReactNode; title?: string; subtitle?: string; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5 p-6 md:p-8 relative overflow-hidden group ${className}`}>
    {title && (
      <div className="mb-6 relative z-10 text-center md:text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

const FloatingInput = ({ id, label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) => (
  <div className={`relative mt-6 z-0 ${className}`}>
    <input
      id={id}
      placeholder={label}
      {...props}
      className={`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-1.5 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors ${props.className || ""}`}
    />
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
    >
      {label}
    </label>
  </div>
);

const FloatingTextArea = ({ id, label, className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string }) => (
  <div className={`relative mt-6 z-0 ${className}`}>
    <textarea
      id={id}
      placeholder={label}
      {...props}
      className={`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-2 placeholder:text-transparent focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors resize-none ${props.className || ""}`}
    />
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
    >
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ id, label, children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string }) => (
  <div className={`relative mt-6 z-0 ${className}`}>
    <select
      id={id}
      {...props}
      className={`peer mt-1 w-full border-0 border-b-2 border-gray-300 px-0 py-2 focus:border-gray-500 focus:outline-none text-gray-900 bg-transparent text-base transition-colors ${props.className || ""}`}
    >
      {children}
    </select>
    <label
      htmlFor={id}
      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out"
    >
      {label}
    </label>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

import AnimatedBackground from "@/components/AnimatedBackground";

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
  const [coverProgress, setCoverProgress] = useState(0);
  const [imageProgressMap, setImageProgressMap] = useState<Record<string, number>>({});
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [aboutImageProgress, setAboutImageProgress] = useState(0);

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
    return base || `project-${Date.now()}`;
  };

  const normalizeProjectType = (section: string): "branding" | "motion" => {
    return section === "motion" ? "motion" : "branding";
  };

  const normalizeImageList = (images: string[] | undefined): string[] => {
    if (!images?.length) return [];
    return images.map((s) => s.trim()).filter(Boolean);
  };

  const uploadOneImage = async (setUploading: (v: boolean) => void, setProgress?: (pct: number) => void, file?: File): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setMessage(null);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      xhr.responseType = "text";

      xhr.upload.onprogress = (event) => {
        if (setProgress && event.lengthComputable && event.total > 0) {
          const pct = Math.max(0, Math.min(90, Math.round((event.loaded / event.total) * 90)));
          setProgress(pct);
        }
      };

      return new Promise((resolve) => {
        xhr.onload = () => {
          try {
            if (setProgress) setProgress(100);
            const text = xhr.responseText || "{}";
            const data = JSON.parse(text) as { urls?: string[]; error?: unknown; detail?: unknown };
            if (xhr.status >= 200 && xhr.status < 300) {
              const urls = data.urls as string[] | undefined;
              const url = urls?.[0];
              if (url) {
                resolve(url);
                return;
              }
              setMessage({ type: "error", text: "No URL returned from upload" });
            } else {
              const err = data.error ?? data.detail ?? `Upload failed (${xhr.status})`;
              setMessage({ type: "error", text: typeof err === "string" ? err : JSON.stringify(err) });
            }
            resolve(null);
          } catch {
            setMessage({ type: "error", text: "Invalid response from upload" });
            resolve(null);
          } finally {
            setUploading(false);
            setTimeout(() => { if (setProgress) setProgress(0); }, 500);
          }
        };

        xhr.onerror = () => {
          setMessage({ type: "error", text: "Network error during upload" });
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

  const uploadMultipleImages = async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];
    setUploadingImages(true);
    setMessage(null);
    const initMap: Record<string, number> = {};
    fileArray.forEach((_, idx) => { initMap[`file-${idx}`] = 0; });
    setImageProgressMap(initMap);

    try {
      const concurrencyLimit = 3;
      const results: (string | null)[] = new Array(fileArray.length).fill(null);
      const uploadFile = async (idx: number) => {
        const file = fileArray[idx];
        const key = `file-${idx}`;
        results[idx] = await uploadOneImage(setUploadingImages, (pct) => {
          setImageProgressMap((prev) => ({ ...prev, [key]: pct }));
        }, file);
      };
      for (let i = 0; i < fileArray.length; i += concurrencyLimit) {
        await Promise.all(fileArray.slice(i, i + concurrencyLimit).map((_, idx) => uploadFile(i + idx)));
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
        body: JSON.stringify({ title, slug, description, gif, images, project_type }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to add project");
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
    if (id == null) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProjectDraft, project_type: editingProject.section }),
      });
      if (!res.ok) throw new Error("Failed to update");
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
    const id = content.projects[section][index].id;
    if (id == null) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessage({ type: "success", text: "Deleted!" });
      await refetchContent();
    } catch {
      setMessage({ type: "error", text: "Failed to delete" });
    } finally {
      setSaving(false);
    }
  };

  const addBulletPoint = () => {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, bulletPoints: [...content.hero.bulletPoints, ""] } });
  };

  const removeBulletPoint = (index: number) => {
    if (!content || content.hero.bulletPoints.length <= 1) return;
    setContent({ ...content, hero: { ...content.hero, bulletPoints: content.hero.bulletPoints.filter((_, i) => i !== index) } });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white/50 text-sm tracking-widest uppercase">Loading...</div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center bg-black text-white/50 text-sm">Failed to load content</div>;

  return (
    <main className="w-full flex flex-col items-center relative min-h-screen text-gray-900 bg-[#0b1215]">
      <AnimatedBackground />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b1215]/80 border-b border-white/[0.06]">
        <div className="w-full max-w-[1120px] mx-auto px-8 sm:px-10 lg:px-12 py-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-0.5 leading-none">Management</p>
              <h1 className="text-lg font-semibold tracking-tight text-white leading-tight">Content Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] uppercase tracking-[0.15em] text-white/35 hover:text-white transition-colors hidden sm:block">View site</Link>
            <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />
            <button type="button" onClick={saveAllContent} disabled={saving} className="px-6 py-2.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50">
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="w-full max-w-[1120px] mx-auto px-8 sm:px-10 lg:px-12 pt-10 pb-32 relative z-10 flex flex-col">

        {/* Toast */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-5 py-3 rounded-2xl text-sm border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* ── HERO SECTION ── */}
        <WhiteCard title="Hero Section" subtitle="The first impression of your portfolio">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FloatingInput id="hero-title" label="Main Hero Title" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} />
            <FloatingInput id="hero-tagline" label="Header Tagline" value={content.hero.tagline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })} />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm text-gray-800 opacity-75 font-medium mb-2 mt-6">Value Propositions</h4>
            {content.hero.bulletPoints.map((bp, i) => (
              <div key={i} className="flex gap-3">
                <FloatingTextArea label={`Bullet Point ${i + 1}`} id={`bp-${i}`} value={bp} onChange={(e) => {
                  const pts = [...content.hero.bulletPoints];
                  pts[i] = e.target.value;
                  setContent({ ...content, hero: { ...content.hero, bulletPoints: pts } });
                }} rows={2} />
                <button type="button" onClick={() => removeBulletPoint(i)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all self-start border border-red-500/20 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={addBulletPoint} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[10px] uppercase tracking-[0.12em] text-white/40 hover:bg-white/[0.08] hover:text-white/70 transition-all">+ Add point</button>
          </div>
        </WhiteCard>

        {/* ── BRANDING ROW: Navbar + Section Titles ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <WhiteCard title="Navbar Identity" subtitle="Global branding">
            <div className="space-y-5">
              <FloatingInput id="studio-name" label="Studio Name" value={content.navbar.name} onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, name: e.target.value } })} />
              <FloatingInput id="location-label" label="Location Label" value={content.navbar.location} onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, location: e.target.value } })} />
            </div>
          </WhiteCard>
          <WhiteCard title="Section Titles" subtitle="Display names for pages">
            <div className="space-y-4">
              <FloatingInput id="section-about" label="About" value={content.sections.about} onChange={(e) => setContent({ ...content, sections: { ...content.sections, about: e.target.value } })} />
              <FloatingInput id="section-projects" label="Projects" value={content.sections.projects} onChange={(e) => setContent({ ...content, sections: { ...content.sections, projects: e.target.value } })} />
              <FloatingInput id="section-play" label="Play" value={content.sections.play} onChange={(e) => setContent({ ...content, sections: { ...content.sections, play: e.target.value } })} />
            </div>
          </WhiteCard>
        </div>

        {/* ── SOCIAL & ABOUT ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mt-8">
          <WhiteCard title="Social Media" subtitle="Your online presence">
            <div className="space-y-5">
              <FloatingInput id="linkedin" label="LinkedIn" value={content.socialMedia?.linkedin || ""} onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, linkedin: e.target.value } })} />
              <FloatingInput id="behance" label="Behance" value={content.socialMedia?.behance || ""} onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, behance: e.target.value } })} />
              <FloatingInput id="instagram" label="Instagram" value={content.socialMedia?.instagram || ""} onChange={(e) => setContent({ ...content, socialMedia: { ...content.socialMedia, instagram: e.target.value } })} />
            </div>
          </WhiteCard>
          <WhiteCard title="About Profile" subtitle="Your bio & avatar" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 mb-6">
              <div className="space-y-5">
                <FloatingInput id="headline" label="Headline" value={content.about.title} onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })} />
                <FloatingInput id="sub-headline" label="Sub-headline" value={content.about.subtitle} onChange={(e) => setContent({ ...content, about: { ...content.about, subtitle: e.target.value } })} />
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Profile Avatar</h4>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
                    <img src={content.about.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-white/[0.08] text-white text-[9px] uppercase font-bold tracking-widest cursor-pointer hover:bg-white/[0.15] transition-all">
                    Update
                    <input type="file" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadAboutImage(file);
                        if (url) setContent({ ...content, about: { ...content.about, image: url } });
                      }
                    }} />
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <FloatingTextArea id="main-description" label="Main Description" rows={4} value={content.about.mainText} onChange={(e) => setContent({ ...content, about: { ...content.about, mainText: e.target.value } })} />
              <FloatingInput id="bottom-cta-title" label="Bottom CTA Title" value={content.about.bottomTitle} onChange={(e) => setContent({ ...content, about: { ...content.about, bottomTitle: e.target.value } })} />
            </div>
          </WhiteCard>
        </div>

        {/* ── PLAY SECTION ── */}
        <div className="mt-8">
          <WhiteCard title="Experimental / Play" subtitle="A space for non-project work">
            <FloatingTextArea id="explanatory-text" label="Explanatory Text" rows={3} value={content.play.text} onChange={(e) => setContent({ ...content, play: { ...content.play, text: e.target.value } })} />
          </WhiteCard>
        </div>

        {/* ── PROJECTS ── */}
        <div className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Projects</h2>
              <p className="text-sm text-white/30">Manage your portfolio across categories.</p>
            </div>
          </div>

          <WhiteCard title="Add New Project" subtitle="Expand your portfolio">
            <form onSubmit={addProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <FloatingInput id="proj-title" label="Project Title" value={newProject.title} onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))} placeholder="e.g. Minimalist Identity" />
                  <FloatingInput id="proj-slug" label="Custom URL Slug (Optional)" value={newProject.slug} onChange={(e) => setNewProject((prev) => ({ ...prev, slug: e.target.value }))} placeholder="Leave blank to auto-generate" />
                </div>
                <div className="space-y-5">
                  <FloatingSelect id="proj-section" label="Category" value={newProject.section} onChange={(e) => setNewProject((prev) => ({ ...prev, section: e.target.value as "branding" | "motion" }))}>
<option value="branding">Branding</option>
                      <option value="motion">Motion</option>
                    
</FloatingSelect>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Project Cover (GIF or Image)</h4>
                    <div className="flex gap-3 items-center">
                      <label className="flex-1 cursor-pointer">
                        <div className={`py-3.5 text-center border border-dashed rounded-2xl transition-all ${uploadingCover ? "border-blue-500/50 text-blue-400 bg-blue-500/5" : "border-white/[0.08] text-white/25 hover:border-white/20 hover:text-white/40"}`}>
                          <span className="text-[10px] uppercase font-bold tracking-widest">{uploadingCover ? `Uploading ${coverProgress}%` : "Upload Cover"}</span>
                        </div>
                        <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadCoverImage(file);
                            if (url) setNewProject((prev) => ({ ...prev, gif: url }));
                          }
                        }} />
                      </label>
                      {newProject.gif && <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/[0.08] shrink-0"><img src={newProject.gif} className="w-full h-full object-cover" alt="" /></div>}
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={saving || uploadingCover} className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-800 hover:bg-gray-800 font-medium transition-all active:scale-[0.98] disabled:opacity-50 mt-6">
                Create Project
              </button>
            </form>
          </WhiteCard>

          {(["branding", "motion"] as const).map((section) => (
            <div key={section} className="mt-10">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/20 mb-5 ml-1">{section} projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(content.projects[section] ?? []).map((p, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={p.slug + i} className="group/proj relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
                    <img src={p.gif} alt={p.title} className="w-full h-full object-cover grayscale group-hover/proj:grayscale-0 transition-all duration-700 scale-100 group-hover/proj:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover/proj:translate-y-0 transition-transform duration-500">
                      <h4 className="text-lg font-semibold text-white mb-0.5">{p.title}</h4>
                      <p className="text-[10px] text-white/35 uppercase tracking-widest mb-4">{p.slug}</p>
                      <div className="flex gap-2 opacity-0 group-hover/proj:opacity-100 transition-opacity duration-500">
                        <button onClick={() => startEditProject(section, i)} className="flex-1 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Edit</button>
                        <button onClick={() => removeProject(section, i)} className="px-3.5 py-2.5 bg-red-500/20 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editingProject && editProjectDraft && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingProject(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="w-full max-w-3xl bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5 relative z-[110] overflow-hidden flex flex-col max-h-[85vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Edit Project</h2>
                  <p className="text-sm text-gray-500 mt-1">Refining {editProjectDraft.title}</p>
                </div>
                <button onClick={() => setEditingProject(null)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <FloatingInput id="project-title" label="Project Title" value={editProjectDraft.title} onChange={(e) => setEditProjectDraft({ ...editProjectDraft, title: e.target.value })} />
                    <FloatingInput id="url-slug" label="URL Slug" value={editProjectDraft.slug} onChange={(e) => setEditProjectDraft({ ...editProjectDraft, slug: e.target.value })} />
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cover image (gif)</h4>
                    <div className="flex gap-4 items-center">
                      <div className="w-28 aspect-[4/3] rounded-2xl border border-white/[0.08] overflow-hidden"><img src={editProjectDraft.gif} className="w-full h-full object-cover" alt="" /></div>
                      <label className="px-3.5 py-2 rounded-xl bg-white/[0.08] text-white text-[9px] uppercase font-bold tracking-widest cursor-pointer hover:bg-white/[0.15] transition-all">
                        Change GIF
                        <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadCoverImage(file);
                            if (url) setEditProjectDraft({ ...editProjectDraft, gif: url });
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
                <FloatingTextArea id="description" label="Description" rows={3} value={editProjectDraft.description} onChange={(e) => setEditProjectDraft({ ...editProjectDraft, description: e.target.value })} />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Gallery Images</h4>
                    <label className="px-4 py-2 rounded-xl bg-white text-black text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:scale-95 transition-all">
                      Add Images
                      <input type="file" multiple className="hidden" onChange={async (e) => {
                        if (e.target.files) {
                          const urls = await uploadMultipleImages(e.target.files);
                          setEditProjectDraft(prev => prev ? ({ ...prev, images: [...(prev.images || []), ...urls] }) : null);
                        }
                      }} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(editProjectDraft.images || []).map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]">
                        <img src={img} className="w-full h-full object-cover transition-opacity group-hover:opacity-40" alt="" />
                        <button onClick={() => {
                          const imgs = [...(editProjectDraft.images || [])];
                          imgs.splice(idx, 1);
                          setEditProjectDraft({ ...editProjectDraft, images: imgs });
                        }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-gray-100 flex gap-3 shrink-0">
                <button onClick={saveEditedProject} disabled={saving} className="flex-1 rounded-md bg-black px-3 py-4 text-white focus:bg-gray-800 hover:bg-gray-800 font-medium transition-all active:scale-[0.98]">Save Changes</button>
                <button onClick={() => setEditingProject(null)} className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
      `}</style>
    </main>
  );
}
