import { useState } from "react";
import { usePortfolioConfig, type PortfolioConfig } from "@/hooks/usePortfolioConfig";
import { Section } from "./Section";

const yearOf = (text: string) => text.match(/\d{4}/g)?.pop() ?? text;

type Certification = NonNullable<PortfolioConfig["education"]["certifications"]>[number];

function CertificationItem({ cert }: Readonly<{ cert: Certification }>) {
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-rule py-4">
      <div>
        <p className="text-[0.9375rem] font-medium">
          {cert.link ? (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="link">
              {cert.title} <span aria-hidden="true" className="text-muted-foreground">↗</span>
            </a>
          ) : (
            cert.title
          )}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{cert.provider}</p>
      </div>
      <p className="font-mono text-xs text-muted-foreground">{yearOf(cert.date)}</p>
    </li>
  );
}

export const About = () => {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const { config } = usePortfolioConfig();
  if (!config) return null;

  const { about, skills, education } = config;
  const certifications = [...(education.certifications ?? [])].sort((x, y) => Number(yearOf(y.date)) - Number(yearOf(x.date)));
  // Without any featured entry, show them all rather than hiding everything
  const featured = certifications.some((cert) => cert.featured) ? certifications.filter((cert) => cert.featured) : certifications;
  const more = certifications.filter((cert) => !featured.includes(cert));

  return (
    <Section id="about" index="04" title="About">
      {about?.bio && (
        <div className="max-w-[44rem] space-y-5 font-serif text-[1.3125rem] leading-[1.55] sm:text-[1.4375rem]">
          {about.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      <div className="mt-16">
        <h3 className="label">Toolkit</h3>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-6 sm:gap-x-8 lg:grid-cols-3">
          {skills.categories.map((category) => (
            <div key={category.title}>
              <h4 className="text-sm font-medium">{category.title}</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground sm:text-[0.9375rem]">
                {category.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-12 lg:grid-cols-2">
        <div>
          <h3 className="label">Education</h3>
          <ul className="mt-4 border-t border-rule">
            {education.degrees.map((degree) => (
              <li key={degree.degree} className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-rule py-4">
                <div>
                  <p className="text-[0.9375rem] font-medium">{degree.degree}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{degree.institution}</p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{yearOf(degree.period)}</p>
              </li>
            ))}
          </ul>
        </div>

        {certifications.length > 0 && (
          <div>
            <h3 className="label">Certifications</h3>
            <ul className="mt-4 border-t border-rule">
              {featured.map((cert) => (
                <CertificationItem key={cert.title} cert={cert} />
              ))}
            </ul>
            {more.length > 0 && (
              <>
                {showAllCerts && (
                  <ul id="more-certifications">
                    {more.map((cert) => (
                      <CertificationItem key={cert.title} cert={cert} />
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  aria-expanded={showAllCerts}
                  aria-controls="more-certifications"
                  onClick={() => setShowAllCerts((open) => !open)}
                  className="link mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  {showAllCerts ? "Show fewer" : `Show ${more.length} more ${more.length === 1 ? "certificate" : "certificates"}`}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};
