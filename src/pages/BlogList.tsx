import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getListedBlogs, type BlogPost } from "@/data/blogs";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { formatDayMonth, readingMinutes } from "@/lib/format";
import { cn } from "@/lib/utils";

// "Web Development" and "web-development" are the same topic
const normalizeTag = (tag: string) => tag.trim().toLowerCase().replace(/[-_]+/g, " ");

export default function BlogList() {
  useScrollToTop();
  const posts = getListedBlogs();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Writing — Devendra Milmile";
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) =>
      new Set(post.tags.map(normalizeTag)).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1))
    );
    // Most-used topics first; one-off tags would only add noise to the filter row
    return [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !post.tags.some((tag) => normalizeTag(tag) === activeTag)) return false;
      if (!q) return true;
      return [post.title, post.summary, ...post.tags].some((text) => text.toLowerCase().includes(q));
    });
  }, [posts, query, activeTag]);

  const byYear = useMemo(() => {
    const groups = new Map<string, BlogPost[]>();
    filtered.forEach((post) => {
      const year = post.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    });
    return [...groups.entries()];
  }, [filtered]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="mx-auto max-w-page px-5 pb-12 pt-12 sm:px-8 md:pt-20">
          <p className="label">Writing</p>
          <h1 className="mt-6 max-w-[48rem] font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-6xl">
            Notes on Angular, .NET and the problems I run into at work.
          </h1>
          <p className="mt-6 text-muted-foreground">{posts.length} posts, newest first.</p>

          <div className="mt-12 grid gap-6 border-t border-rule pt-6 md:grid-cols-12">
            <label className="md:col-span-4">
              <span className="sr-only">Search posts</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts"
                className="w-full border-b border-rule bg-transparent pb-2 text-[0.9375rem] placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </label>
            {tags.length > 0 && (
              <fieldset className="flex flex-wrap items-baseline gap-x-4 gap-y-2 md:col-span-8 md:justify-end">
                <legend className="sr-only">Filter by topic</legend>
                {[null, ...tags].map((tag) => (
                  <button
                    key={tag ?? "all"}
                    type="button"
                    aria-pressed={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "label transition-colors hover:text-foreground",
                      activeTag === tag && "text-primary underline underline-offset-4"
                    )}
                  >
                    {tag ?? "All"}
                  </button>
                ))}
              </fieldset>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-page px-5 pb-24 sm:px-8">
          {filtered.length === 0 && (
            <p className="border-t border-rule py-10 text-muted-foreground">No posts match that search.</p>
          )}
          {byYear.map(([year, yearPosts]) => (
            <section key={year} aria-labelledby={`year-${year}`} className="grid gap-x-8 border-t border-rule md:grid-cols-12">
              <h2 id={`year-${year}`} className="pt-6 font-mono text-xs text-muted-foreground md:col-span-3">
                {year}
              </h2>
              <ul className="md:col-span-9">
                {yearPosts.map((post, i) => (
                  <li key={post.slug} className={cn(i > 0 && "border-t border-rule")}>
                    <Link to={`/blogs/${post.slug}`} className="group block py-6">
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDayMonth(post.date)} <span aria-hidden="true">·</span> {readingMinutes(post.body)} min read
                      </p>
                      <h3 className="mt-2 font-serif text-[1.5rem] leading-snug transition-colors group-hover:text-primary sm:text-[1.75rem]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 max-w-measure text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
