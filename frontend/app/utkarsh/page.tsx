"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Corrected import path based on your reference
import { TracingBeam } from '../../components/ui/tracing-beam';

// --- Type Definition for Utkarsh Event ---
interface UtkarshItem {
  id: number;
  name: string;
  image: string;
  description: string | null;
  problem_statement: string | null;
}

// --- Data Fetching Function ---
async function getUtkarshData(): Promise<UtkarshItem[] | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const apiUrl = `${baseUrl}/api/events/utkarsh/`;
        console.log("Fetching Utkarsh data from:", apiUrl);
        const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error("Failed to fetch Utkarsh data:", response.status, response.statusText);
            return null;
        }
        return await response.json() as UtkarshItem[];
    } catch (error) {
        console.error("Error fetching or parsing Utkarsh data:", error);
        return null;
    }
}


export default function UtkarshPage() {
    const [utkarshEvents, setUtkarshEvents] = useState<UtkarshItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getUtkarshData();
            if (data !== null) {
                setUtkarshEvents(data);
            } else {
                setError("Failed to load UTKARSH event data.");
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

    // --- Loading State Handler ---
    if (isLoading) {
        return (
            <main className="h-full w-full pt-24">
                <div className="container mx-auto flex min-h-[calc(100vh-130px)] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-8 text-4xl font-bold text-gray-800 dark:text-gray-100">UTKARSH Events</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </main>
        );
    }
    
    // --- Error State Handler ---
    if (error) {
        return (
            <main className="h-full w-full pt-24">
                <div className="container mx-auto flex min-h-[calc(100vh-130px)] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mb-8 text-4xl font-bold text-gray-800 dark:text-gray-100">UTKARSH Events</h1>
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</p>
                </div>
            </main>
        );
    }

    // --- Empty State Handler ---
    if (utkarshEvents.length === 0) {
        return (
            <main className="h-full w-full pt-24">
                <div className="container mx-auto min-h-[calc(100vh-130px)] py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-16 text-center text-5xl font-extrabold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
                            UTKARSH Events
                        </span>
                    </h1>
                    <p className="text-center text-lg text-gray-600 dark:text-gray-400">No UTKARSH events are currently listed.</p>
                </div>
            </main>
        );
    }

    // --- Professional Layout with TracingBeam for Utkarsh ---
    return (
        <main className="h-full w-full pt-24">
            <TracingBeam className="px-6">
                <div className="relative mx-auto max-w-3xl pt-4 antialiased">
                    <h1 className="mb-20 text-center text-5xl font-extrabold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
                            UTKARSH Events
                        </span>
                    </h1>

                    {utkarshEvents.map((event) => (
                        <div key={event.id} className="mb-16 flex flex-col items-start gap-8 sm:flex-row">
                            {event.image && (
                                <div className="w-full flex-shrink-0 sm:w-48">
                                    <img
                                        src={event.image}
                                        alt={event.name}
                                        className="h-auto w-full rounded-[2px] border-2 border-gray-300 object-cover dark:border-gray-700"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h2 className="mb-2 text-2xl font-bold">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
                                        {event.name}
                                    </span>
                                </h2>
                                {event.description && (
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300 mb-4"
                                        dangerouslySetInnerHTML={{ __html: event.description }}
                                    />
                                )}
                                {event.problem_statement && (
                                    <div className="mt-4">
                                        <Link
                                            href={event.problem_statement}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block rounded-lg bg-orange-600 px-5 py-2 text-center font-semibold text-white transition-colors duration-300 hover:bg-orange-700"
                                        >
                                            View Problem Statement
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </TracingBeam>
        </main>
    );
}