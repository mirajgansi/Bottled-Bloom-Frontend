import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ToastProvider from "./_componets/ToastProvider";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bottle Bloom",
  description: "This is an online perfume store built with Next.js 13, Tailwind CSS, and TypeScript. It features user authentication, product browsing, shopping cart functionality, and a seamless checkout process. The application is designed to provide a smooth and enjoyable shopping experience for users looking to purchase groceries online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
          {children}
 <Toaster
          position="bottom-right"
          richColors
          closeButton
          expand
          duration={3500}
        />
      <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
