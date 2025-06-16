// app/videos/page.tsx
import React from 'react';
import Link from 'next/link';
import { PlayCircle, AlertTriangle, VideoOff } from 'lucide-react'; // Icons for a better UI

// --- Type Definition for Video ---
interface VideoItem {
  id: number;
  videoname: string;
  link: string; // URL to the video
  description: string | null;
}

// --- Data Fetching Function ---
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
    return Array.isArray(data) ? (data as VideoItem[]) : null;
  } catch (error) {
    console.error("Error fetching or parsing Video Gallery data:", error);
    return null;
  }
}

// --- Helper Function ---
// Helper to extract YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};


// --- UI Component for Displaying States (Error / Empty) ---
const StateDisplay = ({ icon, title, message }: { icon: React.ReactNode, title: string, message: string }) => (
    <div className="flex flex-col items-center justify-center text-center py-20 mt-10 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700">
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="mt-2 text-md text-gray-600 dark:text-gray-400 max-w-sm">{message}</p>
    </div>
);


// --- UI Component for a Single Video Card ---
const VideoCard = ({ video }: { video: VideoItem }) => {
    const youtubeId = getYouTubeId(video.link);

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="relative aspect-video w-full">
            {youtubeId ? (
              <>
                {/* Embedded YouTube Player */}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0`}
                  title={video.videoname}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="transition-opacity duration-300"
                ></iframe>
                 {/* Play icon overlay on hover */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <PlayCircle className="h-16 w-16 text-white" />
                </div>
              </>
            ) : (
              // Fallback for non-YouTube links
              <div className="flex h-full w-full items-center justify-center rounded-t-xl bg-gray-200 dark:bg-gray-700">
                <Link href={video.link} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline p-4 text-center font-semibold">
                    <PlayCircle className="h-5 w-5"/>
                    Watch Video
                </Link>
              </div>
            )}
          </div>
          <div className="p-5 md:p-6 flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {video.videoname}
            </h2>
            {video.description && (
              <div
                className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: video.description }}
              />
            )}
          </div>
        </div>
      );
}

// --- Main Page Component ---
export default async function VideosPage() {
  const videos = await getVideoData();

  return (
    // Transparent background to inherit from layout. Added top margin via padding.
    <main className="h-full w-full bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Page Title with the requested orange-to-yellow gradient theme */}
        <h1 className="mb-16 md:mb-20 text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Video Gallery
          </span>
        </h1>

        {/* Conditional Rendering Logic */}
        {(() => {
          if (!videos) {
            return (
              <StateDisplay
                icon={<AlertTriangle className="h-16 w-16 text-red-500" />}
                title="Failed to Load Videos"
                message="There was an error connecting to the gallery. Please try again later."
              />
            );
          }
          if (videos.length === 0) {
            return (
              <StateDisplay
                icon={<VideoOff className="h-16 w-16 text-gray-400" />}
                title="Gallery is Empty"
                message="There are no videos in the gallery at the moment. Check back soon!"
              />
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          );
        })()}
      </div>
    </main>
  );
}