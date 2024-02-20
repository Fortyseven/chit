import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            '@': path.resolve('/src'),
            $stores: path.resolve('/src/stores/stores.js')
        }
    },
    base: 'https://fortyseven.github.io/chit/'
});
