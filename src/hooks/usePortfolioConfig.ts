import { useEffect, useState } from 'react';

interface PortfolioConfig {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  blogs?: {
    enabled: boolean;
  };
  hero: {
    name: string;
    title: string;
    description: string;
    heroBackground?: string;
    ctaPrimary: string;
    ctaPrimaryTarget: string;
    ctaSecondary: string;
    ctaSecondaryTarget: string;
    contact: {
      location: string;
      phone: string;
    };
    social: Array<{
      name: string;
      url: string;
    }>;
  };
  navigation: Array<{
    label: string;
    id: string;
  }>;
  skills: {
    description: string;
    categories: Array<{
      title: string;
      skills: string[];
    }>;
  };
  experience: {
    description: string;
    jobs: Array<{
      company: string;
      role: string;
      period: string;
      location: string;
      description: string[];
      technologies: string[];
    }>;
  };
  projects?: Array<{
    title: string;
    period: string;
    description: string;
    highlights: string[];
    technologies: string[];
    type: string;
    links?: {
      npm?: string;
      github?: string;
    };
  }>;
  education: {
    degrees: Array<{
      degree: string;
      institution: string;
      period: string;
      type: string;
      specialization?: string;
    }>;
    certifications?: Array<{
      title: string;
      provider: string;
      date: string;
      link?: string;
    }>;
  };
  contact: {
    heading: string;
    description: string;
    info: Array<{
      label: string;
      value: string;
      link?: string;
      icon: string;
    }>;
    social: Array<{
      label: string;
      username: string;
      url: string;
      icon: string;
    }>;
  };
  footer: {
    name: string;
    title: string;
    copyright: string;
    builtWith: string;
    social: Array<{
      name: string;
      url: string;
    }>;
  };
}

// Cache for config to avoid re-fetching
let configCache: PortfolioConfig | null = null;
let configPromise: Promise<PortfolioConfig> | null = null;

export const usePortfolioConfig = () => {
  const [config, setConfig] = useState<PortfolioConfig | null>(configCache);
  const [loading, setLoading] = useState(configCache ? false : true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If config is already cached, use it immediately
    if (configCache) {
      setConfig(configCache);
      setLoading(false);
      return;
    }

    // If already fetching, reuse the promise
    if (configPromise) {
      configPromise
        .then(data => {
          setConfig(data);
          setLoading(false);
        })
        .catch(err => {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error loading config';
          setError(errorMsg);
          console.error('Failed to load portfolio config:', err);
          setLoading(false);
        });
      return;
    }

    // Start the fetch
    const loadConfig = async () => {
      try {
        const response = await fetch('/config/portfolio.json', {
          priority: 'high' as RequestPriority,
        });
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }
        const data = await response.json();
        configCache = data;
        setConfig(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error loading config';
        setError(errorMsg);
        console.error('Failed to load portfolio config:', err);
      } finally {
        setLoading(false);
        configPromise = null;
      }
    };

    configPromise = fetch('/config/portfolio.json', {
      priority: 'high' as RequestPriority,
    }).then(r => {
      if (!r.ok) throw new Error(`Failed to load config: ${r.statusText}`);
      return r.json();
    });

    loadConfig();
  }, []);

  return { config, loading, error };
};
