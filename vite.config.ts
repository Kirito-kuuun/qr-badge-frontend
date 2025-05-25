import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa" // Import VitePWAOptions

// PWA Manifest Configuration
const manifestForPlugin: Partial<VitePWAOptions> = { // Explicitly type the manifest config
  registerType: "prompt", // Correct type is already used, but explicit typing helps
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable-icon.png"], // Include necessary icons
  manifest: {
    name: "MITUKI",
    short_name: "MITUKI",
    description: "QR Badge Scanner and Generator App",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      }
    ],
    theme_color: "#1a202c", // Example dark theme color
    background_color: "#1a202c",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugin)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

