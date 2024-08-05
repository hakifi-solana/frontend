import type { Config } from "tailwindcss";
import colors from "./src/colors";

const config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
		colors,
		container: {
			center: true,
			screens: {
				"2xl": "1440px",
			},
		},
		extend: {
			flex: {
				"2": "2 2 0%",
				"1.5": "1.5 1.5 0%",
			},
			transitionDuration: {
				"2000": "2000ms",
			},
			fontFamily: {
				saira: ["var(--font-saira)"],
				determination: ["var(--font-determination)"],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				// if you are using drawer variant bottom
				"drawer-bottom-up": {
					"0%, 100%": { bottom: "-500px" },
					"100%": { bottom: "50%" },
				},
				"drawer-bottom-down": {
					"0%, 100%": { bottom: "50%" },
					"100%": { bottom: "-500px" },
				},
			},
			boxShadow: {
				fixed: "0px 0px 5px rgba(9, 30, 66, 0.15)",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"drawer-bottom-up": "drawer-bottom-up 0.6s ease-out",
				"drawer-bottom-down": "drawer-bottom-down 0.6s ease-out",
			},
			spacing: {
				"full-screen": "calc(100vw - 32px)",
				"fit-screen": "calc(100dvh - 65px)",
			},
			fontSize: {
				"3xl": "28px",
			},
			borderRadius: {
				md: "4px",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
