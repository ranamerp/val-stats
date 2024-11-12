import { writable, type Writable } from "svelte/store";




export const presets: Writable<Record<string, App.ColorPreset>> = writable ({
    'Champs 24': {
        primaryColor: '#c2ae75',
        secondaryColor: '#131313',
        tertiaryColor: '#db3131',
        quadiaryColor: '#ffffff'
    },
    'Masters': {
        primaryColor: '#5e45aa',
        secondaryColor: '#dad9e4',
        tertiaryColor: '#c2ae75',
        quadiaryColor: '#000000'
    },
    'VCL NA': {
        primaryColor: '#0da68c',
        secondaryColor: '#eff6f9',
        tertiaryColor: '#e9d98d',
        quadiaryColor: '#000000'
    },
    'Red Bull': {
        primaryColor: '#bb4e52',
        secondaryColor: '#163558',
        tertiaryColor: '#ebe7df',
        quadiaryColor: '#000000'
    },
    'SEN': {
        primaryColor: '#d4062c',
        secondaryColor: '#0c0b14',
        tertiaryColor: '#e9da8d',
        quadiaryColor: '#ffffff'
    }
})
