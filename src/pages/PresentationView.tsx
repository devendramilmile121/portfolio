import { useParams } from 'react-router-dom';
import { usePresentationLoader } from '@/hooks/usePresentationLoader';
import { useEffect, useRef } from 'react';
import NotFound from './NotFound';

/**
 * PresentationView - Renders fullscreen HTML presentations
 * Accessed via /presentations/:presentationId
 * Displays presentation in fullscreen without portfolio chrome
 */
export function PresentationView() {
  const { presentationId } = useParams<{ presentationId: string }>();
  const { html, loading, error } = usePresentationLoader(presentationId || '');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Hide portfolio chrome when viewing presentations
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Load HTML into iframe when HTML changes
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    try {
      // Write HTML directly to iframe - this ensures all scripts and styles execute properly
      const iframe = iframeRef.current;
      iframe.srcdoc = html;
    } catch (err) {
      console.error('Failed to load presentation into iframe:', err);
    }
  }, [html]);

  if (error) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-screen border-0"
      title={`Presentation: ${presentationId}`}
      sandbox="allow-scripts allow-same-origin allow-popups allow-pointer-lock"
      style={{
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        display: 'block'
      }}
    />
  );
}
