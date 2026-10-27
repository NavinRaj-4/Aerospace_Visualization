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
        aero: {
          950: '#060a12',
          900: '#0b1120',
          850: '#11192e',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          cyan: '#06b6d4',
          'cyan-glow': '#22d3ee',
          neon: '#00f0ff',
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Space Grotesk', 'Orbitron', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-slide': 'flowSlide 1.5s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.8))' },
        },
        flowSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'cyan-glow-lg': '0 0 40px -5px rgba(6, 182, 212, 0.6)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'red-glow': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'amber-glow': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}
