import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				// You can name this whatever you like
				foundry: ['Foundry', 'sans-serif'],
			},
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;
