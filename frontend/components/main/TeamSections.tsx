"use client";

import { HoverEffect, HoverCardItem } from "../ui/card-hover-effect";
import { TeamMemberItem } from "@/app/team/page"; // Import the type from your page

interface TeamSectionsProps {
  groupedMembers: { [key: string]: TeamMemberItem[] };
  sortedGroupKeys: string[];
}

export function TeamSections({ groupedMembers, sortedGroupKeys }: TeamSectionsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {sortedGroupKeys.map((groupKey) => {
        const members = groupedMembers[groupKey];

        // --- DATA TRANSFORMATION ---
        // Convert the API data (TeamMemberItem) into the format our card expects (HoverCardItem)
        const cardItems: HoverCardItem[] = members.map((member) => ({
          title: member.name,
          description: member.position_display, // Using the display name for the role
          image: member.image,
          email: member.email,
          linkedin_url: member.linkedin_url,
          instagram_url: member.instagram_url,
          link: member.linkedin_url || '#', // Use LinkedIn as the main link, or fallback
        }));

        return (
          // Render a section only if there are members in that group
          members.length > 0 && (
            <section key={groupKey} className="mb-16">
              {/* This is the container with the requested styling */}
              <div className="bg-blue-950/30 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 text-center mb-10">
  {groupKey}
</h2>

                <HoverEffect items={cardItems} />
              </div>
            </section>
          )
        );
      })}
    </div>
  );
}