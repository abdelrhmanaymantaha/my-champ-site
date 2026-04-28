"use client";

import { FormEvent } from "react";

type ContactFormProps = {
  onSubmit?: () => void;
};

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" placeholder="Your name" />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={5} placeholder="Tell me about the project"></textarea>
      </div>

      <button type="submit" className="contact-form__submit">
        Send Message
      </button>

      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .contact-form__field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-form__field label {
          color: var(--color-text);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .contact-form__field input,
        .contact-form__field textarea {
          width: 100%;
          border: 1px solid color-mix(in srgb, var(--color-border) 85%, transparent);
          border-radius: 16px;
          background: color-mix(in srgb, var(--color-bg) 92%, transparent);
          color: var(--color-text);
          padding: 16px 18px;
          font: inherit;
          outline: none;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-form__field input::placeholder,
        .contact-form__field textarea::placeholder {
          color: var(--color-text-muted);
        }

        .contact-form__field input:focus,
        .contact-form__field textarea:focus {
          border-color: var(--color-text);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-text) 18%, transparent);
          transform: translateY(-1px);
        }

        .contact-form__submit {
          align-self: flex-start;
          border: none;
          border-radius: 999px;
          background: var(--color-text);
          color: var(--color-bg);
          padding: 14px 22px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .contact-form__submit:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .contact-form__submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
}