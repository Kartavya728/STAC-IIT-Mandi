"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TracingBeam } from '../../components/ui/tracing-beam';

// --- Type Definition for Pleiades Event ---
interface PleiadesItem {
  id: number;
  name: string;
  image: string;
  description: string | null;
  problem_statement: string | null;
}

// --- Data Fetching Function ---
async function getPleiadesData(): Promise<PleiadesItem[] | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const apiUrl = `${baseUrl}/api/events/pleiades/`;
        console.log("Fetching Pleiades data from:", apiUrl);
        const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error("Failed to fetch Pleiades data:", response.status, response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching or parsing Pleiades data:", error);
        return null;
    }
}


export default function PleiadesPage() {
    const [pleiadesEvents, setPleiadesEvents] = useState<PleiadesItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getPleiadesData();
            if (data) {
                setPleiadesEvents(data);
            } else {
                setError("Failed to load PLEIADES event data.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, []);
    
    // --- Theming Variables for Pleiades ---
    const pleiadesGradient = "from-indigo-500 via-purple-500 to-pink-500";
    const pleiadesBeamColors: [string, string] = ["#6366f1", "#ec4899"]; // indigo-500 to pink-500

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

    return (
        <main className="h-full w-full pt-24">
            <TracingBeam className="px-6" >
                <div className="relative mx-auto max-w-3xl pt-4 antialiased">
                    <h1 className="mb-20 text-center text-5xl font-extrabold">
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${pleiadesGradient}`}>
                            PLEIADES Events
                        </span>
                    </h1>

                    {pleiadesEvents.length > 0 ? (
                        pleiadesEvents.map((event) => (
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
                                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${pleiadesGradient}`}>
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
                                                className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-center font-semibold text-white transition-colors duration-300 hover:bg-indigo-700"
                                            >
                                                View Problem Statement
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                         <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                            No PLEIADES events are currently listed.
                        </p>
                    )}
                </div>
            </TracingBeam>
        </main>
    );
}