// app/blogs/page.tsx

import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// --- Type Definition for a single blog post ---
interface BlogPost {
  slug: string;
  title: string;
  author: string;
  categories: string[];
  image?: string;
  content: string;
}

// Helper function to read the JSON data with the CORRECTED path
const getBlogData = (): BlogPost[] => {
  // This path now correctly points to your blogs.json file
  const filePath = path.join(process.cwd(), 'app', 'blogs', 'blogs.json');
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Could not read or parse blogs.json:", error);
    return []; // Return an empty array on error
  }
};

// --- The Main Blog Listing Page Component ---
export default function BlogsListPage() {
  const allBlogs = getBlogData();

  if (allBlogs.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
        <p className="text-muted-foreground">No blog posts found. Check if blogs.json exists and is readable.</p>
      </div>
    );
  }

  return (
    // Add padding to push content below the fixed navbar
    <div className="pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            STAC Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Updates, articles, and stories from the Space Technology and Astronomy Cell.
          </p>
        </header>
        
        {/* Grid layout for the blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  By {blog.author}
                </p>
                <div 
                  className="mt-3 text-sm text-foreground/80 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}
                />
                <div className="mt-auto pt-4 text-sm font-semibold text-primary">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}