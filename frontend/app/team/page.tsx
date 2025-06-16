import { AlertTriangle, Users } from 'lucide-react';
import { TeamSections } from '@/components/main/TeamSections'; // <-- Import our new client component

// --- Your Data Structure and Fetching Logic (Unchanged) ---
export interface TeamMemberItem {
  id: number;
  name: string;
  email: string;
  message: string | null;
  position: string;
  position_display: string;
  linkedin_url: string | null;
  instagram_url: string | null;
  image: string;
}

async function getTeamData(): Promise<TeamMemberItem[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    // IMPORTANT: Make sure your image URLs from the API are absolute URLs
    // e.g., 'http://127.0.0.1:8000/media/images/santu.jpg'
    // not '/media/images/santu.jpg'
    const apiUrl = `${baseUrl}/api/coreteam/`;
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      console.error("Failed to fetch team data:", response.status, response.statusText);
      return null;
    }
    
    // Modify image URLs to be absolute if they are relative
    const data: TeamMemberItem[] = await response.json();
    return data.map(member => ({
      ...member,
      image: member.image.startsWith('http') ? member.image : `${baseUrl}${member.image}`
    }));

  } catch (error) {
    console.error("Error fetching or parsing team data:", error);
    return null;
  }
}

const positionOrder: { [key: string]: number } = {
  'A': 1, 'B': 2, 'D': 3, 'C': 4,
};

// --- Main Page Component ---
export default async function TeamPage() {
  const teamData = await getTeamData();

  // --- Error and Empty States (Unchanged) ---
  if (!teamData) {
    return (
      <main className="w-full bg-transparent">
        <div className="container mx-auto flex min-h-[calc(100vh-130px)] flex-col items-center justify-center p-4 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-destructive" />
          <h1 className="mb-4 text-3xl font-bold text-destructive">Failed to Load Team Data</h1>
          <p className="max-w-md text-muted-foreground">
            There was an issue connecting to the server. Please check back later.
          </p>
        </div>
      </main>
    );
  }
  if (teamData.length === 0) {
    return (
      <main className="w-full bg-transparent">
        <div className="container mx-auto flex min-h-[calc(100vh-130px)] flex-col items-center justify-center p-4 text-center">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="mt-2 text-lg text-muted-foreground">Information is currently unavailable.</p>
        </div>
      </main>
    );
  }

  // --- Grouping and Sorting Logic (Unchanged) ---
  const groupedMembers = teamData.reduce((acc, member) => {
    const key = member.position_display || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(member);
    return acc;
  }, {} as { [key: string]: TeamMemberItem[] });

  const sortedGroupKeys = Object.keys(groupedMembers).sort((a, b) => {
    const posA = teamData.find(m => m.position_display === a)?.position || '';
    const posB = teamData.find(m => m.position_display === b)?.position || '';
    return (positionOrder[posA] || 99) - (positionOrder[posB] || 99);
  });

  return (
    <main className="min-h-screen bg-gray-900 dark:bg-black">
      <div className="text-center pt-20 pb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Meet the Core Team
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
          The brilliant minds organizing and leading the initiative.
        </p>
      </div>
      {/* --- RENDER THE CLIENT COMPONENT WITH THE PROCESSED DATA --- */}
      <TeamSections groupedMembers={groupedMembers} sortedGroupKeys={sortedGroupKeys} />
    </main>
  );
}