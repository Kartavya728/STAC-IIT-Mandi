// src/components/main/Achievements.tsx (or Achivements.tsx)
// (Your existing code is fine)
import React from 'react';
import { Achievement } from '@/app/page';
import Link from 'next/link';

interface AchievementsComponentProps {
  achievements: Achievement[];
}

const AchievementsComponent: React.FC<AchievementsComponentProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900" id="achievements">
        <p className="text-white">No achievements to display.</p>
      </div>
    );
  }
  return (
    <div className="py-16 sm:py-24 flex items-center justify-center p-4 bg-gray-900" id="achievements">
      <div
        className="
          w-full max-w-4xl
          p-6 sm:p-8 md:p-10
          rounded-2xl
          shadow-2xl
          bg-gradient-to-br from-gray-800 via-purple-900/70 to-blue-900/70
          backdrop-blur-lg
          text-white
        "
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Our Achievements
        </h2>
        <ul className="space-y-6">
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <Link href={achievement.link} legacyBehavior passHref>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block p-5 rounded-xl
                    bg-black/30
                    hover:bg-black/40
                    transition-all duration-300 ease-in-out
                    transform hover:scale-[1.03]
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
                    shadow-md hover:shadow-purple-500/30
                  "
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-100 hover:text-white mb-2">
                    {achievement.achievement}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 mt-2 break-all italic truncate">
                    {achievement.link}
                  </p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AchievementsComponent;