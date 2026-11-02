import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BookNook | Your Reading Corner",
    template: "%s | BookNook",
  },
  description:
    "Discover, organize, and manage your personal book collection with BookNook.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("booknook-theme");if(t!=="dark"&&t!=="light")t="light";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
        <ThemeProvider>
          <Suspense fallback={<div className="h-20" />}>
            <Navbar />
          </Suspense>

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              className: "bn-toast",
              style: { borderRadius: "12px", fontSize: "14px" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}