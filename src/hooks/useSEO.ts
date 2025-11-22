import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterHandle?: string;
}

export const useMetaTags = ({
  title = "Devendra Milmile - Full Stack Developer | Angular & .NET Core Expert",
  description = "Full Stack Developer with 6+ years of expertise in Angular, .NET Core, and modern web technologies. Specializing in scalable applications, micro frontends, and cloud solutions.",
  keywords = "Full Stack Developer, Angular Developer, .NET Core Developer, Devendra Milmile, Web Developer",
  image = "https://devendramilmile.com/og-image.png",
  url = "https://devendramilmile.com",
  type = "website",
  twitterHandle = "@devendramilmile"
}: SEOProps = {}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, isProperty: boolean = false) => {
      let tag = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement;

      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Update standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', twitterHandle);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, keywords, image, url, type, twitterHandle]);
};

// Hook for adding JSON-LD structured data
interface JSONLDProps {
  schema: Record<string, any>;
}

export const useJsonLD = ({ schema }: JSONLDProps) => {
  useEffect(() => {
    // Create script tag with JSON-LD data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);
};

// Hook for breadcrumb schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export const useBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [breadcrumbs]);
};

// Hook for FAQ schema
interface FAQItem {
  question: string;
  answer: string;
}

export const useFAQSchema = (faqs: FAQItem[]) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [faqs]);
};

// Hook for open graph image optimization
export const useOGImage = (imagePath: string) => {
  useEffect(() => {
    const img = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (img) {
      img.content = imagePath;
    }
  }, [imagePath]);
};

export default useMetaTags;
