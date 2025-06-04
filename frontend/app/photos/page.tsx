// app/photos/page.tsx (or app/gallery/photos/page.tsx)
import React from 'react';
import Image from 'next/image';
// import Link from 'next/link'; // If you want to link to a detail page per photo

// --- Type Definition for Photo ---
interface PhotoItem {
  id: number;
  name: string;
  image: string; // Full URL from Django
  description: string | null;
}
// --- End Type Definition ---

async function getPhotoData(): Promise<PhotoItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/gallery/photos/`;
    console.log("Fetching Photo Gallery data from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch Photo Gallery data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Photo Gallery data fetched is not an array. Received:", data);
      return null;
    }
    return data as PhotoItem[];
  } catch (error) {
    console.error("Error fetching or parsing Photo Gallery data:", error);
    return null;
  }
}

export default async function PhotosPage() {
  const photos = await getPhotoData();

  if (!photos) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Photo Gallery
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load photo gallery data.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  if (photos.length === 0) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-gray-800 dark:text-gray-100">
            Photo Gallery
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            There are no photos in the gallery at the moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-20 text-center text-gray-800 dark:text-gray-100">
          Photo Gallery
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="relative w-full aspect-[3/4] sm:aspect-square"> {/* Adjust aspect ratio as desired */}
                <Image
                  src={photo.image || '/default-gallery-image.png'} // Fallback image
                  alt={photo.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">
                    {photo.name}
                  </h3>
                </div>
              </div>
              {/* Optional: Display description in a tooltip or small area below */}
              {/* {photo.description && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700">
                  <div
                    className="prose dark:prose-invert text-xs text-gray-600 dark:text-gray-400 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: photo.description }}
                  />
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}