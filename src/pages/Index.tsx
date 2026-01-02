import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";
import { useEffect } from "react";

const Index = () => {
  useScrollToTop();
  const { config } = usePortfolioConfig();
  
  // Set document title dynamically from config
  useEffect(() => {
    if (config?.seo?.title) {
      document.title = config.seo.title;
    }
  }, [config]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <section id="skills">
          <Skills />
        </section>
        
        <section id="experience">
          <Experience />
        </section>
        
        {config?.projects && config.projects.length > 0 && (
          <section id="projects">
            <Projects />
          </section>
        )}
        
        <section id="education">
          <Education />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
