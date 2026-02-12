import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Kriya 26 | PSG COLLEGE",
  description: "Event conducted By The Student Union at PSG College of Technology",
  icons: {
    icon: "/Logo/kriya26white.png",
    shortcut: "/Logo/kriya26white.png",
    apple: "/Logo/kriya26white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

