import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api/n8n': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, '/webhook/56c93b71-b493-432c-a7c0-4dea2bd97771'),
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000,
      },
      '/api/n8n/automation': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n\/automation/, '/webhook/automation-control'),
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000,
      },
      '/api/ai-creative': {
        target: 'http://localhost:5678/webhook/ai-visual-studio',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-creative/, ''),
        secure: false,
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
      }
      '/api/meta-ads': {
        target: 'http://localhost:5678/webhook/create-facebook-ad',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/meta-ads/, ''),
        secure: false,
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
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

