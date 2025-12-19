import { renderHook } from '@testing-library/react';
import { useMetaTags, useJsonLD, useBreadcrumbSchema, useFAQSchema, useOGImage } from './useSEO';

describe('SEO Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.head.innerHTML = '';
    document.title = '';
  });

  describe('useMetaTags', () => {
    it('should set document title', () => {
      renderHook(() => useMetaTags({ title: 'Test Page' }));
      expect(document.title).toBe('Test Page');
    });

    it('should create meta description tag', () => {
      const description = 'Test description';
      renderHook(() => useMetaTags({ description }));

      const metaTag = document.querySelector('meta[name="description"]');
      expect(metaTag).toBeTruthy();
      expect(metaTag?.getAttribute('content')).toBe(description);
    });

    it('should create og:title meta tag', () => {
      const title = 'OG Title';
      renderHook(() => useMetaTags({ title }));

      const metaTag = document.querySelector('meta[property="og:title"]');
      expect(metaTag).toBeTruthy();
      expect(metaTag?.getAttribute('content')).toBe(title);
    });

    it('should create og:description meta tag', () => {
      const description = 'OG Description';
      renderHook(() => useMetaTags({ description }));

      const metaTag = document.querySelector('meta[property="og:description"]');
      expect(metaTag).toBeTruthy();
      expect(metaTag?.getAttribute('content')).toBe(description);
    });

    it('should create og:image meta tag', () => {
      const image = 'https://example.com/image.png';
      renderHook(() => useMetaTags({ image }));

      const metaTag = document.querySelector('meta[property="og:image"]');
      expect(metaTag).toBeTruthy();
      expect(metaTag?.getAttribute('content')).toBe(image);
    });

    it('should create twitter:card meta tag', () => {
      renderHook(() => useMetaTags());

      const metaTag = document.querySelector('meta[name="twitter:card"]');
      expect(metaTag).toBeTruthy();
      expect(metaTag?.getAttribute('content')).toBe('summary_large_image');
    });

    it('should create canonical link', () => {
      const url = 'https://example.com/page';
      renderHook(() => useMetaTags({ url }));

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      expect(canonicalLink).toBeTruthy();
      expect(canonicalLink?.getAttribute('href')).toBe(url);
    });

    it('should use default values when none provided', () => {
      renderHook(() => useMetaTags());

      expect(document.title).toContain('Devendra Milmile');
      const metaTag = document.querySelector('meta[name="description"]');
      expect(metaTag?.getAttribute('content')).toContain('Full Stack Developer');
    });

    it('should update meta tags on prop change', () => {
      const { rerender } = renderHook(
        (props) => useMetaTags(props),
        { initialProps: { title: 'Initial Title' } }
      );

      expect(document.title).toBe('Initial Title');

      rerender({ title: 'Updated Title' });

      expect(document.title).toBe('Updated Title');
    });
  });

  describe('useJsonLD', () => {
    it('should create JSON-LD script tag', () => {
      const schema = { '@type': 'Person', name: 'John Doe' };
      renderHook(() => useJsonLD({ schema }));

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
      expect(JSON.parse(script?.textContent || '{}')).toEqual(schema);
    });

    it('should clean up JSON-LD script on unmount', () => {
      const schema = { '@type': 'Person', name: 'John Doe' };
      const { unmount } = renderHook(() => useJsonLD({ schema }));

      let script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      unmount();

      script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeFalsy();
    });
  });

  describe('useBreadcrumbSchema', () => {
    it('should create breadcrumb schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'About', url: 'https://example.com/about' },
      ];

      renderHook(() => useBreadcrumbSchema(breadcrumbs));

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      const schema = JSON.parse(script?.textContent || '{}');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
    });

    it('should clean up breadcrumb schema on unmount', () => {
      const breadcrumbs = [{ name: 'Home', url: 'https://example.com' }];
      const { unmount } = renderHook(() => useBreadcrumbSchema(breadcrumbs));

      let script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      unmount();

      script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeFalsy();
    });
  });

  describe('useFAQSchema', () => {
    it('should create FAQ schema', () => {
      const faqs = [
        { question: 'What is React?', answer: 'React is a JavaScript library' },
        { question: 'What is TypeScript?', answer: 'TypeScript adds types to JavaScript' },
      ];

      renderHook(() => useFAQSchema(faqs));

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      const schema = JSON.parse(script?.textContent || '{}');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0].name).toBe('What is React?');
    });

    it('should clean up FAQ schema on unmount', () => {
      const faqs = [
        { question: 'What is React?', answer: 'React is a JavaScript library' },
      ];
      const { unmount } = renderHook(() => useFAQSchema(faqs));

      let script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      unmount();

      script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeFalsy();
    });
  });

  describe('useOGImage', () => {
    it('should update og:image meta tag', () => {
      const initialImage = 'https://example.com/image1.png';
      document.head.innerHTML = `<meta property="og:image" content="${initialImage}" />`;

      const newImage = 'https://example.com/image2.png';
      renderHook(() => useOGImage(newImage));

      const metaTag = document.querySelector('meta[property="og:image"]');
      expect(metaTag?.getAttribute('content')).toBe(newImage);
    });

    it('should update og:image on prop change', () => {
      const initialImage = 'https://example.com/image1.png';
      document.head.innerHTML = `<meta property="og:image" content="${initialImage}" />`;

      const { rerender } = renderHook(
        (props) => useOGImage(props),
        { initialProps: initialImage }
      );

      expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
        initialImage
      );

      const newImage = 'https://example.com/image2.png';
      rerender(newImage);

      expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
        newImage
      );
    });
  });
});
