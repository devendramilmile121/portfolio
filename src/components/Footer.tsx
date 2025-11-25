import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Footer = () => {
  const { config, loading } = usePortfolioConfig();
  const currentYear = new Date().getFullYear();

  if (loading || !config) return null;

  const footerData = config.footer;

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'email':
      case 'mail':
        return Mail;
      default:
        return Mail;
    }
  };

  return (
    <footer className="bg-secondary/10 border-t border-border/40 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="text-center md:text-left animate-fade-in-left">
            <h3 className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2 hover:text-primary transition-colors duration-300">
              {footerData.name}
            </h3>
            <p className="text-muted-foreground hover:text-foreground transition-colors duration-300">
              {footerData.title}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 text-sm animate-fade-in-up animate-delay-100">
            <Link 
              to="/blogs"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Blogs
            </Link>
            <span className="text-border/40">•</span>
            <a 
              href="#contact"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6 animate-fade-in-right">
            {footerData.social.map((social, index) => {
              const IconComponent = getSocialIcon(social.name);
              return (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:rotate-6 animate-fade-in"
                  aria-label={`${social.name} Profile`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <IconComponent className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            <p>
              © {currentYear} {footerData.name}. {footerData.copyright}
            </p>
            <p>
              {footerData.builtWith}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};