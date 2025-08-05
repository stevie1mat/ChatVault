import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WhatsApp Chat Parser",
  description: "Parse and view your WhatsApp chat exports with search and filtering capabilities",
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
