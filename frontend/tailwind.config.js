/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#142B4A',
          blue: '#1D4ED8',
          blueHover: '#1E40AF',
          blueLight: '#EFF6FF',
          teal: '#0F766E',
          tealLight: '#F0FDFA',
          bg: '#F4F7FB',
          card: '#FFFFFF',
          text: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
          saffron: '#FF9933',
          green: '#138808',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(20, 43, 74, 0.05)',
        'gov': '0 4px 6px -1px rgba(20, 43, 74, 0.07), 0 2px 4px -2px rgba(20, 43, 74, 0.05)',
        'gov-md': '0 10px 15px -3px rgba(20, 43, 74, 0.08), 0 4px 6px -4px rgba(20, 43, 74, 0.04)',
        'gov-lg': '0 20px 25px -5px rgba(20, 43, 74, 0.1), 0 8px 10px -6px rgba(20, 43, 74, 0.05)',
      }
    },
  },
  plugins: [],
}
