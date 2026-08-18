/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Hero: 72px / 1.05
        'hero':    ['72px', { lineHeight: '1.05', fontWeight: '600' }],
        // Section heading: 52px / 1.1
        'section': ['52px', { lineHeight: '1.1',  fontWeight: '600' }],
        // Subheading: 18px / 1.5
        'sub':     ['18px', { lineHeight: '1.5',  fontWeight: '400' }],
        // Body: 16px / 1.6
        'body':    ['16px', { lineHeight: '1.6',  fontWeight: '400' }],
        // Small: 14px / 1.4
        'sm-text': ['14px', { lineHeight: '1.4',  fontWeight: '400' }],
        // Button: 15px
        'btn':     ['15px', { lineHeight: '1.4',  fontWeight: '500' }],
      },
      colors: {
        // Light sky theme — matches Obliqq exactly
        sky: {
          hero:   '#C5DBE8',
          mid:    '#D6E6EE',
          light:  '#E8EFF4',
          peach:  '#E8D5C4',
          warm:   '#EDE0D4',
        },
        ink:    '#0F0F0F',
        body:   '#2A2A2A',
        muted:  '#666666',
        border: '#D8D8D8',
        white:  '#FFFFFF',
        accent: '#0F0F0F',
      },
      borderRadius: {
        pill: '100px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'nav':       '0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card':      '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 12px 40px rgba(0,0,0,0.12)',
        'mockup':    '0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
        'popup':     '0 40px 100px rgba(0,0,0,0.20), 0 10px 30px rgba(0,0,0,0.12)',
      },
      animation: {
        'marquee':         'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
      },
      keyframes: {
        marquee:         { '0%': { transform: 'translateX(0)' },    '100%': { transform: 'translateX(-50%)' } },
        'marquee-reverse':{ '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
