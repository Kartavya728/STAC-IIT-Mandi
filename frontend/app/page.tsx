// src/app/page.tsx
import About from "@/components/main/About";
import AchievementsComponent from "@/components/main/Achivements";
import ActivitiesComponent from "@/components/main/Activities";
import FestComponent from "@/components/main/Fest";
import Hero from "@/components/main/Hero";
import ProjectsComponent from "@/components/main/Projects"; // Assuming this component exists

// --- Type Definitions ---
export interface Project {
  id: number;
  topic: string;
  description: string;
  image_url: string;
}

export interface ClubActivity {
  id: number;
  activity: string;
  content: string;
  image_url: string;
}

export interface Achievement {
  id: number;
  achievement: string;
  link: string;
}

export interface Fest {
  id: number;
  festname: string;
  description: string;
  link: string;
  image_url: string;
}

export interface HomepageData {
  projects: Project[];
  clubactivity: ClubActivity[];
  achievements: Achievement[];
  fests: Fest[];
}
// --- End Type Definitions ---

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    // Consider using environment variables for your API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/homepage/';
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch homepage data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }
    const data: HomepageData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null;
  }
}

export default async function Home() {
  const homepageData = await getHomepageData();

  if (!homepageData) {
    return (
      <main className="h-full w-full"> {/* Ensure this main doesn't cause overflow */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center"> {/* Added min-h-screen and padding for better error display */}
          <p className="text-xl text-red-500">Failed to load homepage data.</p>
          <p className="text-md text-gray-400 mt-2">Please try again later or contact support.</p>
        </div>
      </main>
    );
  }

  return (
    // This 'main' tag is the primary container for your page content.
    // It should be full width but not exceed viewport width.
    // overflow-x-hidden here is a strong measure if its children are misbehaving.
    <main className="h-full w-full overflow-x-hidden"> {/* ADDED overflow-x-hidden HERE */}
      <div className="flex flex-col"> {/* This div doesn't need specific width/overflow if 'main' handles it */}
        <Hero />
        {/* The negative top margin shifts this block up. Ensure it doesn't cause layout issues with fixed navbars etc. */}
        <div className="relative z-10 -top-24 sm:-top-32 md:-top-48 lg:-top-64"> {/* Adjusted negative top for responsiveness, added z-index */}
          <About />
          {homepageData.clubactivity && homepageData.clubactivity.length > 0 && (
            <ActivitiesComponent activities={homepageData.clubactivity} />
          )}
          <div className="relative -top-16  "> {/* Added z-index to ensure this section is above others if needed */}
          {homepageData.fests && homepageData.fests.length > 0 && (
            <FestComponent fests={homepageData.fests} />
          )}
          </div>

          {homepageData.projects && homepageData.projects.length > 0 && (
            <ProjectsComponent projects={homepageData.projects} />
          )}
          {homepageData.achievements && homepageData.achievements.length > 0 && (
            <AchievementsComponent achievements={homepageData.achievements} />
          )}
        </div>
      </div>
    </main>
  );
}