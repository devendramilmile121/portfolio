import { useEffect, useState, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import { getBlogSync } from "@/data/blogs";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GiscusComments } from "@/components/GiscusComments";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { readingMinutes } from "@/lib/format";

// Heading text -> URL-friendly id, so posts can link to their own sections
function generateId(children: ReactNode): string {
  return String(children)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const heading =
  (Tag: "h2" | "h3" | "h4" | "h5" | "h6") =>
  ({ children }: { children?: ReactNode }) => <Tag id={generateId(children)}>{children}</Tag>;

// Styling comes from the .article rules in index.css; these only add ids, safe links and table scrolling
const markdownComponents: Components = {
  // A post's own h1 would duplicate the page title, so it renders one level down
  h1: heading("h2"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  h5: heading("h5"),
  h6: heading("h6"),
  img: ({ alt, src }) => <img alt={alt ?? ""} src={src} loading="lazy" decoding="async" />,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
  a: ({ children, href }) => {
    if (href?.startsWith("#")) {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(href.slice(1))?.scrollIntoView();
            history.replaceState(null, "", href);
          }}
        >
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

// Posts open with their own "# Title" (or "## Title"), which would repeat the page heading
const stripLeadingTitle = (body: string) => body.replace(/^\s*#{1,2}\s+[^\n]*\n/, "");

export default function BlogDetail() {
  useScrollToTop();
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogSync(slug) ?? null : null;
  const [rehypePlugins, setRehypePlugins] = useState<PluggableList>([]);

  // Syntax highlighting loads on demand, so it stays out of the main bundle
  useEffect(() => {
    let mounted = true;
    import("rehype-highlight")
      .then((mod) => {
        if (mounted) setRehypePlugins([mod.default]);
      })
      .catch((err) => console.warn("rehype-highlight failed to load", err));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (post) document.title = `${post.title} — Devendra Milmile`;
  }, [post]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {post === null && (
          <div className="mx-auto max-w-[44rem] px-5 py-24 sm:px-8">
            <p className="label">404</p>
            <h1 className="mt-4 font-serif text-4xl">That post doesn't exist.</h1>
            <p className="mt-6">
              <Link to="/blogs" className="link">
                <span aria-hidden="true">←</span> All writing
              </Link>
            </p>
          </div>
        )}

        {post && (
          <article className="mx-auto max-w-[44rem] px-5 pb-24 pt-10 sm:px-8 md:pt-16">
            <Link to="/blogs" className="label link hover:text-foreground">
              <span aria-hidden="true">←</span> Writing
            </Link>

            <header className="mt-10 border-b border-rule pb-10">
              <p className="font-mono text-xs text-muted-foreground">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                </time>
                <span aria-hidden="true"> · </span>
                {readingMinutes(post.body)} min read
              </p>
              <h1 className="mt-4 font-serif text-[2.25rem] leading-[1.1] tracking-[-0.015em] sm:text-[3rem]">{post.title}</h1>
              <p className="mt-5 font-serif text-xl italic leading-snug text-muted-foreground">{post.summary}</p>
              {post.tags.length > 0 && (
                <p className="mt-6 font-mono text-xs text-muted-foreground">{post.tags.join(" / ")}</p>
              )}
            </header>

            <div className="article mt-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins} components={markdownComponents}>
                {stripLeadingTitle(post.body)}
              </ReactMarkdown>
            </div>

            <section aria-labelledby="comments-heading" className="mt-20 border-t border-rule pt-10">
              <h2 id="comments-heading" className="label">
                Comments
              </h2>
              <div className="mt-6">
                <GiscusComments slug={slug ?? ""} />
              </div>
            </section>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
