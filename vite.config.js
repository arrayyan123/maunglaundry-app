import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/build/',
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    envPrefix: ['VITE_'],
    optimizeDeps: {
        include: ['quill'],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        chunkSizeWarningLimit: 2000, 
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
});
