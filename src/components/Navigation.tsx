import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type NavItem = { label: string; id: string };

// An id starting with "/" is a route (e.g. /blogs); anything else is a section on the home page
const hrefFor = (item: NavItem) => (item.id.startsWith("/") ? item.id : `/#${item.id}`);

export const Navigation = () => {
  const { config } = usePortfolioConfig();
  const { toggleTheme } = useTheme();
  const { pathname } = useLocation();
  // The menu belongs to the page it was opened on, so navigating closes it without an effect
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const menuOpen = menuOpenedAt === pathname;
  const setMenuOpen = (open: boolean) => setMenuOpenedAt(open ? pathname : null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = config?.hero.name ?? "Devendra Milmile";
  const items = (config?.navigation ?? []).filter(
    (item) => item.id !== "/blogs" || config?.blogs?.enabled !== false
  );
  const isActive = (item: NavItem) => item.id.startsWith("/") && pathname.startsWith(item.id);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm transition-colors",
        scrolled || menuOpen ? "border-rule" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-5 sm:px-8">
        <Link to="/" className="text-[0.9375rem] font-medium tracking-tight" onClick={() => window.scrollTo({ top: 0 })}>
          {name}
        </Link>

        <div className="flex items-center gap-1 sm:gap-6">
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center gap-6 text-sm">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={hrefFor(item)}
                    aria-current={isActive(item) ? "page" : undefined}
                    className={cn(
                      "link py-1 transition-colors hover:text-foreground",
                      isActive(item) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark theme"
            title="Toggle dark theme"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* Icon follows the html.dark class, so pre-rendered markup matches whatever theme loads */}
            <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
            <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="label h-9 px-2 text-foreground sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Primary" className="border-t border-rule sm:hidden">
          <ul className="mx-auto max-w-page px-5 py-4">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={hrefFor(item)}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item) ? "page" : undefined}
                  className="block py-2 font-serif text-2xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
