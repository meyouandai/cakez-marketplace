import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cake-pink': '#FFB6C1',
        'cake-purple': '#DDA0DD',
        'cake-yellow': '#FFFACD',
        'cake-mint': '#98FB98',
        'cake-blue': '#87CEEB',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config