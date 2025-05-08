import { defineConfig } from "vite";
import restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [restart({ restart: ["public/**"] })],
  resolve: {
    alias: {},
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    port: 5200,
    hmr: {
      clientPort: 5200,
    },
  },
  base: "/",
});
