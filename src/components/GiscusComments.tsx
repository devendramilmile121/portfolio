import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

interface GiscusCommentsProps {
  slug: string;
}

type Theme = 'github' | 'dark' | 'yellow' | 'green' | 'white';

// Map portfolio themes to Giscus themes
const mapThemeToGiscus = (theme: Theme): 'light' | 'dark' => {
  switch (theme) {
    case 'dark':
    case 'github':
    case 'yellow':
    case 'green':
      return 'dark';
    case 'white':
      return 'light';
    default:
      return 'light';
  }
};

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Map the current theme to Giscus theme
    const giscusTheme = mapThemeToGiscus(theme as Theme);

    // Function to send theme change message to Giscus iframe
    const updateGiscusTheme = () => {
      const iframe = container.querySelector("iframe.giscus-frame") as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          "https://giscus.app"
        );
      }
    };

    // Check if Giscus is already loaded
    const existingGiscus = container.querySelector(".giscus");
    
    if (existingGiscus) {
      // Just update the theme if Giscus is already loaded
      setTimeout(() => {
        updateGiscusTheme();
      }, 100);
      return;
    }

    // Clear any existing content
    container.innerHTML = "";

    // If Giscus not loaded yet, create and load it
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://giscus.app/client.js";
    scriptElement.dataset.repo = "devendramilmile121/portfolio";
    scriptElement.dataset.repoId = "R_kgDOPTs4XQ";
    scriptElement.dataset.category = "Blog Comments";
    scriptElement.dataset.categoryId = "DIC_kwDOPTs4Xc4Cg7-i";
    scriptElement.dataset.mapping = "og:title";
    scriptElement.dataset.strict = "0";
    scriptElement.dataset.reactionsEnabled = "1";
    scriptElement.dataset.emitMetadata = "0";
    scriptElement.dataset.inputPosition = "bottom";
    scriptElement.dataset.theme = giscusTheme;
    scriptElement.dataset.lang = "en";
    scriptElement.async = true;
    scriptElement.crossOrigin = "anonymous";

    // After script loads, ensure theme is correct
    scriptElement.onload = () => {
      setTimeout(() => {
        updateGiscusTheme();
      }, 500);
    };

    container.appendChild(scriptElement);

    return () => {
      // Cleanup: remove on unmount
      const giscusDiv = container.querySelector(".giscus");
      if (giscusDiv) {
        giscusDiv.remove();
      }
    };
  }, [slug]);

  // Separate effect just for theme changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const giscusTheme = mapThemeToGiscus(theme as Theme);

    // Only update theme if Giscus is already loaded
    const giscusDiv = container.querySelector(".giscus");
    if (giscusDiv) {
      const iframe = container.querySelector("iframe.giscus-frame") as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // Send theme update via postMessage
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          "https://giscus.app"
        );
      }
    }
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="w-full giscus-wrapper"
      data-theme={theme}
    />
  );
}
