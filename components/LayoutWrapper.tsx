"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import ContactModal from "./ContactModal";

<<<<<<< HEAD
type NavbarContent = {
  name: string;
  location: string;
};

export default function LayoutWrapper({
  children,
  navbarContent,
}: {
  children: React.ReactNode;
  navbarContent: NavbarContent;
=======
export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
<<<<<<< HEAD
      {!isAdminRoute && <Navbar content={navbarContent} />}
=======
      {!isAdminRoute && <Navbar />}
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
      {children}
      {!isAdminRoute && <ContactModal />}
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6478bb1c8413e0f4befcbf58c1b3228653c12b46
