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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white text-black w-full max-w-3xl p-6 sm:p-10 md:p-16 relative animate-slideUp rounded-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-base sm:text-lg font-bold uppercase hover:scale-110 transition-transform"
        >
          close
        </button>

        <ContactForm />
      </div>
    </div>
  );
}
