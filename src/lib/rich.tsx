import { Fragment, type ReactNode } from "react";

// Inline markup allowed in portfolio.json text: *emphasis* and [link text](url)
const TOKEN = /(\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

const isInternal = (href: string) => href.startsWith("#") || href.startsWith("/");

export function renderRich(text: string, options: { emphasisClassName?: string } = {}): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const key = `${i}:${part}`;
    const link = LINK.exec(part);
    if (link) {
      const [, label, href] = link;
      return (
        <a
          key={key}
          href={href}
          className="link-quiet"
          {...(isInternal(href) ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {label}
        </a>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={key} className={options.emphasisClassName}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}
