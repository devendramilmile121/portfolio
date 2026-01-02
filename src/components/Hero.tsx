import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp";
import heroBg480 from "@/assets/hero-bg-480.webp";
import heroBg768 from "@/assets/hero-bg-768.webp";
import heroBg1200 from "@/assets/hero-bg-1200.webp";
import heroBg1920 from "@/assets/hero-bg-1920.webp";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { useEffect } from 'react';

export const Hero = () => {
  const { config, loading } = usePortfolioConfig();

  useEffect(() => {
    // Preload hero background with high priority for LCP
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroBg;
      link.fetchPriority = 'high';
      link.imageSrcset = `${heroBg480} 480w, ${heroBg768} 768w, ${heroBg1200} 1200w, ${heroBg1920} 1920w`;
      link.imageSizes = '(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1200px';
      link.type = 'image/webp';
      document.head.appendChild(link);
      return () => { if (link.parentNode) link.parentNode.removeChild(link); };
    } catch (e) {
      // ignore
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render skeleton while loading to prevent layout shift
  if (!config) {
    if (loading) {
      return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <picture className="absolute inset-0 w-full h-full">
            <source
              srcSet={`${heroBg480} 480w, ${heroBg768} 768w, ${heroBg1200} 1200w, ${heroBg1920} 1920w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1200px"
              type="image/webp"
            />
            <img
              src={heroBg1200}
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </section>
      );
    }
    return null;
  }

  const heroData = config.hero;
  const backgroundImage = heroData.heroBackground || heroBg1200;

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroData.heroBackground ? (
        <img
          src={backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      ) : (
        <picture className="absolute inset-0 w-full h-full">
          <source
            srcSet={`${heroBg480} 480w, ${heroBg768} 768w, ${heroBg1200} 1200w, ${heroBg1920} 1920w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1200px"
            type="image/webp"
          />
          <img
            src={heroBg1200}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      )}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 p-3 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down">
            {heroData.name}
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-4 animate-fade-in-up animate-delay-100">
            {heroData.title}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
            {heroData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animate-delay-300">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-primary border-0 shadow-glow hover:shadow-glow/50 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => scrollToSection(heroData.ctaPrimaryTarget)}
            >
              <Mail className="mr-2 h-5 w-5" />
              {heroData.ctaPrimary}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => scrollToSection(heroData.ctaSecondaryTarget)}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              {heroData.ctaSecondary}
            </Button>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6 animate-fade-in-up animate-delay-400">
            {heroData.social.map((social, index) => {
              const IconComponent = getSocialIcon(social.name);
              return (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:rotate-6"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <IconComponent className="h-6 w-6" />
                </a>
              );
            })}
          </div>
          
          {/* Location */}
          <p className="text-sm text-muted-foreground mt-8 animate-fade-in-up animate-delay-500">
            📍 {heroData.contact.location} | 📞 {heroData.contact.phone}
          </p>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};