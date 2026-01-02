import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

// Debounce utility to reduce scroll event calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { config, loading } = usePortfolioConfig();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize scroll handler to prevent recreation on every render
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
    
    // Update active section based on scroll position (only on home page)
    if (!isHomePage) return;
    
    const sections = ['hero', 'skills', 'experience', 'projects', 'education', 'contact'];
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if section is in viewport (with some offset for header)
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  }, [isHomePage]);

  // Debounce scroll events to 200ms to reduce main thread work
  const debouncedScroll = useRef(debounce(handleScroll, 200));

  useEffect(() => {
    window.addEventListener('scroll', debouncedScroll.current, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll.current);
  }, []);

  // Handle hash navigation from URL
  useEffect(() => {
    const handleHashChange = () => {
      if (isHomePage) {
        const hash = window.location.hash.slice(1); // Remove # from hash
        if (hash) {
          setActiveSection(hash);
          // Scroll to the section
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    // Handle initial hash on page load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isHomePage]);

  const scrollToSection = (sectionId: string) => {
    // Update URL with hash
    window.history.pushState(null, '', `#${sectionId}`);
    setActiveSection(sectionId);
    
    // If not on home page, navigate to home first
    if (!isHomePage) {
      navigate('/');
      // Wait for navigation to complete, then scroll
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  // Render minimal skeleton while loading to prevent layout shift
  if (!config) {
    if (loading) {
      return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">...</div>
            </div>
          </div>
        </nav>
      );
    }
    return null;
  }

  const navItems = config.navigation;
  
  // Extract initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  const initials = getInitials(config.hero.name);

  const isNavItemActive = (itemId: string) => {
    return activeSection === itemId && isHomePage;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border/40`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            {initials}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors duration-300 font-medium ${
                  isNavItemActive(item.id)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
            {config.blogs?.enabled && (
              <Link
                to="/blogs"
                className={`transition-colors duration-300 font-medium ${
                  location.pathname === '/blogs'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Blogs
              </Link>
            )}
            <div className="flex items-center gap-3">
              <ThemeSwitch />
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => scrollToSection('contact')}
              >
                Hire Me
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button and Theme Switch */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeSwitch />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left transition-colors duration-300 font-medium py-2 ${
                    isNavItemActive(item.id)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {config.blogs?.enabled && (
                <Link
                  to="/blogs"
                  className={`text-left transition-colors duration-300 font-medium py-2 ${
                    location.pathname === '/blogs'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Blogs
                </Link>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 hover:border-primary hover:bg-primary/10 mt-4"
                onClick={() => scrollToSection('contact')}
              >
                Hire Me
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};