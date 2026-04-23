export default function ContactForm() {
  return (
    <form className="contact-form">
      <h3 className="contact-form__title">Get in touch</h3>

      <div className="contact-form__field">
        <label className="contact-form__label">Name</label>
        <input placeholder="Your name" className="contact-form__input" />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label">Email</label>
        <input placeholder="your@email.com" className="contact-form__input" />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label">Budget</label>
        <input type="number" placeholder="Rate amount" className="contact-form__input" />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label">Message</label>
        <textarea placeholder="Tell me about your project" rows={4} className="contact-form__input contact-form__textarea" />
      </div>

      <button type="submit" className="contact-form__submit">Send</button>

      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .contact-form__title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 8px 0;
        }
        .contact-form__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .contact-form__label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .contact-form__input {
          padding: 20px 24px;
          background: transparent;
          color: var(--color-text);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s cubic-bezier(0.25,1,0.5,1);
        }
        .contact-form__input:focus {
          border-color: var(--color-text);
        }
        .contact-form__input::placeholder {
          color: var(--color-text-subtle);
        }
        .contact-form__textarea {
          resize: vertical;
          min-height: 100px;
        }
        .contact-form__submit {
          padding: 16px 32px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: var(--color-text);
          color: var(--color-bg);
          border: none;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.15s;
        }
        .contact-form__submit:hover {
          opacity: 0.8;
        }
        .contact-form__submit:active {
          transform: scale(0.98);
        }
      `}</style>
    </form>
  );
}
