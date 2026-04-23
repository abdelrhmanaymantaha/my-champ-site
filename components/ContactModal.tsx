"use client";

import { useEffect, useState } from "react";
import ContactForm from "./ContactForm";

export default function ContactModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener("open-contact", openModal);
    return () => window.removeEventListener("open-contact", openModal);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="contact-overlay" onClick={() => setOpen(false)}>
      <div className="contact-panel" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpen(false)}
          className="contact-close"
        >
          Close
        </button>
        <ContactForm />
      </div>

      <style>{`
        .contact-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-overlay);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.25s cubic-bezier(0.16,1,0.3,1);
          padding: 24px;
        }
        .contact-panel {
          background: var(--color-bg-elevated);
          color: var(--color-text);
          width: 100%;
          max-width: 560px;
          padding: 64px;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1);
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--color-border);
        }
        .contact-close {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s;
        }
        .contact-close:hover {
          color: var(--color-text);
        }
        @media (max-width: 640px) {
          .contact-panel {
            padding: 48px 24px;
          }
        }
      `}</style>
    </div>
  );
}
