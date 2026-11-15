import type { ReactNode } from "react";

type SectionProps = Readonly<{
  id: string;
  index: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}>;

/**
 * Page section on the editorial grid: a hairline rule, a numbered label and title in the left
 * three columns, content in the right nine. Stacks on small screens.
 */
export function Section({ id, index, title, aside, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-t border-rule">
      <div className="mx-auto grid max-w-page gap-x-8 gap-y-6 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-24">
        <header className="md:col-span-3">
          <p className="label">{index}</p>
          <h2 id={headingId} className="mt-2 font-serif text-[1.75rem] leading-tight">
            {title}
          </h2>
          {aside && <div className="mt-4 text-sm text-muted-foreground">{aside}</div>}
        </header>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}
