import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Writing } from "@/components/Writing";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

const Index = () => {
  const { config } = usePortfolioConfig();
  const { hash, key } = useLocation();

  useEffect(() => {
    if (config?.seo?.title) document.title = config.seo.title;
  }, [config]);

  // Sections render after the config loads, so scroll to a #hash once they exist,
  // and again on every navigation to a hash (key changes even when the hash doesn't)
  useEffect(() => {
    if (!config) return;
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [config, hash, key]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        {config && (
          <>
            <Projects />
            <Experience />
            <Writing />
            <About />
            <Contact />
          </>
        )}
      </main>
      {config && <Footer />}
    </div>
  );
};

export default Index;
