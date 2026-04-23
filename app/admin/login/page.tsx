"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Login failed" });
        return;
      }
      window.location.href = "/admin";
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-inner">
          {/* Header */}
          <div className="login-header">
            <h1>Sign in</h1>
            <p>Sign in below to access your account</p>
          </div>

          {/* Form */}
          <div className="login-form-wrapper">
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-field">
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <label htmlFor="login-email">Email Address</label>
              </div>

              {/* Password Field */}
              <div className="form-field">
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="login-password">Password</label>
              </div>

              {/* Error / Success Message */}
              {message && (
                <div className={`login-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              {/* Submit */}
              <div className="login-submit">
                <button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="login-spinner-wrap">
                      <svg className="login-spinner" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              {/* Footer Link */}
              <p className="login-footer-link">
                <Link href="/">← Back to site</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #0b1215;
        }

        .login-card {
          position: relative;
          margin: 0 auto;
          width: 100%;
          max-width: 448px;
        }

        .login-card-inner {
          background: #ffffff;
          padding: 40px 40px 32px;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          ring: 1px solid rgba(0, 0, 0, 0.05);
        }

        /* ── Header ── */
        .login-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .login-header h1 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.2;
          margin: 0;
        }

        .login-header p {
          margin-top: 8px;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        /* ── Form ── */
        .login-form-wrapper {
          margin-top: 20px;
        }

        /* ── Floating label field ── */
        .form-field {
          position: relative;
          margin-top: 24px;
        }

        .form-field input {
          display: block;
          width: 100%;
          margin-top: 4px;
          padding: 6px 0;
          border: none;
          border-bottom: 2px solid #d1d5db;
          background: transparent;
          color: #111827;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-field input:focus {
          border-bottom-color: #374151;
        }

        .form-field input::placeholder {
          color: transparent;
        }

        .form-field label {
          position: absolute;
          top: 0;
          left: 0;
          transform-origin: left;
          transform: translateY(-50%);
          font-size: 0.875rem;
          color: #1f2937;
          opacity: 0.75;
          transition: all 0.15s ease-in-out;
          pointer-events: none;
        }

        /* When input is empty (placeholder shown) → label drops to middle */
        .form-field input:placeholder-shown + label {
          top: 50%;
          font-size: 1rem;
          color: #6b7280;
        }

        /* When input is focused → label floats up */
        .form-field input:focus + label {
          top: 0;
          font-size: 0.875rem;
          color: #1f2937;
          padding-left: 0;
        }

        /* ── Message ── */
        .login-message {
          margin-top: 16px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
          border: 1px solid;
        }

        .login-message.success {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #059669;
        }

        .login-message.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* ── Submit ── */
        .login-submit {
          margin: 24px 0;
        }

        .login-submit button {
          width: 100%;
          padding: 14px 12px;
          background: #000000;
          color: #ffffff;
          font-size: 0.9375rem;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .login-submit button:hover {
          background: #1f2937;
        }

        .login-submit button:active {
          transform: scale(0.98);
        }

        .login-submit button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-submit button:focus-visible {
          outline: 2px solid #374151;
          outline-offset: 2px;
        }

        /* ── Spinner ── */
        .login-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-spinner {
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Footer ── */
        .login-footer-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .login-footer-link :global(a) {
          font-weight: 600;
          color: #4b5563;
          text-decoration: none;
          transition: color 0.15s;
        }

        .login-footer-link :global(a:hover) {
          text-decoration: underline;
          color: #1f2937;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .login-card-inner {
            border-radius: 0;
            padding: 40px 24px 32px;
          }
        }
      `}</style>
    </div>
  );
}
