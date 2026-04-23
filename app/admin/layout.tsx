import React from "react";

export const metadata = {
  title: "Admin | Aleven Studio",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-[var(--color-text)] relative flex flex-col items-center w-full overflow-x-hidden">
      <div className="w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
