import React from 'react';
import { Star } from 'lucide-react';

// An array to hold the list items, keeping the JSX clean.
const projectGoals = [
  "Introduce people to remote telescope observations, especially relevant in times of restricted social interactions.",
  "Maintain a server for managing and running open-source projects in astrophysics (see our GitHub).",
  "Launch a Balloon Satellite project with local college students to introduce them to Space Technology and collaborative work, used for remote mapping of Himalayan agricultural land.",
  "Commit to open-source principles, with all data being freely accessible to everyone.",
  "Upgrade equipment with small telescopes to conduct observation sessions in local villages.",
  "Organize educational trips to the ARIES observatory and other prominent labs across India.",
  "Host data-thons, inviting students from other institutes to build solutions using satellite data.",
  "Conduct remote and on-site sessions on basic astronomy in the Mandi, Kullu, and Manali districts.",
  "Collaborate with local primary schools to introduce them to solar cycle observations using solar filters.",
  "Introduce local communities to astro-tourism for income generation, leveraging our clear night skies."
];


export default function IauPartnershipPage() {
  return (
    // Set background to transparent to inherit from parent layout
    <main className="bg-transparent">

      {/* Main Content container with vertical padding for spacing */}
      <div className="container mx-auto max-w-4xl px-6 py-16 sm:py-24">

        {/* Page Header */}
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Our Partnership with the
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    International Astronomical Union
                </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              STAC is proud to be a recipient of funding from the IAU Office of Astronomy for Development (OAD). This support is pivotal for our mission to expand astronomy education and outreach within our college and the surrounding Himalayan regions.
            </p>
        </div>
        
        {/* Divider */}
        <div className="my-16 h-px bg-gray-200 dark:bg-gray-800"></div>

        {/* List of Initiatives */}
        <div className="">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              Key Initiatives
            </h2>
            <ul className="space-y-6">
              {projectGoals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
                      <div className="flex-shrink-0 pt-1">
                         {/* Themed Icon for visual appeal */}
                         <Star className="h-6 w-6 text-orange-500" aria-hidden="true" />
                      </div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                          {goal}
                      </p>
                  </li>
              ))}
            </ul>
        </div>

      </div>
    </main>
  );
}