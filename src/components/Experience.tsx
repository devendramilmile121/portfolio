import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { formatPeriod } from "@/lib/format";
import { Section } from "./Section";

export const Experience = () => {
  const { config } = usePortfolioConfig();
  const experience = config?.experience;
  if (!experience || experience.jobs.length === 0) return null;

  return (
    <Section id="experience" index="02" title="Experience" aside={<p>{experience.description}</p>}>
      <ol className="border-t border-rule">
        {experience.jobs.map((job) => (
          <li key={`${job.company}-${job.period}`} className="grid gap-x-8 gap-y-3 border-b border-rule py-8 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="font-mono text-xs leading-relaxed text-muted-foreground">
              <p>{formatPeriod(job.period)}</p>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="text-[1.0625rem] font-medium leading-snug">
                {job.role}
                <span className="font-serif text-[1.125rem] font-normal italic text-muted-foreground"> at {job.company}</span>
              </h3>
              <ul className="mt-4 max-w-measure space-y-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {job.description.map((line) => (
                  <li key={line} className="grid grid-cols-[1rem_1fr]">
                    <span aria-hidden="true">–</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {job.technologies.length > 0 && (
                <p className="mt-4 font-mono text-xs text-muted-foreground">{job.technologies.join(" / ")}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};
