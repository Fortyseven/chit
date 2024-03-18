/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                grey0: '#111',
                grey1: '#222',
                grey2: '#333'
            }
        }
    },
    plugins: [],
    darkMode: true
};
