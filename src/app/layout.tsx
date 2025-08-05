import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ChatVault - Search and Analyze Your WhatsApp Chats",
  description: "Upload your WhatsApp chat exports and explore conversations with powerful search, filtering, and analytics tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} antialiased h-full bg-gray-50 dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
