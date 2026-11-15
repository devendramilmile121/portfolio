import { useState } from "react";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { formatYears } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

const LINK_LABELS: Record<string, string> = { demo: "Live demo", website: "Website", github: "Source", npm: "npm" };

export const Projects = () => {
  const { config } = usePortfolioConfig();
  // The first project starts open so the index shows what's inside a row
  const [open, setOpen] = useState<Set<string>>(() => new Set(config?.projects?.[0] ? [config.projects[0].title] : []));

  const projects = config?.projects ?? [];
  if (projects.length === 0) return null;

  const toggle = (title: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <Section id="work" index="01" title="Selected work" aside={<p>My own product and libraries first, then client platforms.</p>}>
      <ol className="border-t border-rule">
        {projects.map((project, i) => {
          const isOpen = open.has(project.title);
          const panelId = `project-${i}`;
          const links = Object.entries(project.links ?? {}).filter(([, url]) => Boolean(url));
          return (
            <li key={project.title} className="border-b border-rule">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(project.title)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 py-5 text-left sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_5rem_1rem]"
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block font-serif text-[1.5rem] leading-tight transition-colors group-hover:text-primary sm:text-[1.75rem]">
                      {project.title}
                    </span>
                    {project.summary && (
                      <span className="mt-1 block text-sm text-muted-foreground sm:hidden">{project.summary}</span>
                    )}
                  </span>
                  <span className="hidden text-[0.9375rem] text-muted-foreground sm:block">{project.summary}</span>
                  <span className="font-mono text-xs text-muted-foreground sm:text-right">{formatYears(project.period)}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden font-mono text-muted-foreground transition-transform duration-300 sm:block",
                      isOpen && "rotate-45 text-foreground"
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
                inert={!isOpen || undefined}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-8 pb-10 sm:ml-[3.5rem] lg:grid-cols-[minmax(0,1fr)_16rem]">
                    {project.image && (
                      <img
                        src={project.image.src}
                        alt={project.image.alt}
                        width={project.image.width}
                        height={project.image.height}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full rounded-sm border border-rule lg:col-span-2"
                      />
                    )}
                    <div>
                      <p className="max-w-measure text-[1.0625rem] leading-relaxed">{project.description}</p>
                      {project.highlights.length > 0 && (
                        <ul className="mt-5 max-w-measure space-y-2 text-[0.9375rem] text-muted-foreground">
                          {project.highlights.map((highlight) => (
                            <li key={highlight} className="grid grid-cols-[1rem_1fr]">
                              <span aria-hidden="true">–</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <dl className="grid content-start gap-4 text-sm">
                      {project.role && (
                        <div>
                          <dt className="label">Role</dt>
                          <dd className="mt-1">{project.role}</dd>
                        </div>
                      )}
                      {project.client && project.client !== project.title && (
                        <div>
                          <dt className="label">Client</dt>
                          <dd className="mt-1">{project.client}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="label">Stack</dt>
                        <dd className="mt-1 text-muted-foreground">{project.technologies.join(", ")}</dd>
                      </div>
                      {links.length > 0 && (
                        <div>
                          <dt className="label">Links</dt>
                          <dd className="mt-1 flex flex-wrap gap-x-4">
                            {links.map(([kind, url]) => (
                              <a key={kind} href={url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                                {LINK_LABELS[kind] ?? kind} <span aria-hidden="true">↗</span>
                              </a>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};
