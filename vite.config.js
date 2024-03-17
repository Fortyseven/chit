import postcss from './postcss.config.cjs';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                scss: {
                    prependData: "@import 'src/styles/globals.scss';"
                }
            })
        })
    ],
    css: {
        postcss
    },
    resolve: {
        alias: {
            '@': path.resolve('/src'),
            $src: path.resolve('./src'),
            $lib: path.resolve('./src/lib'),
            $stores: path.resolve('./src/stores'),
            $components: path.resolve('./src/components')
        }
    },
    base: 'https://fortyseven.github.io/chit/'
});
