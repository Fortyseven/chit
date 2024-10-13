import postcss from './postcss.config.cjs';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import sveltePreprocess from 'svelte-preprocess';
import path from 'path';
const IGNORED_WARNINGS = [
    'a11y-autofocus',
    'a11y-click-events-have-key-events',
    'a11y-label-has-associated-control',
    'a11y-missing-attribute',
    'a11y-no-noninteractive-element-interactions',
    'a11y-no-static-element-interactions',
    'css-unused-selector'
];

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                scss: {
                    prependData: "@import 'src/styles/globals.scss';"
                }
            }),
            onwarn(warning, handler) {
                if (!IGNORED_WARNINGS.includes(warning.code)) handler(warning);
            }
        }),
        nodePolyfills({
            // To exclude specific polyfills, add them to this list.
            exclude: [
                'fs' // Excludes the polyfill for `fs` and `node:fs`.
            ],
            // Whether to polyfill specific globals.
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false
                global: true,
                process: true
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true
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
