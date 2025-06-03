// src/components/main/Projects.tsx
import React from 'react';
import { Project } from '@/app/page'; // Import the Project type
import Image from 'next/image'; // Using Next.js Image component for optimization

interface ProjectsComponentProps {
  projects: Project[];
}

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 bg-gray-900" id="projects">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-xl">No projects to display at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-900" id="projects">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Our Innovative Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105"
            >
              {project.image_url ? (
                <div className="relative w-full h-56"> {/* Fixed height container for image */}
                  <Image
                    src={project.image_url} // Use the absolute URL from backend
                    alt={project.topic}
                    layout="fill" // Fills the parent container
                    objectFit="cover" // Cover, contain, etc.
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="w-full h-56 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">{project.topic}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{project.description}</p>
                {/* You can add a "Read More" link or other actions here */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsComponent;