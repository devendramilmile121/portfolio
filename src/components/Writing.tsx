import { Link } from "react-router-dom";
import { getListedBlogs } from "@/data/blogs";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { formatMonthYear, readingMinutes } from "@/lib/format";
import { Section } from "./Section";

const LATEST_COUNT = 5;

export const Writing = () => {
  const { config } = usePortfolioConfig();
  const posts = getListedBlogs();

  if (config?.blogs?.enabled === false || posts.length === 0) return null;

  return (
    <Section
      id="writing"
      index="03"
      title="Writing"
      aside={<p>Notes on Angular, .NET and the problems I run into at work.</p>}
    >
      <ul className="border-t border-rule">
        {posts.slice(0, LATEST_COUNT).map((post) => (
          <li key={post.slug} className="border-b border-rule">
            <Link
              to={`/blogs/${post.slug}`}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
            >
              <span className="order-2 col-span-2 font-mono text-xs text-muted-foreground sm:order-none sm:col-span-1">
                {formatMonthYear(post.date)}
              </span>
              <span className="font-serif text-[1.3125rem] leading-snug transition-colors group-hover:text-primary">
                {post.title}
              </span>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                {readingMinutes(post.body)} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {posts.length > LATEST_COUNT && (
        <p className="mt-6 text-[0.9375rem]">
          <Link to="/blogs" className="link">
            All {posts.length} posts <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}
    </Section>
  );
};
