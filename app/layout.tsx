import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaChat | AI Assistant",
  description: "Conversational AI experience inspired by ChatGPT, built with Next.js."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.className} bg-background text-white`}>{children}</body>
    </html>
  );
}
