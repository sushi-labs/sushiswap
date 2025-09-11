const aspectRatio = require('@tailwindcss/aspect-ratio')
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/**
 * @type {import('tailwindcss').Config}
 * @see https://tailwindcss.com/docs/configuration
 *
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/common/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/wagmi/src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx,mdx}',
    '../../packages/notifications/src/**/*.{ts,tsx,mdx}',
  ],
  // content: [
  //   // app content
  //   `src/**/*.{js,ts,jsx,tsx}`,
  //   // include packages if not transpiling
  //   '../../packages/**/*.{js,ts,jsx,tsx}',
  // ],
  plugins: [
    forms,
    aspectRatio,
    typography,
    require('tailwindcss-animate'),
    plugin(({ addVariant }) => {
      addVariant('black', '.black &')
    }),
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
      xs: '380px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      backgroundImage: () => ({
        'gradient-radial': 'radial-gradient(#13213E, #111829)',
        'shimmer-gradient':
          'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0) 100%)',
        'shimmer-gradient-dark':
          'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.03) 30%, rgba(0, 0, 0, 0.06) 50%, rgba(0, 0, 0, 0.03) 70%, rgba(0, 0, 0, 0) 100%)',
      }),
      boxShadow: {
        md: 'rgba(0, 0, 0, 0.09) 0px 3px 12px',
        lg: 'rgba(0, 0, 0, 0.16) 2px 6px 24px',
        xl: 'rgba(0, 0, 0, 0.24) 2px 6px 24px',
        'depth-1': '0px 3px 6px rgba(15, 15, 15, 0.5)',
        'hover-card':
          'rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px',
      },
      colors: {
        gray: {
          100: '#f3f2f4',
        },
        slate: {
          50: '#FDFCFD',
          100: '#F9F9F9',
          200: '#E8E7EB',
          450: '#7B7A87',
          500: '#ABA5B0',
          700: '#6B7280',
          750: '#222137',
          800: '#15152B',
          900: '#0C0C23',
        },
        blue: {
          DEFAULT: '#4217ff',
          100: '#d2d2ff',
          200: '#b1aeff',
          300: '#8a80ff',
          400: '#644dff',
          550: '#3B82F6',
          500: '#4217ff',
          600: '#4216eb',
          700: '#3712c5',
          800: '#2f11a1',
          900: '#18076e',
        },
        skyblue: {
          DEFAULT: '#3db1ff',
          100: '#eff7ff',
          200: '#dfefff',
          300: '#b8e0ff',
          400: '#78c8ff',
          500: '#3db1ff',
          600: '#0692f1',
          700: '#0072ce',
          800: '#005ba7',
          900: '#024d8a',
        },
        pink: {
          DEFAULT: '#ec4899',
          100: '#FFF5FA',
          200: '#E4DDEC',
        },
        green: {
          DEFAULT: 'rgb(var(--green))',
          500: '#1DA67D',
        },
        red: {
          DEFAULT: 'rgb(var(--red))',
          100: '#DE5852',
        },
        yellow: {
          DEFAULT: '#eab308',
        },
        primary: 'var(--color)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        background: 'var(--background)',
      },
      animation: {
        ellipsis: 'ellipsis 1.25s infinite',
        'spin-slow': 'spin 2s linear infinite',
        heartbeat: 'heartbeat 1s ease 0.2s infinite normal forwards',
        rotate: 'rotate360 1s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        wave: 'shimmer 1.25s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        draw: 'draw 0.5s cubic-bezier(0.25, 0.25, 0.25, 1) forwards',
        dash: 'dash 1.5s 2s ease-out infinite',
        grow: 'grow 1s cubic-bezier(0.25, 0.25, 0.25, 1) forwards',
        'dash-check': 'dash-check 1.5s 2s ease-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        walk: 'walk 0.5s linear infinite',
        shadow: 'shadow 0.5s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        ellipsis: {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
        },
        heartbeat: {
          '0%': {
            transform: 'scale(1)',
            transformOrigin: 'center center',
            animationTimingFunction: 'ease-out',
          },
          '10%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.91)',
          },
          '17%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.98)',
          },
          '33%': {
            animationTimingFunction: 'ease-out',
            transform: 'scale(0.87)',
          },
          '45%': { animationTimingFunction: 'ease-out', transform: 'scale(1)' },
        },
        rotate360: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        dash: {
          '0%': {
            strokeDashoffset: '1000',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
        'dash-check': {
          '0%': {
            strokeDashoffset: '-100',
          },
          '100%': {
            strokeDashoffset: '900',
          },
        },
        draw: {
          '0%': { strokeOpacity: '1' },
          '100%': { strokeOpacity: '1', strokeDashoffset: '0' },
        },
        grow: {
          '0%': {
            transform: 'scale(0)',
          },
          '60%': {
            transform: 'scale(0.8)',
            strokeWidth: '4px',
            fillOpacity: '0',
          },
          '100%': {
            transform: 'scale(0.9)',
            strokeWidth: '8px',
            fillOpacity: '1',
            fill: 'currentColor',
          },
        },
        walk: {
          '17%': {
            'border-bottom-right-radius': '3px',
          },
          '25%': {
            transform: 'translateY(9px) translateX(9px)',
          },
          '50%': {
            transform: 'translateY(18px) translateX(18px) scale(1,.9)',
            'border-bottom-right-radius': '40px',
          },
          '75%': {
            transform: 'translateY(9px) translateX(9px)',
          },
          '100%': {
            transform: 'translateY(0) translateX(0)',
          },
        },
        shadow: {
          '50%': {
            transform: 'scale(1.2,1)',
          },
        },
      },
    },
  },
}
