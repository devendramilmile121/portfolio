import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Resume = lazy(() => import("./pages/Resume"));
const PresentationView = lazy(() => import("./pages/PresentationView").then((m) => ({ default: m.PresentationView })));

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Load Google Analytics once the page is idle, so it never competes with first paint
function useAnalytics() {
  useEffect(() => {
    if (!gaId) return;
    const load = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // gtag.js expects the arguments object itself, not an array
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", gaId);
    };
    if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 5000 });
    else setTimeout(load, 2000);
  }, []);
}

/** The routes without a router, so the browser and the build-time pre-renderer can each supply one */
export const AppRoutes = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/blogs/:slug" element={<BlogDetail />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/presentations/:presentationId" element={<PresentationView />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => {
  useAnalytics();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
