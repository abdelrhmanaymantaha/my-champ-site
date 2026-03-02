"use client";

import { useEffect, useState } from "react";

type NavbarContent = {
  name: string;
  location: string;
};

export default function Navbar({ content }: { content: NavbarContent }) {
  const links = ["home", "about", "projects", "play", "contact"];
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLinkClick = (item: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item === "contact") {
      e.preventDefault();
      window.dispatchEvent(new Event("open-contact"));
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-10 py-4 md:py-6 flex justify-between items-center text-xs uppercase tracking-widest bg-[var(--color-bg)] bg-opacity-95 backdrop-blur-sm">
        <p className="font-bold text-[10px] sm:text-xs" style={{ color: "var(--color-text)" }}>
          {content.name}
        </p>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 opacity-60 items-start justify-between">
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item}`}
                onClick={(e) => handleLinkClick(item, e)}
                className="hover:opacity-60 transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Location & Theme */}
        <div className="hidden md:flex items-center gap-3 opacity-70">
          <span className="text-[10px] sm:text-xs">{content.location}</span>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-3 h-3 rounded-full bg-current hover:scale-125 transition"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-3 h-3 rounded-full bg-current"
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="w-6 h-6 flex flex-col justify-center items-center gap-1"
          >
            <span className={`w-5 h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full z-40 md:hidden bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-lg">
          <ul className="flex flex-col py-4 px-6">
            {links.map((item) => (
              <li key={item} className="border-b border-[var(--color-border)] last:border-0">
                <a
                  href={`#${item}`}
                  onClick={(e) => handleLinkClick(item, e)}
                  className="block py-3 hover:opacity-60 transition uppercase text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="pt-3 opacity-60 text-xs">
              {content.location}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
