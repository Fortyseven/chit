/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-fg)',
                'ui-primary-fg': 'var(--ui-primary-fg)',
                'ui-primary-bg': 'var(--ui-primary-bg)',
                'core-color': 'var(--core-color)',
                'core-color-lighter1': 'var(--core-color-lighter1)',
                'core-color-lighter2': 'var(--core-color-lighter2)',
                'core-color-lighter3': 'var(--core-color-lighter3)',
                'core-color-lighter4': 'var(--core-color-lighter4)',
                'core-color-lighter5': 'var(--core-color-lighter5)',
                'core-color-lighter6': 'var(--core-color-lighter6)',
                'core-color-darker1': 'var(--core-color-darker1)',
                'core-color-darker2': 'var(--core-color-darker2)',
                'core-color-darker3': 'var(--core-color-darker3)',
                'core-color-darker4': 'var(--core-color-darker4)',
                'core-color-darker5': 'var(--core-color-darker5)',
                'core-color-darker6': 'var(--core-color-darker6)',
                'accent-color': 'var(--accent-color)',
                'accent-color-lighter1': 'var(--accent-color-lighter1)',
                'accent-color-lighter2': 'var(--accent-color-lighter2)',
                'accent-color-lighter3': 'var(--accent-color-lighter3)',
                'accent-color-lighter4': 'var(--accent-color-lighter4)',
                'accent-color-lighter5': 'var(--accent-color-lighter5)',
                'accent-color-lighter6': 'var(--accent-color-lighter6)',
                'accent-color-darker1': 'var(--accent-color-darker1)',
                'accent-color-darker2': 'var(--accent-color-darker2)',
                'accent-color-darker3': 'var(--accent-color-darker3)',
                'accent-color-darker4': 'var(--accent-color-darker4)'
                'accent-color-darker5': 'var(--accent-color-darker5)'
                'accent-color-darker6': 'var(--accent-color-darker6)'
            }
        }
    },
    plugins: [],
    darkMode: true
};
