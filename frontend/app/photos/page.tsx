// app/photos/page.tsx (or app/gallery/photos/page.tsx)
import React from "react";
import Image from "next/image";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { cn } from "@/lib/utils";

// --- Type Definition for Photo ---
interface PhotoItem {
  id: number;
  name: string;
  image: string;
  description: string | null;
}
// --- End Type Definition ---

async function getPhotoData(): Promise<PhotoItem[] | null> {
  // ... (Your existing getPhotoData function remains the same)
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const apiUrl = `${baseUrl}/api/gallery/photos/`;
    console.log("Fetching Photo Gallery data from:", apiUrl);
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error("Failed to fetch Photo Gallery data:", response.status);
      return null;
    }
    const data = await response.json();
    return Array.isArray(data) ? (data as PhotoItem[]) : null;
  } catch (error) {
    console.error("Error fetching or parsing Photo Gallery data:", error);
    return null;
  }
}

// --- RESPONSIVE POSITIONAL STYLES ---
// Each string contains mobile-first defaults and `md:` prefixed classes for desktop.
const responsivePositionalStyles = [
  // Card 1
  "absolute top-[15vh] left-[5%] -rotate-6  md:top-[20vh] md:left-[10%] md:-rotate-8",
  // Card 2
  "absolute top-[35vh] right-[5%] rotate-4  md:top-[40vh] md:left-[30%] md:rotate-4",
  // Card 3
  "absolute top-[55vh] left-[8%] rotate-8   md:top-[28vh] md:left-[55%] md:rotate-7",
  // Card 4
  "absolute top-[75vh] right-[10%] -rotate-5 md:top-[45vh] md:left-[75%] md:-rotate-5",
  // Card 5
  "absolute top-[95vh] left-[10%] rotate-6   md:top-[65vh] md:left-[15%] md:rotate-6",
  // Card 6
  "absolute top-[115vh] right-[8%] -rotate-9  md:top-[70vh] md:left-[48%] md:-rotate-9",
  // Card 7
  "absolute top-[135vh] left-[5%] rotate-5    md:top-[135vh] md:left-[15%] md:rotate-5",
  // Card 8
  "absolute top-[155vh] right-[10%] -rotate-7 md:top-[150vh] md:left-[40%] md:-rotate-7",
  // Card 9
  "absolute top-[175vh] left-[8%] rotate-9    md:top-[140vh] md:left-[70%] md:rotate-9",
  // Card 10
  "absolute top-[195vh] right-[5%] -rotate-4  md:top-[165vh] md:left-[20%] md:-rotate-4",
  // Card 11
  "absolute top-[215vh] left-[10%] rotate-11   md:top-[170vh] md:left-[60%] md:rotate-11",
  // Card 12
  "absolute top-[235vh] right-[8%] -rotate-6  md:top-[185vh] md:left-[35%] md:-rotate-6",
  // Card 13
  "absolute top-[255vh] left-[5%] rotate-2     md:top-[180vh] md:left-[80%] md:rotate-2",
];


export default async function PhotosPage() {
  const photos = await getPhotoData();

  if (!photos || photos.length === 0) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-black">
        <h1 className="mb-4 text-5xl font-extrabold md:text-7xl">
          <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Photo Gallery
          </span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          { !photos ? "Failed to load photos." : "The gallery is empty." }
        </p>
      </main>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-black">
      <div className="py-20 text-center">
        <h1 className="text-5xl font-extrabold md:text-7xl">
          <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Photo Gallery
          </span>
        </h1>
      </div>

      <DraggableCardContainer className="relative w-full overflow-x-clip min-h-[300vh] md:min-h-[240vh]">
        {/* Subtle background text, with responsive font size */}
        <p className="pointer-events-none absolute top-[130vh] md:top-[110vh] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center text-6xl font-black text-neutral-200 md:text-8xl dark:text-neutral-900">
          Andhera kayam rahe
        </p>

        {/* --- Render all photos in a SINGLE loop for correct positioning --- */}
        {photos.map((photo, index) => {
          const appliedStyle = responsivePositionalStyles[index % responsivePositionalStyles.length];

          return (
            <DraggableCardBody
              key={photo.id}
              className={cn(
                // Responsive Card Sizing
                "w-[85vw] h-auto aspect-[3/4] sm:w-72 md:w-80 md:h-[420px]",
                // Base Styling
                "rounded-xl border border-neutral-200/80 bg-white/30 p-2 md:p-4 shadow-xl backdrop-blur-sm dark:border-neutral-800/80 dark:bg-black/30",
                // Applied Positional Styling
                appliedStyle
              )}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-2 md:p-4 dark:bg-neutral-900">
                <div className="relative h-full w-full overflow-hidden rounded-md border border-neutral-200 shadow-inner dark:border-neutral-700">
                  <Image
                    src={photo.image || "/default-gallery-image.png"}
                    alt={photo.name}
                    fill
                    className="pointer-events-none object-cover"
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 288px, 320px"
                    priority={index < 3}
                  />
                </div>
                <h3 className="mt-3 flex-shrink-0 text-center text-sm font-medium text-neutral-600 md:text-base dark:text-neutral-400">
                  {photo.name}
                </h3>
              </div>
            </DraggableCardBody>
          );
        })}
      </DraggableCardContainer>
    </div>
  );
}