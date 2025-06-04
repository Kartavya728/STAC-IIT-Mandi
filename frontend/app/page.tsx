// src/app/page.tsx
import About from "@/components/main/About";
import AchievementsComponent from "@/components/main/Achivements"; // Note: Typo "Achivements" vs "Achievements" - ensure consistency
import ActivitiesComponent from "@/components/main/Activities";
import FestComponent from "@/components/main/Fest";
import Hero from "@/components/main/Hero";
import ProjectsComponent from "@/components/main/Projects";

// --- Type Definitions ---
// (Your existing type definitions remain the same)
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/homepage/';
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }
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
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          {/* Adjust min-height based on your Navbar and Footer height */}
          <p className="text-xl text-destructive dark:text-destructive-foreground font-semibold">
            Failed to load homepage data.
          </p>
          <p className="text-md text-muted-foreground mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full"> {/* Main container, overflow-x-hidden might be better on individual problem sections if needed */}
      <div className="flex flex-col">
        <Hero /> {/* Assumed to be full-width or manage its own container */}

        {/* Wrapper for overlapping sections */}
        {/* The negative top margin is a stylistic choice. Adjust as needed. */}
        {/* Consider if this overlapping is desired on all screen sizes. */}
        <div className="relative z-10 -mt-24 sm:-mt-32 md:-mt-40 lg:-mt-48 xl:-mt-56">
          {/*
            Each component below should ideally handle its own internal padding (py-*)
            and use <div className="container mx-auto px-4 sm:px-6 lg:px-8"> for content.
          */}
          <About />

          {homepageData.clubactivity && homepageData.clubactivity.length > 0 && (
            <ActivitiesComponent activities={homepageData.clubactivity} />
          )}

          {/* The nested div with negative top here might create very complex stacking. */}
          {/* It might be simpler to manage the spacing between ActivitiesComponent and FestComponent directly. */}
          {/* For example, ActivitiesComponent could have less bottom padding, or FestComponent more top padding. */}
          <div className="relative"> {/* Removed -top-16; manage spacing via component padding */}
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