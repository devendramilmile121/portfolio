import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { Section } from "./Section";

export const Contact = () => {
  const { config } = usePortfolioConfig();
  if (!config) return null;

  const { contact } = config;
  const email = contact.info.find((item) => item.icon === "mail");
  const otherInfo = contact.info.filter((item) => item !== email && item.icon !== "mapPin");

  return (
    <Section id="contact" index="05" title="Contact">
      <p className="font-serif text-[2rem] leading-tight sm:text-[2.75rem]">{contact.heading}</p>
      <p className="mt-4 max-w-measure text-[1.0625rem] text-muted-foreground">{contact.description}</p>

      {email && (
        <p className="mt-10">
          <a
            href={email.link}
            className="font-serif text-[1.75rem] italic text-primary underline decoration-1 underline-offset-[0.2em] transition-colors hover:text-foreground sm:text-[2.5rem]"
          >
            {email.value}
          </a>
        </p>
      )}

      <dl className="mt-14 grid gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-2 lg:grid-cols-5">
        {otherInfo.map((item) => (
          <div key={item.label}>
            <dt className="label">{item.label}</dt>
            <dd className="mt-2 text-[0.9375rem]">
              {item.link ? (
                <a href={item.link} className="link-quiet">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
        {config.resume?.pdf && (
          <div>
            <dt className="label">Résumé</dt>
            <dd className="mt-2 text-[0.9375rem]">
              <a href={config.resume.pdf} download className="link-quiet">
                PDF
              </a>
              <span className="text-muted-foreground"> or </span>
              <a href="/resume" className="link-quiet">
                web
              </a>
            </dd>
          </div>
        )}
        {contact.social.map((social) => (
          <div key={social.label}>
            <dt className="label">{social.label}</dt>
            <dd className="mt-2 text-[0.9375rem]">
              <a href={social.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                {social.username}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};
