"use client";

import { useEffect, useState } from "react";

type NavbarContent = {
  name: string;
  location: string;
};

export default function Navbar({ content }: { content: NavbarContent }) {
  const links = ["home", "about", "projects", "play", "contact"];
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-10 py-6 flex justify-between text-xs uppercase tracking-widest">
      <p className="font-bold" style={{ color: "var(--color-text)" }}>
        {content.name}
      </p>
      <ul className="flex gap-4 opacity-60 items-start justify-between">
        {links.map((item) => (
          <li key={item}>
            <a
              href={`#${item}`}
              onClick={(e) => {
                if (item === "contact") {
                  e.preventDefault();
                  window.dispatchEvent(new Event("open-contact"));
                }
              }}
              className="hover:opacity-60 transition"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 opacity-70">
        <span>{content.location}</span>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-3 h-3 rounded-full bg-current hover:scale-125 transition"
        />
      </div>
    </nav>
  );
}
