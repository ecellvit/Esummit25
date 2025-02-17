import type { Metadata } from "next";
import localFont from "next/font/local";
import logo from "/assets/redLogo.png"; // Verify the path
import Head from "next/head";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthProvider";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "E-Summit'25",
  description: "Entrepreneurship: Turning The Impossible Into The Inevitable.",
  icons: {
    icon: logo.src, // using the imported logo's src
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
