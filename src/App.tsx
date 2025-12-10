import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import React, { Suspense, lazy, useEffect, useState } from "react";
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";
import SeasonalEffects from "./components/SeasonalEffects";
import type { SeasonalEffect } from "./hooks/useSeasonalEffects";

const queryClient = new QueryClient();

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;


const App = () => {
  const [seasonalEffects, setSeasonalEffects] = useState<SeasonalEffect[]>([]);
  const [seasonalConfig, setSeasonalConfig] = useState({ enabled: true });

  useEffect(() => {
    // Load seasonal effects from portfolio config
    const loadSeasonalConfig = async () => {
      try {
        const response = await fetch('/config/portfolio.json');
        const config = await response.json();
        if (config.seasonalEffects) {
          setSeasonalConfig({
            enabled: config.seasonalEffects.enabled ?? true,
          });
          setSeasonalEffects(config.seasonalEffects.effects || []);
        }
      } catch (error) {
        console.error('Failed to load seasonal effects config:', error);
      }
    };

    loadSeasonalConfig();
  }, []);

  const handleToggleSeasonalEffect = () => {
    setSeasonalConfig(prev => ({ enabled: !prev.enabled }));
  };

  useEffect(() => {
    if (!gaId) return;
    
    // Defer GA loading to after page interactive using requestIdleCallback
    // Fallback to setTimeout if requestIdleCallback not supported
    const loadGA = () => {
      try {
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
      } catch (e) {
        console.error('Failed to load GA:', e);
      }
    };

    // Use requestIdleCallback if available, otherwise defer with setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadGA, { timeout: 5000 });
    } else {
      setTimeout(loadGA, 2000);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blogs/:slug" element={<BlogDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
        <SeasonalEffects effects={seasonalEffects} enabled={seasonalConfig.enabled} onToggle={handleToggleSeasonalEffect} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
