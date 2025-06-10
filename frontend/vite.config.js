import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import csp from 'vite-plugin-csp-guard'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    csp({
      algorithm: "sha256",
      dev: {
        run: false,  // Run the plugin in dev mode
      },   
      policy: {
        // "default-src": ["'self'"],
        "script-src": ["'self'"],
        "script-src-elem": [
          "'self'",
          "https://static.cloudflareinsights.com"
        ],
        // "font-src": ["'self'"],
        // "script-src-elem": ["'self'"],
        "style-src": ["'self'", "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU="],
        "style-src-elem": ["'self'", "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU="],
        "img-src": [ // Perhatikan penulisan yang benar
          "'self'", 
          'data:', 
          'https://cdn.discordapp.com', 
          'https://cdn.jsdelivr.net', 
          'https://emoji.gg'
        ],
      },
      // outlierSupport: ["less"],
      // outlierSupport: ["tailwind"],
      build:{
        sri: true
      }
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
        output:{
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const lib = id.toString().split('node_modules/')[1].split('/')[0]
              const heavyLibs = ['react-icons', '@dnd-kit', 'emoji-picker-react']
              if (heavyLibs.includes(lib)) return `vendor-${lib}`
            }
          }
        }
    },
    outDir: '../backend/public',
    emptyOutDir: true,
    minify: 'esbuild', // fast + modern
    sourcemap: false,
  },
  base: '/',
})
