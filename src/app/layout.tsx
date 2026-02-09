import type { Metadata } from "next";
import { Toaster } from "sonner";
import Sidebar from "@/components/shared/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rigour QA - Test Scene Builder",
  description: "Build, configure, and execute intelligent test scenes",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-slate-950">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
