import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { PortfolioConfig } from "@/hooks/usePortfolioConfig";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { formatYears } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

const LINK_LABELS: Record<string, string> = { demo: "Live demo", website: "Website", github: "Source", npm: "npm" };

type Project = NonNullable<PortfolioConfig["projects"]>[number];

const STATUS_LABELS: Record<NonNullable<Project["status"]>, string> = { live: "Live", retired: "Retired" };

function StatusLabel({ status }: Readonly<{ status: Project["status"] }>) {
  if (!status) return null;
  return (
    <span
      className={cn(
        "ml-3 inline-flex items-center gap-1.5 whitespace-nowrap align-middle font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em]",
        status === "live" ? "text-primary" : "text-muted-foreground"
      )}
    >
      {status === "live" && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />}
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Silent loop that plays only while its panel is open, and never on its own for reduced-motion visitors */
function ProjectVideo({ video, active }: Readonly<{ video: NonNullable<Project["video"]>; active: boolean }>) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active && !reduceMotion) el.play().catch(() => undefined); // autoplay can be refused; the poster stays
    else el.pause();
  }, [active, reduceMotion]);

  return (
    <video
      ref={ref}
      poster={video.poster}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      preload={active ? "auto" : "none"}
      controls={reduceMotion}
      aria-label={video.label}
      className="h-auto w-full rounded-sm border border-rule bg-card lg:col-span-2"
    >
      <source src={video.src} type="video/mp4" />
    </video>
  );
}

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
    <Section id="work" index="01" title="Selected work" aside={<p>What I&apos;m working on now, then side projects and earlier client work.</p>}>
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
                    <span className="block font-serif text-[1.5rem] leading-tight sm:text-[1.75rem]">
                      <span className="transition-colors group-hover:text-primary">{project.title}</span>
                      <StatusLabel status={project.status} />
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
                    {project.video ? (
                      <ProjectVideo video={project.video} active={isOpen} />
                    ) : project.image && (
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
