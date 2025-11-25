import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogBySlug, BlogPost } from "@/data/blogs";
import { useTheme } from "@/hooks/use-theme";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GiscusComments } from "@/components/GiscusComments";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Dynamically load highlight.js styles based on theme
function loadHighlightTheme(theme: string) {
  // Remove existing highlight.js link if present
  const existingLink = document.querySelector('link[data-highlight-theme]');
  if (existingLink) {
    existingLink.remove();
  }

  // Determine which highlight.js theme to use
  let highlightTheme: string;
  
  switch(theme) {
    case 'dark':
    case 'github':
    case 'yellow':
    case 'green':
      highlightTheme = 'atom-one-dark';
      break;
    case 'white':
      highlightTheme = 'atom-one-light';
      break;
    default:
      highlightTheme = 'atom-one-dark';
  }

  // Create and inject the stylesheet
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${highlightTheme}.min.css`;
  link.dataset.highlightTheme = 'true';
  document.head.appendChild(link);
}

// Helper function to convert heading text to URL-friendly ID
function generateId(text: string): string {
  if (typeof text === 'string') {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }
  return '';
}

// Custom components for markdown rendering
const markdownComponents = {
  img: ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      alt={alt}
      src={src}
      {...props}
      className="my-6 rounded-lg shadow-lg max-w-full h-auto"
    />
  ),
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code
          className="bg-secondary/30 px-1.5 py-0.5 rounded text-sm font-mono text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }: any) => (
    <pre className="my-4 rounded-lg overflow-x-auto bg-secondary/20 p-4 border border-border/40">
      {children}
    </pre>
  ),
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-border/40">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border/40 px-4 py-2 bg-secondary/20 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border/40 px-4 py-2">{children}</td>
  ),
  h1: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h1 id={id} className="text-4xl font-bold my-6 mt-8 text-primary">{children}</h1>
    );
  },
  h2: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h2 id={id} className="text-3xl font-bold my-5 mt-8 text-primary">{children}</h2>
    );
  },
  h3: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h3 id={id} className="text-2xl font-bold my-4 mt-6 text-primary">{children}</h3>
    );
  },
  h4: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h4 id={id} className="text-xl font-bold my-3 mt-4 text-primary">{children}</h4>
    );
  },
  h5: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h5 id={id} className="text-lg font-bold my-3 text-primary">{children}</h5>
    );
  },
  h6: ({ children }: any) => {
    const id = generateId(String(children));
    return (
      <h6 id={id} className="text-base font-bold my-2 text-primary">{children}</h6>
    );
  },
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside my-4 space-y-2 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside my-4 space-y-2 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="ml-2">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="my-4 pl-4 border-l-4 border-primary/30 italic text-muted-foreground bg-secondary/10 py-2 pr-4 rounded">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: any) => {
    // Check if it's an anchor link (internal navigation)
    if (href && href.startsWith('#')) {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            const id = href.substring(1); // Remove the # symbol
            const element = document.getElementById(id);
            if (element) {
              // Calculate offset to account for fixed navbar and blog header
              // Navbar height: 64px (h-16), Blog header area: ~200px
              const offsetHeight = 300;
              const elementPosition = element.getBoundingClientRect().top + window.scrollY - offsetHeight;
              
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              });
            }
          }}
          className="text-primary hover:text-primary/80 underline transition-colors duration-200 cursor-pointer"
        >
          {children}
        </a>
      );
    }
    
    // External links
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline transition-colors duration-200"
      >
        {children}
      </a>
    );
  },
};

// Estimate reading time in minutes
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function BlogDetail() {
  useScrollToTop();
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const { theme } = useTheme();
  const [rehypePlugins, setRehypePlugins] = useState<any[]>([]);

  // Load highlight.js theme based on current theme
  useEffect(() => {
    loadHighlightTheme(theme);
  }, [theme]);

  // Lazy-load rehype-highlight only when this page mounts to avoid bundling it into the main vendor chunk
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('rehype-highlight');
        if (mounted) setRehypePlugins([mod.default ? mod.default : mod]);
      } catch (e) {
        // Failed to load highlighting - continue without it
        console.warn('rehype-highlight failed to load', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!slug) return;

    getBlogBySlug(slug).then((blog) => {
      setBlog(blog || null);
      if (blog) {
        setReadingTime(calculateReadingTime(blog.body));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
        <Link to="/blogs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary-subtle">
      <Navigation />
      
      <div className="flex-1 py-20 px-6 pt-24">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/blogs" className="inline-block mb-8 animate-fade-in-left">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to blogs
            </Button>
          </Link>

          {/* Header */}
          <article className="animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-6 text-primary">{blog.title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 items-center mb-8 pb-8 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>{new Date(blog.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
              <p className="text-lg text-muted-foreground">{blog.summary}</p>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-3 py-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
              >
                {blog.body}
              </ReactMarkdown>
            </div>

            {/* Divider */}
            <div className="my-12 border-t border-border/40" />

            {/* Comments Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Comments</h2>
              <GiscusComments slug={slug || ""} />
            </div>
          </article>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
