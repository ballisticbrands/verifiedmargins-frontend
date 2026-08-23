/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // The shared package's compiled JS — Tailwind's JIT has to see the class
    // names used inside <Button>, <Input>, <Turnstile>, <GoogleSignInButton>,
    // <AuthDivider> etc., or the shared auth UI ships unstyled.
    './node_modules/@ballisticbrands/frontend-shared/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};
