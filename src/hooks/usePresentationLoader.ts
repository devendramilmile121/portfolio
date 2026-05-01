import { useEffect, useState } from 'react';

interface PresentationLoaderState {
  html: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to load presentation HTML from the public/presentations directory
 * @param presentationId - The filename of the presentation (without .html extension)
 * @returns Object containing html content, loading state, and any error message
 */
export function usePresentationLoader(presentationId: string): PresentationLoaderState {
  const [state, setState] = useState<PresentationLoaderState>({
    html: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!presentationId) {
      setState({
        html: null,
        loading: false,
        error: 'No presentation ID provided',
      });
      return;
    }

    let isMounted = true;

    const loadPresentation = async () => {
      try {
        setState({
          html: null,
          loading: true,
          error: null,
        });

        const response = await fetch(`/presentations/${presentationId}.html`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Presentation not found'
              : `Failed to load presentation (${response.status})`
          );
        }

        const html = await response.text();

        if (isMounted) {
          setState({
            html,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            html: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Unknown error loading presentation',
          });
        }
      }
    };

    loadPresentation();

    return () => {
      isMounted = false;
    };
  }, [presentationId]);

  return state;
}
