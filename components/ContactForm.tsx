export default function ContactForm() {
  return (
    <form className="max-w-md flex flex-col gap-4">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-input {
          animation: slideIn 0.5s ease-out forwards;
        }
        .form-input:nth-child(n+2) {
          animation-delay: calc((var(--index, 1) - 1) * 0.1s);
        }
        .form-button {
          animation: slideUp 0.6s ease-out;
        }
        .form-input:focus {
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
        .form-label {
          color: #000000;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
      `}</style>

      <div>
        <label className="form-label">Name</label>
        <input
          placeholder="Name"
          className="form-input p-3 border rounded transition-all w-full"
          style={{
            background: "#ffffff",
            color: "#333333",
            borderColor: "#cccccc",
          }}
        />
      </div>

      <div>
        <label className="form-label">Email</label>
        <input
          placeholder="Email"
          className="form-input p-3 border rounded transition-all w-full"
          style={{
            background: "#ffffff",
            color: "#333333",
            borderColor: "#cccccc",
          }}
        />
      </div>

      <div>
        <label className="form-label">Rate Amount</label>
        <input
          type="number"
          placeholder="Rate Amount"
          className="form-input p-3 border rounded transition-all w-full"
          style={{
            background: "#ffffff",
            color: "#333333",
            borderColor: "#cccccc",
          }}
        />
      </div>

      <div>
        <label className="form-label">Message</label>
        <textarea
          placeholder="Message"
          rows={4}
          className="form-input p-3 border rounded transition-all w-full"
          style={{
            background: "#ffffff",
            color: "#333333",
            borderColor: "#cccccc",
          }}
        />
      </div>

      <button
        className="form-button p-4 text-lg font-bold rounded hover:opacity-90 transition-all active:scale-95"
        style={{
          background: "#666666",
          color: "#ffffff",
        }}
      >
        Send
      </button>
    </form>
  );
}
