import { writable } from 'svelte/store';

export const globalFont = writable({
    family: 'Arial', // default font
    category: 'sans-serif' // optional category
});