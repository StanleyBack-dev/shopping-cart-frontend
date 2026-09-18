import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: 'rgb(var(--color-shell) / <alpha-value>)',
        page: 'rgb(var(--color-page) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        hairline: 'rgb(var(--color-hairline) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-ink-subtle) / <alpha-value>)',
        },
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900) / <alpha-value>)',
        },
        ok: {
          fg: 'rgb(var(--color-ok-fg) / <alpha-value>)',
          bg: 'rgb(var(--color-ok-bg) / <alpha-value>)',
          border: 'rgb(var(--color-ok-border) / <alpha-value>)',
        },
        err: {
          fg: 'rgb(var(--color-err-fg) / <alpha-value>)',
          bg: 'rgb(var(--color-err-bg) / <alpha-value>)',
          border: 'rgb(var(--color-err-border) / <alpha-value>)',
        },
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
