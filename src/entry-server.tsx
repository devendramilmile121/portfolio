import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { ThemeProvider } from '@/hooks/use-theme'
import { primeConfig, type PortfolioConfig } from '@/hooks/usePortfolioConfig'
import { getAllBlogs } from '@/data/blogs'

export { getAllBlogs }

/**
 * Render one route to static HTML at build time (see scripts/prerender.mjs).
 * prerender() waits for lazy routes, so blog pages come out complete.
 */
export async function render(url: string, config: PortfolioConfig): Promise<string> {
  primeConfig(config)
  const { prelude } = await prerender(
    <StrictMode>
      <ThemeProvider>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </ThemeProvider>
    </StrictMode>
  )
  return new Response(prelude).text()
}
