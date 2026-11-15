import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Footer = () => {
  const { config } = usePortfolioConfig();
  const name = config?.footer.name ?? "Devendra Milmile";
  const colophon = config?.footer.builtWith;

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-page gap-4 px-5 py-10 text-sm text-muted-foreground sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-8">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        {colophon && <p className="sm:text-center">{colophon}</p>}
        <p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }} className="link hover:text-foreground">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </p>
      </div>
    </footer>
  );
};
