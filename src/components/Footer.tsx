import { Github, Linkedin, Mail } from "lucide-react";
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
          <div className="text-center md:text-left">
            <h3 className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
              {footerData.name}
            </h3>
            <p className="text-muted-foreground">
              {footerData.title}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {footerData.social.map((social) => {
              const IconComponent = getSocialIcon(social.name);
              return (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label={`${social.name} Profile`}
                >
                  <IconComponent className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
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