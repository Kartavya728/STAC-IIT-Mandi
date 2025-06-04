// app/team/page.tsx
import React from 'react';
import Image from 'next/image'; // <--- ADD THIS IMPORT
import Link from 'next/link';
import { Linkedin, Instagram, Mail } from 'lucide-react';

// --- Type Definition for Team Member ---
interface TeamMemberItem {
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
// --- End Type Definition ---

// ... rest of your getTeamData function and component

async function getTeamData(): Promise<TeamMemberItem[] | null> {
  try {
    // Using NEXT_PUBLIC_API_URL for consistency
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; // Fallback
    const apiUrl = `${baseUrl}/api/coreteam/`;
    console.log("Fetching team data from:", apiUrl); // For debugging

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch team data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Team data fetched is not an array. Received:", data);
      return null;
    }

    return data as TeamMemberItem[];

  } catch (error) {
    console.error("Error fetching or parsing team data:", error);
    return null;
  }
}

// ... (The rest of your TeamPage component remains the same)
const positionOrder: { [key: string]: number } = {
  'A': 1, // Coordinator
  'B': 2, // Co-coordinator
  'D': 3, // Mentor (Displaying Mentors before Core Team)
  'C': 4, // Core Team
};

export default async function TeamPage() {
  const teamData = await getTeamData();

  if (!teamData) {
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Meet Our Team
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load team data.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  if (teamData.length === 0) {
     return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
            Meet Our Team
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            No team member information is available at the moment.
          </p>
        </div>
      </main>
    );
  }

  // Group members by position
  const groupedMembers: { [key: string]: TeamMemberItem[] } = teamData.reduce((acc, member) => {
    const positionKey = member.position_display || 'Other';
    if (!acc[positionKey]) {
      acc[positionKey] = [];
    }
    acc[positionKey].push(member);
    return acc;
  }, {} as { [key: string]: TeamMemberItem[] });

  // Sort the groups based on defined order
  const sortedGroupKeys = Object.keys(groupedMembers).sort((a, b) => {
    // Find the original key ('A', 'B', 'C', 'D') for sorting
    const posA = teamData.find(m => m.position_display === a)?.position || '';
    const posB = teamData.find(m => m.position_display === b)?.position || '';
    return (positionOrder[posA] || 99) - (positionOrder[posB] || 99);
  });


  return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
          Meet Our Dedicated Team
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-20 max-w-3xl mx-auto">
          The driving force behind STAC, committed to fostering a passion for space science and astronomy.
        </p>

        {sortedGroupKeys.map((position) => (
          <section key={position} className="mb-16">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200 border-b-2 border-emerald-500 pb-4 inline-block mx-auto">
              {position}
            </h2>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center
              ${(groupedMembers[position].length === 1 && (position.includes('Coordinator') || position.includes('Mentor'))) ? 'lg:grid-cols-1 xl:grid-cols-1 max-w-sm mx-auto' : ''}
              ${(groupedMembers[position].length === 2 && (position.includes('Coordinator') || position.includes('Mentor'))) ? 'lg:grid-cols-2 xl:grid-cols-2 max-w-2xl mx-auto' : ''}
            `}>
              {groupedMembers[position].map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col items-center p-6 w-full max-w-xs text-center transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30"
                >
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-5 border-4 border-emerald-300 dark:border-emerald-600">
                    <Image
                      src={member.image || '/default-avatar.png'} // Provide a fallback avatar
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-800 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">
                    {member.position_display}
                  </p>
                  {member.message && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 italic line-clamp-2">
                      {member.message}
                    </p>
                  )}
                  <div className="flex space-x-3 mt-auto pt-3">
                    {member.linkedin_url && (
                      <Link href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        <Linkedin size={20} />
                      </Link>
                    )}
                    {member.instagram_url && (
                      <Link href={member.instagram_url} target="_blank" rel="noopener noreferrer"
                         className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 transition-colors">
                        <Instagram size={20} />
                      </Link>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`}
                         className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}