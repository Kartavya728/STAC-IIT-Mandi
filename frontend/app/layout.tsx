// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import NotificationPopup from "@/components/main/NotificationPopup"; // <<< IMPORT POPUP

// Import your new theme provider
import { MyThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STAC - Space Technology and Astronomy Cell",
  description: "Official website of STAC, IIT Mandi.",
  // Add more metadata as needed
};

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
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange // Consider adding this if theme transitions are causing issues
        >
          <StarsCanvas />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <NotificationPopup /> {/* <<< ADD POPUP COMPONENT HERE */}
        </MyThemeProvider>
      </body>
    </html>
  );
}