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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="contact-modal" onClick={() => setOpen(false)} role="presentation">
      <div className="contact-modal__panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setOpen(false)} className="contact-modal__close">
          close
        </button>

        <div className="contact-modal__header">
          <p className="contact-modal__eyebrow">contact</p>
          <h2 className="contact-modal__title">Leave a message</h2>
          <p className="contact-modal__copy">How can I help you? Share a short brief and I’ll get back to you.</p>
        </div>

        <ContactForm onSubmit={() => setOpen(false)} />
      </div>

      <style>{`
        .contact-modal {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: grid;
          place-items: center;
          padding: 24px;
          background: color-mix(in srgb, var(--color-bg) 78%, transparent);
          backdrop-filter: blur(18px);
        }

        .contact-modal__panel {
          position: relative;
          width: min(100%, 720px);
          max-height: min(86vh, 900px);
          overflow: auto;
          border: 1px solid var(--color-border);
          border-radius: 28px;
          background: var(--color-bg);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.18);
          padding: 32px;
        }

        .contact-modal__close {
          position: absolute;
          top: 20px;
          right: 20px;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .contact-modal__header {
          padding-right: 80px;
          margin-bottom: 28px;
        }

        .contact-modal__eyebrow {
          margin: 0 0 8px;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .contact-modal__title {
          margin: 0;
          color: var(--color-text);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.95;
        }

        .contact-modal__copy {
          margin: 14px 0 0;
          color: var(--color-text-muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .contact-modal {
            padding: 16px;
          }

          .contact-modal__panel {
            padding: 24px;
            border-radius: 22px;
          }

          .contact-modal__header {
            padding-right: 44px;
          }
        }
      `}</style>
    </div>
  );
}