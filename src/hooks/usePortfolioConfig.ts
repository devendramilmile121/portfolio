import { useEffect, useState } from 'react';

interface PortfolioConfig {
  hero: {
    name: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
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
  skills: Array<{
    title: string;
    skills: string[];
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    location: string;
    description: string[];
    technologies: string[];
  }>;
  projects: Array<{
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
    }>;
    certifications: Array<{
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

export const usePortfolioConfig = () => {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config/portfolio.json');
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading config');
        console.error('Failed to load portfolio config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};
