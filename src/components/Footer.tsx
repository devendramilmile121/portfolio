import { Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/10 border-t border-border/40 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
              Devendra Milmile
            </h3>
            <p className="text-muted-foreground">
              Full Stack Developer • Angular & .NET Core Expert
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com/devendramilmile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              aria-label="GitHub Profile"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com/in/devendramilmile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="mailto:milmiledh@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              aria-label="Send Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} Devendra Milmile. All rights reserved.
            </p>
            <p>
              Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};