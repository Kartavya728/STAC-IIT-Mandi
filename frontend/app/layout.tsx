// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import NotificationPopup from "@/components/main/NotificationPopup";
import { MyThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STAC - Space Technology and Astronomy Cell",
  description: "Official website of STAC, IIT Mandi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        KEY FIX #3: The overflow classes have been REMOVED from the body tag here.
        The scrolling behavior is now 100% controlled by the rules in `globals.css`.
      */}
      <body className={`${inter.className} bg-background text-foreground`}>
        <MyThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <StarsCanvas />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <NotificationPopup />
        </MyThemeProvider>
      </body>
    </html>
  );
}