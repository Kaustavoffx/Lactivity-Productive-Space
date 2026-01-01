/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                antigravity: {
                    dark: '#0f172a', // Slate 900
                    surface: '#1e293b', // Slate 800
                    card: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    purple: '#8b5cf6', // Violet 500
                    blue: '#3b82f6', // Blue 500
                    accent: '#6366f1', // Indigo 500
                }
            },
            fontFamily: {
                sans: ['Keygen', 'Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
