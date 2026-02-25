export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            },
            colors: {
                primary: '#06b6d4', // cyan-500
                secondary: '#8b5cf6', // violet-500
                darkbg: '#020617', // slate-950
                glass: 'rgba(15, 23, 42, 0.6)', // slate-900/60
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
