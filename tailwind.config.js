/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: ['class'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundColor: {
				'bd-green': '#006747',
				'bd-red': '#da291c',
			},
			fontSize: {
				md: '0.96rem',
			},
			typography: {
				DEFAULT: {
					css: {
						h1: { fontSize: "2.25rem", lineHeight: "2.5rem", fontWeight: "700", marginTop: "2rem" },
						h2: { fontSize: "1.875rem", lineHeight: "2.25rem", fontWeight: "600", marginTop: "1.75rem" },
						h3: { fontSize: "1.5rem", lineHeight: "2rem", fontWeight: "600", marginTop: "1.5rem" },
						h4: { fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: "500", marginTop: "1.25rem" },
					},
				},
			},
			colors: {
				'bd-green': '#006747',
				'bd-red': '#da291c',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

