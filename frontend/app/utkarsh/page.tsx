// app/utkarsh/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Type Definition for Utkarsh Event ---
interface UtkarshItem {
  id: number;
  name: string;
  image: string;
  description: string | null;
  problem_statement: string | null;
}
// --- End Type Definition ---

async function getUtkarshData(): Promise<UtkarshItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/events/utkarsh/`;
    console.log("Fetching Utkarsh data from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to fetch Utkarsh data:", response.status, response.statusText, "Error Body:", errorBody);
      return null;
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("Utkarsh data fetched is not an array. Received:", data);
      return null;
    }
    return data as UtkarshItem[];
  } catch (error) {
    console.error("Error fetching or parsing Utkarsh data:", error);
    return null;
  }
}

export default async function UtkarshPage() {
  const utkarshEvents = await getUtkarshData();

  if (!utkarshEvents) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            UTKARSH Events
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load UTKARSH event data.
          </p>
        </div>
      </main>
    );
  }

  if (utkarshEvents.length === 0) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
            UTKARSH Events
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            No UTKARSH events are currently listed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-20 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
          UTKARSH Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {utkarshEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 flex flex-col"
            >
              <div className="relative w-full h-72 sm:h-80">
                <Image
                  src={event.image || '/default-event.png'}
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
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-4 flex-grow"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                )}
                {event.problem_statement && (
                  <div className="mt-auto pt-4">
                    <Link
                      href={event.problem_statement}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 text-center w-full sm:w-auto"
                    >
                      View Problem Statement
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}