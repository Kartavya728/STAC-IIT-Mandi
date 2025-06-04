// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

// Import your new theme provider
import { MyThemeProvider } from "./theme-provider"; // Make sure this path is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { /* ... your metadata ... */ };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground overflow-y-scroll overflow-x-hidden`}
      >
        <MyThemeProvider
          attribute="class"
          defaultTheme="system" // Can be "light" or "dark" if "system" is problematic
          enableSystem
        >
          <StarsCanvas />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar /> {/* Ensure Navbar contains ThemeToggle */}
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </MyThemeProvider>
      </body>
    </html>
  );
}