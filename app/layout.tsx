import type { Metadata } from "next";
import localFont from "next/font/local";
import logo from "/assets/whiteLogo.png";

import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/navbar";

// Fonts
const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "E-Summit'25",
  description: "Entrepreneurship: Turning The Impossible Into The Inevitable.",
  icons: {
    icon: logo.src, 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* If you need a specific favicon link in addition to metadata: */}
        <link rel="icon" href={logo.src} type="image/png" />
      </head>
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
