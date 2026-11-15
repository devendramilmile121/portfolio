import matter from 'gray-matter';
import { Buffer } from 'buffer';

// gray-matter expects Node's Buffer; give the browser a polyfill (Node, during pre-rendering, has its own)
if (typeof window !== 'undefined') {
  const w = window as unknown as { global?: unknown; Buffer?: typeof Buffer };
  w.global ??= window;
  w.Buffer ??= Buffer;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  body: string;
  /** Still served at its URL, but left out of lists and the sitemap and marked noindex */
  unlisted: boolean;
}

interface FrontMatter {
  title: string;
  date: string | Date;
  summary: string;
  tags?: string[];
  unlisted?: boolean;
}

// Every .md file under src/blogs, bundled at build time
const blogModules = import.meta.glob<string>('../blogs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

let cachedBlogs: BlogPost[] | null = null;

/**
 * All posts, newest first. Synchronous because the files are bundled, which lets pages render
 * their content on the first pass, including during build-time pre-rendering.
 */
export function getAllBlogs(): BlogPost[] {
  if (cachedBlogs) return cachedBlogs;

  const posts: BlogPost[] = [];
  for (const [filePath, rawContent] of Object.entries(blogModules)) {
    try {
      const slug = (filePath.split('/').pop() ?? '').replace(/\.md$/, '').toLowerCase();
      const { data, content } = matter(String(rawContent));
      const front = data as FrontMatter;
      posts.push({
        slug,
        title: front.title,
        // YAML may parse an unquoted date into a Date object
        date: front.date instanceof Date ? front.date.toISOString().slice(0, 10) : String(front.date),
        summary: front.summary,
        tags: front.tags ?? [],
        body: content,
        unlisted: front.unlisted === true,
      });
    } catch (error) {
      console.error(`[Blogs] Error loading blog ${filePath}:`, error);
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cachedBlogs = posts;
  return posts;
}

/** Posts to show in lists: everything except unlisted ones */
export function getListedBlogs(): BlogPost[] {
  return getAllBlogs().filter((post) => !post.unlisted);
}

export function getBlogSync(slug: string): BlogPost | undefined {
  return getAllBlogs().find((post) => post.slug === slug);
}
