// app/astrax/page.tsx
import React from 'react';
import Image from 'next/image'; // Make sure Image is imported
// import Link from 'next/link'; // Not strictly needed if no problem_statement

// --- Type Definition for Astrax Event ---
interface AstraxItem {
  id: number;
  name: string;
  image: string; // Full URL from Django
  description: string | null;
}
// --- End Type Definition ---

async function getAstraxData(): Promise<AstraxItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/events/astrax/`;
    console.log("Fetching Astrax data from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch Astrax data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Astrax data fetched is not an array. Received:", data);
      return null;
    }
    return data as AstraxItem[];
  } catch (error) {
    console.error("Error fetching or parsing Astrax data:", error);
    return null;
  }
}

export default async function AstraxPage() {
  const astraxEvents = await getAstraxData();

  if (!astraxEvents) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            ASTRAX Events
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load ASTRAX event data.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  if (astraxEvents.length === 0) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
            ASTRAX Events
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            No ASTRAX events are currently listed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-20 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
          ASTRAX Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {astraxEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 flex flex-col"
            >
              <div className="relative w-full h-72 sm:h-80">
                <Image
                  src={event.image || '/default-event.png'} // Fallback image for events
                  alt={event.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {event.name}
                </h2>
                {event.description && (
                  <div
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 flex-grow" // line-clamp- can be added if needed
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                )}
                {/* Astrax doesn't have a problem_statement in its model */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}