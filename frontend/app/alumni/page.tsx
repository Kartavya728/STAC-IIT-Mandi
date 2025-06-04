// app/alumni/page.tsx

// ... (Keep existing imports and TeamMemberItem interface)
// --- Type Definition for Alumni ---
interface AlumniItem {
  id: number;
  name: string;
  email: string;
  message: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  image: string; // This will be the full URL from Django
}
// --- End Type Definition ---


async function getAlumniData(): Promise<AlumniItem[] | null> {
  try {
    // Using NEXT_PUBLIC_API_URL for consistency with your homepage example
    // and targeting the correct /api/alumni/ endpoint.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; // Fallback
    const apiUrl = `${baseUrl}/api/alumni/`;
    console.log("Fetching alumni data from:", apiUrl); // For debugging

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Failed to fetch alumni data:",
        response.status,
        response.statusText,
        "Error Body:", errorBody
      );
      return null;
    }

    const data = await response.json();

    // Crucial check: Ensure the parsed data is actually an array
    if (!Array.isArray(data)) {
      console.error("Alumni data fetched is not an array. Received:", data);
      return null;
    }

    return data as AlumniItem[];

  } catch (error) {
    console.error("Error fetching or parsing alumni data:", error);
    return null;
  }
}

// ... (The rest of your AlumniPage component remains the same)
export default async function AlumniPage() {
  const alumniData = await getAlumniData();

  if (!alumniData) { // This handles null from fetching or if data is not an array
    return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-130px)] py-10 text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Our Alumni
          </h1>
          <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
            Failed to load alumni data.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </main>
    );
  }

  if (alumniData.length === 0) {
     return (
      <main className="h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-130px)]">
          <h1 className="text-5xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400">
            Our Alumni
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400">
            No alumni information is available at the moment.
          </p>
        </div>
      </main>
    );
  }
  // ... rest of the component rendering logic using alumniData
    return (
    <main className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-20 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400">
          Our Esteemed Alumni
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {alumniData.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col items-center p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-sky-500/30"
            >
              <div className="relative w-36 h-36 rounded-full overflow-hidden mb-5 border-4 border-sky-300 dark:border-sky-600">
                <Image
                  src={alumnus.image || '/default-avatar.png'} // Provide a fallback avatar
                  alt={alumnus.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-1 text-gray-800 dark:text-white">
                {alumnus.name}
              </h2>
              {alumnus.message && alumnus.message !== 'andhera_kayam_rahe' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic line-clamp-2">
                  “{alumnus.message}”
                </p>
              )}

              <div className="flex space-x-4 mt-auto pt-4">
                {alumnus.linkedin_url && alumnus.linkedin_url !== 'linkedin' && (
                  <Link href={alumnus.linkedin_url} target="_blank" rel="noopener noreferrer"
                     className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors">
                    <Linkedin size={24} />
                  </Link>
                )}
                {alumnus.instagram_url && alumnus.instagram_url !== 'instagram' && (
                  <Link href={alumnus.instagram_url} target="_blank" rel="noopener noreferrer"
                     className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 transition-colors">
                    <Instagram size={24} />
                  </Link>
                )}
                {alumnus.email && alumnus.email !== 'email' && (
                  <a href={`mailto:${alumnus.email}`}
                     className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}