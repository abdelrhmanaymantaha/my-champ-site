"use client";

import { useEffect, useState } from "react";

type NavbarContent = {
  name: string;
  location: string;
};

export default function Navbar({ content }: { content: NavbarContent }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const links = ["home", "about", "projects", "play", "contact"];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <nav className={`site-nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="site-nav__left">
          <a href="#" className="site-nav__name glitch" data-text="PLEASE CALL ME ALEVEN">
            PLEASE CALL ME ALEVEN
          </a>
        </div>
        <div className="site-center">
          <ul className="site-nav__links">
            {links.map((link) => (
              <li key={link}>
                <a href={`#${link}`}>{link.toUpperCase()}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-nav__right">
          <p className="site-nav__location">
            {content.location.toUpperCase()} <button onClick={toggleTheme} className="theme-dot" aria-label="Toggle theme">●</button>
          </p>
        </div>
      </nav>

      <style>{`
        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: transparent;
          color: var(--color-text);
          mix-blend-mode: normal;
          transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), mix-blend-mode 0.4s linear, padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .site-nav.scrolled {
          background: var(--nav-bg-scrolled);
          mix-blend-mode: normal;
          padding: 16px 32px;
          border-bottom: 1px solid var(--color-border);
          backdrop-filter: blur(10px);
        }

        /* Keep it readable even before scroll */
        .site-nav:not(.scrolled) {
          background: color-mix(in srgb, var(--color-bg) 65%, transparent);
          backdrop-filter: blur(10px);
        }

        .site-nav__left {
          flex: 1;
          display: flex;
          justify-content: flex-start;
        }
        
        .site-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .site-nav__right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .site-nav__name {
          color: var(--color-text);
          text-decoration: none;
          white-space: nowrap;
        }

        .glitch {
          position: relative;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
          pointer-events: none;
        }
        .glitch::before {
          left: 1.5px;
          text-shadow: -1px 0 rgba(255, 0, 0, 0.7);
          color: transparent;
        }
        .glitch::after {
          left: -1.5px;
          text-shadow: 1px 0 rgba(0, 255, 255, 0.7);
          color: transparent;
        }

        .site-nav__location {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-muted);
          white-space: nowrap;
        }

        .theme-dot {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s, color 0.2s;
        }
        .theme-dot:hover {
          transform: scale(1.5);
          color: var(--color-text);
        }

        .site-nav__links {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 24px;
        }
        .site-nav__links a {
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .site-nav__links a:hover {
          color: var(--color-text);
        }

        .site-nav.scrolled .site-nav__name {
          color: var(--color-text);
        }
        .site-nav.scrolled .site-nav__location,
        .site-nav.scrolled .site-nav__links a,
        .site-nav.scrolled .theme-dot {
          color: var(--color-text-muted);
        }
        .site-nav.scrolled .site-nav__links a:hover {
          color: var(--color-text);
        }

        @media (max-width: 1024px) {
          .site-nav, .site-nav.scrolled {
            padding: 20px 24px;
            font-size: 0.7rem;
          }
          .site-nav__links {
            gap: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .site-nav {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
          }
          .site-nav.scrolled {
            padding: 16px 24px;
          }
          .site-nav__left, .site-center, .site-nav__right {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
