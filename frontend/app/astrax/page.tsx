"use client";

import React, { useState, useEffect } from 'react';

// You must have this component in your project, for example at '@/components/ui/tracing-beam'
import { TracingBeam } from '../../components/ui/tracing-beam'; // Assuming tracing-beam.tsx is in the same directory for this example.

// --- Type Definition for Astrax Event ---
interface AstraxItem {
  id: number;
  name: string;
  image: string; // Full URL from Django
  description: string | null;
}

// --- Data Fetching Function (no changes) ---
async function getAstraxData(): Promise<AstraxItem[] | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const apiUrl = `${baseUrl}/api/events/astrax/`;
        console.log("Fetching Astrax data from:", apiUrl);

        const response = await fetch(apiUrl, {
        next: { revalidate: 3600 }
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


export default function AstraxPage() {
    const [astraxEvents, setAstraxEvents] = useState<AstraxItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getAstraxData();
            if (data !== null) {
            setAstraxEvents(data);
            } else {
            setError("Failed to load ASTRAX event data.");
            }
        } catch (err) {
            console.error("Caught error in component:", err);
            setError("An unexpected error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchData();
    }, []);

    // --- Loading, Error, and Empty State Handlers (no changes) ---
    if (isLoading) {
        return (
        <main className="h-full w-full pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                ASTRAX Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        </main>
        );
    }

    if (error) {
        return (
        <main className="h-full w-full pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                ASTRAX Events
            </h1>
            <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
                {error}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
                Please try again later or contact support.
            </p>
            </div>
        </main>
        );
    }

    if (!astraxEvents || astraxEvents.length === 0) {
        return (
        <main className="h-full w-full pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
            <h1 className="text-5xl font-extrabold mb-16 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    ASTRAX Events
                </span>
            </h1>
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                No ASTRAX events are currently listed.
            </p>
            </div>
        </main>
        );
    }

    // --- Professional Layout with TracingBeam ---
    return (
        // Added pt-24 to push content down from the navbar.
        <main className="h-full w-full pt-24">
        <TracingBeam className="px-6">
            <div className="max-w-3xl mx-auto antialiased pt-4 relative">
            {/* Page Title inside the beam container */}
            <h1 className="text-5xl font-extrabold mb-20 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    ASTRAX Events
                </span>
            </h1>

            {astraxEvents.map((event) => (
                // Each item is now a flex container for a horizontal layout
                <div key={event.id} className="mb-16 flex flex-col sm:flex-row items-start gap-8">
                
                {/* Image on the left */}
                {event.image && (
                    <div className="w-full sm:w-48 flex-shrink-0">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-auto object-cover rounded-[2px] border-2 border-gray-300 dark:border-gray-700"
                        />
                    </div>
                )}
                
                {/* Text content on the right */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                            {event.name}
                        </span>
                    </h2>
                    
                    {event.description && (
                        <div
                            className="text-sm prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                    )}
                </div>
                </div>
            ))}
            </div>
        </TracingBeam>
        </main>
    );
}