import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api/n8n': {
        target: 'https://n8n.dezia.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, '/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771'),
        secure: true,
        timeout: 30000,
        proxyTimeout: 30000,
      },
      '/api/n8n/automation': {
        target: 'https://n8n.dezia.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n\/automation/, '/webhook/automation-control'),
        secure: true,
        timeout: 30000,
        proxyTimeout: 30000,
      },
      '/api/ai-creative': {
        target: 'https://n8n.dezia.xyz/webhook/ai-visual-studio',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-creative/, ''),
        secure: true,
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api/facebook-ads': {
        target: 'https://n8n.dezia.xyz/webhook/create-facebook-ad',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/facebook-ads/, ''),
        secure: true,
        timeout: 30000,
        proxyTimeout: 30000,
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

