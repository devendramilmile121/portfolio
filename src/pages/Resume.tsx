import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { formatPeriod } from "@/lib/format";

// Visible text for a URL: drop the protocol, "www." and "mailto:"
const displayUrl = (url: string) => url.replace(/^(https?:\/\/(www\.)?|mailto:)/, "").replace(/\/$/, "");
const yearOf = (text: string) => text.match(/\d{4}/g)?.pop() ?? text;

function ResumeSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="grid gap-x-8 gap-y-3 border-t border-rule pt-5 sm:grid-cols-[8.5rem_1fr] print:grid-cols-[6.75rem_1fr] print:gap-y-1 print:pt-2.5">
      <h2 className="label pt-0.5 text-foreground">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

/**
 * Résumé built from the same portfolio.json as the site, so the two never disagree.
 * Laid out as an A4 document; `npm run resume` prints it to the PDF linked at the top.
 */
export default function Resume() {
  useScrollToTop();
  const { config } = usePortfolioConfig();

  useEffect(() => {
    if (config) document.title = `${config.hero.name} — Résumé`;
  }, [config]);

  if (!config) return null;

  const { hero, resume, experience, projects = [], skills, education, contact } = config;
  const email = contact.info.find((item) => item.icon === "mail");
  const phone = contact.info.find((item) => item.icon === "phone");
  // Side projects: still active and publicly available (client platforms have no public link).
  // Retired ones stay on the website only.
  const ownWork = projects.filter(
    (project) => /present/i.test(project.period) && Boolean(project.links?.website || project.links?.npm)
  );
  const certifications = (education.certifications ?? []).filter((cert) => cert.featured);
  const profiles = contact.social.map((social) => social.url);

  return (
    <div className="min-h-screen bg-muted/40 print:bg-background">
      <nav aria-label="Résumé" className="mx-auto flex max-w-[52rem] items-center justify-between px-5 py-6 text-sm print:hidden">
        <Link to="/" className="link">
          <span aria-hidden="true">←</span> {hero.name}
        </Link>
        {resume?.pdf && (
          <a href={resume.pdf} download className="link text-primary">
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        )}
      </nav>

      <main className="mx-auto mb-16 max-w-[52rem] bg-background px-6 py-10 shadow-sm sm:px-12 sm:py-14 print:m-0 print:max-w-none print:p-0 print:shadow-none">
        <header>
          <h1 className="font-serif text-[2.5rem] leading-none tracking-[-0.02em] print:text-[24pt]">{hero.name}</h1>
          <p className="mt-2 text-[1.0625rem] text-muted-foreground print:mt-1 print:text-[10.5pt]">{resume?.headline ?? hero.role}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground print:mt-2.5 print:text-[7.5pt]">
            <span>{hero.contact.location}</span>
            {email && <a href={email.link}>{email.value}</a>}
            {phone && <a href={phone.link}>{phone.value}</a>}
            <a href="https://devendramilmile.com">devendramilmile.com</a>
            {profiles.map((url) => (
              <a key={url} href={url}>
                {displayUrl(url)}
              </a>
            ))}
          </p>
        </header>

        <div className="mt-8 space-y-6 text-[0.9375rem] leading-relaxed print:mt-4 print:space-y-3 print:text-[8.75pt] print:leading-[1.38]">
          {resume?.summary && (
            <ResumeSection title="Profile">
              <p>{resume.summary}</p>
            </ResumeSection>
          )}

          <ResumeSection title="Experience">
            <ol className="space-y-5 print:space-y-2">
              {experience.jobs.map((job) => (
                <li key={`${job.company}-${job.period}`} className="break-inside-avoid">
                  <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between print:flex-row print:items-baseline print:justify-between">
                    <h3 className="min-w-0 font-medium">
                      {job.role}, {job.company}
                    </h3>
                    <p className="shrink-0 whitespace-nowrap font-mono text-xs text-muted-foreground print:text-[7.5pt]">
                      {formatPeriod(job.period)} · {job.location}
                    </p>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground print:mt-0.5 print:space-y-0">
                    {job.description.map((line) => (
                      <li key={line} className="grid grid-cols-[0.9rem_1fr]">
                        <span aria-hidden="true">–</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </ResumeSection>

          {ownWork.length > 0 && (
            <ResumeSection title="Side projects">
              <ul className="space-y-2 print:space-y-0.5">
                {ownWork.map((project) => {
                  const link = project.links?.website ?? project.links?.npm;
                  return (
                    <li key={project.title} className="break-inside-avoid">
                      <span className="font-medium">{project.title}</span>
                      {project.summary && <span className="text-muted-foreground"> — {project.summary}. </span>}
                      {link && (
                        <a href={link} className="font-mono text-xs text-muted-foreground print:text-[7.5pt]">
                          {link.includes("npmjs.com") ? "npm" : displayUrl(link)}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </ResumeSection>
          )}

          <ResumeSection title="Skills">
            <dl className="space-y-1">
              {skills.categories.map((category) => (
                <div key={category.title} className="grid grid-cols-[8rem_1fr] gap-x-3 print:grid-cols-[6.5rem_1fr]">
                  <dt className="font-medium">{category.title}</dt>
                  <dd className="text-muted-foreground">{category.skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="Education">
            <ul className="space-y-1">
              {education.degrees.map((degree) => (
                <li key={degree.degree} className="grid grid-cols-[1fr_auto] gap-x-4">
                  <span>
                    <span className="font-medium">{degree.degree}</span>
                    <span className="text-muted-foreground">, {degree.institution}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground print:text-[7.5pt]">{yearOf(degree.period)}</span>
                </li>
              ))}
            </ul>
          </ResumeSection>

          {certifications.length > 0 && (
            <ResumeSection title="Certification">
              <ul className="space-y-1">
                {certifications.map((cert) => (
                  <li key={cert.title} className="grid grid-cols-[1fr_auto] gap-x-4">
                    <span className="font-medium">{cert.title}</span>
                    <span className="font-mono text-xs text-muted-foreground print:text-[7.5pt]">{yearOf(cert.date)}</span>
                  </li>
                ))}
              </ul>
            </ResumeSection>
          )}
        </div>
      </main>
    </div>
  );
}
