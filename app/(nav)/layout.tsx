"use client";

import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/events/event1/round1")) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
