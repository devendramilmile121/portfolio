import { useEffect, useState } from 'react';

export interface PortfolioConfig {
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
    role?: string;
    title: string;
    description: string;
    now?: Array<{
      label: string;
      text: string;
      link?: string;
    }>;
    contact: {
      location: string;
      phone?: string;
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
  about?: {
    bio: string[];
  };
  resume?: {
    headline: string;
    summary: string;
    /** Path of the generated PDF (see scripts/build-resume.mjs) */
    pdf: string;
  };
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
    client?: string;
    summary?: string;
    role?: string;
    period: string;
    description: string;
    highlights: string[];
    technologies: string[];
    type: string;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    links?: {
      demo?: string;
      npm?: string;
      github?: string;
      website?: string;
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
      /** Shown up front; the rest sit behind "Show more" */
      featured?: boolean;
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

// Pre-rendered pages embed the config in a script tag, so the first render already has it.
// Without that (dev server, the 404 shell), it is fetched once and shared by every component.
const embeddedConfig =
  typeof window === 'undefined'
    ? null
    : ((window as unknown as { __PORTFOLIO_CONFIG__?: PortfolioConfig }).__PORTFOLIO_CONFIG__ ?? null);

let configCache: PortfolioConfig | null = embeddedConfig;
let configPromise: Promise<PortfolioConfig> | null = null;

/** Seed the config synchronously, used by the build-time pre-renderer. */
export function primeConfig(config: PortfolioConfig) {
  configCache = config;
}

const fetchConfig = (): Promise<PortfolioConfig> => {
  configPromise ??= fetch('/config/portfolio.json', { priority: 'high' as RequestPriority })
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load config: ${response.statusText}`);
      return response.json() as Promise<PortfolioConfig>;
    })
    .then((data) => {
      configCache = data;
      return data;
    })
    .catch((err) => {
      configPromise = null; // allow a retry on the next mount
      throw err;
    });
  return configPromise;
};

export const usePortfolioConfig = () => {
  const [config, setConfig] = useState<PortfolioConfig | null>(configCache);
  const [loading, setLoading] = useState(!configCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (configCache) return;
    let active = true;
    fetchConfig()
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch((err) => {
        console.error('Failed to load portfolio config:', err);
        if (active) setError(err instanceof Error ? err.message : 'Unknown error loading config');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { config, loading, error };
};
