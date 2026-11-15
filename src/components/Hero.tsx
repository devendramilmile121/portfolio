import { Fragment, useEffect, useState } from "react";
import portrait480 from "@/assets/portrait-480.webp";
import portrait960 from "@/assets/portrait-960.webp";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { formatPuneTime } from "@/lib/format";

const SOCIAL_LABELS: Record<string, string> = {
  email: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
  npm: "npm",
  resume: "Résumé",
};

// Text wrapped in *asterisks* in the config renders as an italic accent
function renderEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={`${i}:${part}`} className="italic text-primary">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={`${i}:${part}`}>{part}</Fragment>
    )
  );
}

function useClock() {
  const [time, setTime] = useState(() => formatPuneTime());
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatPuneTime()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export const Hero = () => {
  const { config } = usePortfolioConfig();
  const time = useClock();

  if (!config) {
    // Reserve the hero's height while the config loads, so nothing jumps
    return <div className="min-h-[70vh]" aria-hidden="true" />;
  }

  const hero = config.hero;

  return (
    <section id="top" aria-label="Introduction" className="mx-auto max-w-page px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-20">
      {/* Three grid items. Mobile stacks them as a feature opener: headline, full-width portrait, intro.
          Desktop puts headline and intro in the left eight columns and the portrait beside both. */}
      <div className="grid gap-x-8 md:grid-cols-12">
        <div className="md:col-span-8 md:row-start-1">
          <p className="label">
            {hero.role ?? "Engineer"} <span aria-hidden="true">·</span> {hero.contact.location}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] font-normal leading-[1.04] tracking-[-0.02em] sm:text-6xl md:mt-6 lg:text-[4.75rem]">
            <span className="sr-only">{hero.name}. </span>
            {renderEmphasis(hero.title)}
          </h1>
        </div>

        <figure className="mt-10 md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1 md:mt-0 md:self-start md:pt-2">
          <img
            src={portrait480}
            srcSet={`${portrait480} 480w, ${portrait960} 960w`}
            sizes="(min-width: 768px) 22rem, 100vw"
            alt={`Illustrated portrait of ${hero.name}`}
            width={480}
            height={640}
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-sm object-cover object-[50%_25%] md:aspect-[3/4]"
          />
          <figcaption className="label mt-3 flex justify-between">
            <span>{hero.contact.location.split(",")[0]}</span>
            <span>
              {/* Built at deploy time, corrected on load */}
              <time suppressHydrationWarning>{time}</time> IST
            </span>
          </figcaption>
        </figure>

        <div className="md:col-span-8 md:row-start-2">
          <p className="mt-8 max-w-[36rem] text-[1.0625rem] leading-relaxed text-muted-foreground md:text-lg">
            {hero.description}
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] md:mt-10">
            {hero.social.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  className="link"
                  {...(/^(mailto:|\/)/.test(social.url) ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {SOCIAL_LABELS[social.name] ?? social.name}
                  <span aria-hidden="true" className="ml-0.5 text-muted-foreground">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {hero.now && hero.now.length > 0 && (
        <dl className="mt-14 grid gap-x-8 gap-y-5 border-t border-rule pt-6 sm:grid-cols-3 md:mt-24">
          {hero.now.map((item) => (
            <div key={item.label}>
              <dt className="label">{item.label}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-snug">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-quiet">
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
