import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof global === 'undefined') {
  (window as any).global = window;
}
(window as any).Buffer = Buffer;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  body: string;
}

interface FrontMatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

// Dynamic blog files loader using Vite's import.meta.glob()
// This automatically discovers all .md files in the blogs directory
const blogModules = import.meta.glob<string>('../blogs/**/*.md', { 
  query: '?raw', 
  import: 'default',
  eager: true 
});

let cachedBlogs: BlogPost[] | null = null;

/**
 * Load and parse all blog posts dynamically from the blogs directory
 */
export async function loadBlogs(): Promise<BlogPost[]> {
  if (cachedBlogs) {
    return cachedBlogs;
  }

  const blogPosts: BlogPost[] = [];

  for (const [filePath, rawContent] of Object.entries(blogModules)) {
    try {
      // Extract filename from path (e.g., '../blogs/getting-started-with-react.md' -> 'getting-started-with-react')
      const filename = filePath.split('/').pop() || '';
      const slug = filename.replace('.md', '').toLowerCase();

      // Content is already a string from import.meta.glob with ?raw
      const content = String(rawContent);

      // Parse frontmatter and body using gray-matter
      const { data, content: body } = matter(content);

      const frontmatter = data as FrontMatter;

      blogPosts.push({
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        summary: frontmatter.summary,
        tags: frontmatter.tags || [],
        body,
      });
      
    } catch (error) {
      console.error(`[Blogs] Error loading blog ${filePath}:`, error);
    }
  }

  // Sort by date (newest first)
  blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  cachedBlogs = blogPosts;
  return blogPosts;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const blogs = await loadBlogs();
  const found = blogs.find(blog => {
    return blog.slug === slug;
  });
  return found;
}

/**
 * Get blogs filtered by tag
 */
export async function getBlogsByTag(tag: string): Promise<BlogPost[]> {
  const blogs = await loadBlogs();
  return blogs.filter(blog => blog.tags.includes(tag));
}

/**
 * Get all unique tags from all blogs
 */
export async function getAllTags(): Promise<string[]> {
  const blogs = await loadBlogs();
  const tags = new Set<string>();
  blogs.forEach(blog => {
    blog.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
