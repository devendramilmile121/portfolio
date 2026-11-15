import { defineConfig, type PluginOption, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Note: visualizer is loaded dynamically below only when ANALYZE=true to avoid requiring
// the optional devDependency during normal builds on machines where it's not installed.

// https://vitejs.dev/config/
export default defineConfig(async (): Promise<UserConfig> => {
  const plugins: PluginOption[] = [react()];
  if (process.env.ANALYZE === 'true') {
    // Dynamically import the visualizer plugin only when requested.
  try {
  // Imported by a variable name so TypeScript doesn't require this optional devDependency to exist.
  const optionalPlugin = 'vite-plugin-visualizer';
  const { visualizer } = await import(/* @vite-ignore */ optionalPlugin);
      plugins.push(visualizer({ filename: './dist/bundle-visualizer.html', open: false }));
    } catch (e) {
      // If the package isn't installed, warn and continue without failing the build.
      // This keeps builds stable on CI or developer machines where the plugin isn't present.
      console.warn('vite-plugin-visualizer not installed; skipping bundle analysis.');
    }
  }

  return ({
  base: '/',
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor chunk by package name to avoid a single huge vendor bundle.
        // This groups modules from the same npm package into their own chunk
        // which helps cacheability and can reduce initial JS download.
        manualChunks(id: string | undefined) {
          if (!id) return undefined;
          if (!id.includes('node_modules')) return undefined;

          // Match scoped and non-scoped package names. Handle both POSIX and Windows separators.
          const after = id.split(/node_modules[\\/]/)[1];
          if (!after) return undefined;
          const parts = after.split(/[\\/]/);
          if (!parts || parts.length === 0) return undefined;

          let pkg = parts[0];
          // For scoped packages, include the scope and package name
          if (pkg && pkg.startsWith('@') && parts.length > 1) {
            pkg = `${pkg}/${parts[1]}`;
          }
          // normalize chunk name: replace non-alphanum with dash
          return `vendor-${String(pkg).replace(/[^a-zA-Z0-9]/g, '-')}`;
        },
      },
    },
    minify: "esbuild"
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: plugins.filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  });
});
