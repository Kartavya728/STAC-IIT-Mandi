// app/blogs/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// --- Type Definition ---
interface BlogPost {
  slug: string;
  title: string;
  author: string;
  categories: string[];
  image?: string;
  content: string;
}

// Helper function with the CORRECTED path
const getBlogData = (): BlogPost[] => {
  // Path relative to the project root (where next.js runs)
  const filePath = path.join(process.cwd(), 'app', 'blogs', 'blogs.json');
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Could not read blogs.json for [slug] page:", error);
    return [];
  }
};

// This function tells Next.js which blog pages to pre-build
export async function generateStaticParams() {
  const blogs = getBlogData();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// --- The Main Dynamic Blog Page Component ---
export default function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blogs = getBlogData();
  
  // Find the specific blog post that matches the slug from the URL
  const blog = blogs.find((post) => post.slug === slug);

  // If no blog post with that slug is found, show the 404 page
  if (!blog) {
    notFound();
  }

  return (
    // Add pt-24 to push content below the fixed navbar
    <div className="pt-24 pb-16">
      <article className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="text-base text-muted-foreground mb-2">
            In {blog.categories.join(', ')}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {blog.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            By {blog.author}
          </p>
        </header>

        {/* Optional Main Image */}
        {blog.image && (
          <div className="mb-12">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}