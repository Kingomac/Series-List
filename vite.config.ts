import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { isDebug } from "./app.config";

export default defineConfig({
  base: "./",
  root: "./",
  build: {
    outDir: "./dist",
    minify: "terser",
    target: "esnext",
    cssCodeSplit: true,
  },
  plugins: [
    /*VitePWA({
      mode: isDebug() ? 'development' : 'production',
      registerType: 'autoUpdate',
      srcDir: './src',
      outDir: './dist',
      strategies: 'injectManifest',
      filename: 'service-worker.ts',
      includeAssets: [
        './assets/icons/icon-96x96.png',
        './assets/icons/icon-192x192.png',
        './assets/icons/icon-512x512.png'
      ],
      includeManifestIcons: true,
      manifest: {
        name: 'Series List',
        short_name: 'Series List',
        theme_color: '#282c34',
        background_color: '#131313',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/assets/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: './assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })*/
  ],
});
