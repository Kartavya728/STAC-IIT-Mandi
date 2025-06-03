import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground"; // Ensure this path is correct
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STAC",
  description: "STAC - Space Technology and Astronomy Cell from IIT Mandi",
  icons: {
    icon: "/STAClogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}
      >
        {/* Your interactive content */}
        {/* These elements should have default or lower z-indexes than StarsCanvas */}
        <Navbar />
        <main className="relative z-0"> {/* Adding relative z-0 helps establish a stacking context for content */}
          {children}
        </main>

        <Footer />

        {/* StarsCanvas is now self-contained. 
            Placing it last in the body is good practice for overlays,
            though its internal z-index and fixed positioning primarily control its appearance.
        */}
        <StarsCanvas />
      </body>
    </html>
  );
}