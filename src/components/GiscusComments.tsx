import { useEffect, useRef } from "react";
import { useTheme, type Theme } from "@/lib/theme";

interface GiscusCommentsProps {
  slug: string;
}

// Giscus ships matching 'light' and 'dark' themes, so the site theme passes straight through
const mapThemeToGiscus = (theme: Theme): Theme => theme;

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  // Declared before the loader effect, so it runs first and the loader sees the current theme
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Read through a ref: theme changes are handled by the effect below, not by reloading Giscus
    const giscusTheme = mapThemeToGiscus(themeRef.current);

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
    // One thread per URL. (It used to map by og:title, which was the same on every post, so all
    // posts shared a single thread; pathname also survives title edits.)
    scriptElement.dataset.mapping = "pathname";
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

    const giscusTheme = mapThemeToGiscus(theme);

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
    />
  );
}
