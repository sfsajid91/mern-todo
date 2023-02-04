/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#3b82f6',

                    secondary: '#60a5fa',

                    accent: '#34d399',

                    neutral: '#ffff',

                    'base-100': '#ffffff',

                    info: '#67e8f9',

                    success: '#4ade80',

                    warning: '#facc15',

                    error: '#E1415C',
                },
            },
        ],
    },
};
