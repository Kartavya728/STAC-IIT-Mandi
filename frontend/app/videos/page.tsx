// app/videos/page.tsx (or app/gallery/videos/page.tsx)
import React from 'react';
import Link from 'next/link'; // For non-YouTube links or fallback

// --- Type Definition for Video ---
interface VideoItem {
  id: number;
  videoname: string;
  link: string; // URL to the video
  description: string | null;
}
// --- End Type Definition ---

async function getVideoData(): Promise<VideoItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = `${baseUrl}/api/gallery/videos/`;
    console.log("Fetching Video Gallery data from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch Video Gallery data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Video Gallery data fetched is not an array. Received:", data);
      return null;
    }
    return data as VideoItem[];
  } catch (error) {
    console.error("Error fetching or parsing Video Gallery data:", error);
    return null;
  }
}

// Helper to extract YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default async function VideosPage() {
  const videos = await getVideoData();

  if (!videos) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Video Gallery
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load video gallery data.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  if (videos.length === 0) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-gray-800 dark:text-gray-100">
            Video Gallery
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            There are no videos in the gallery at the moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-20 text-center text-gray-800 dark:text-gray-100">
          Video Gallery
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => {
            const youtubeId = getYouTubeId(video.link);
            return (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col"
              >
                {youtubeId ? (
                  <div className="aspect-video w-full"> {/* 16:9 aspect ratio for videos */}
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                      title={video.videoname}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-t-xl"
                    ></iframe>
                  </div>
                ) : (
                  // Fallback for non-YouTube links or if ID extraction fails
                  <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-xl">
                    <Link href={video.link} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline p-4 text-center">
                        Watch Video: {video.videoname}
                    </Link>
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {video.videoname}
                  </h2>
                  {video.description && (
                    <div
                      className="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: video.description }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}