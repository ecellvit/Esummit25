import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/navbar";

// Fonts
const geistSans = localFont({
  src: "/fonts/GeistVF.woff", // Correct font path from public folder
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff", // Correct font path from public folder
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
