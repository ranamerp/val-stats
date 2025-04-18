import { writable, type Writable } from "svelte/store";



export const presets: Writable<Record<string, App.ColorPreset>> = writable ({
    'Champs 24': {
        preset_id: 1,
        leftbgcolor: '#c2ae75',
        leftbigtextcolor: '#131313',
        leftsmalltextcolor: '#db3131',
        
        rightbgcolor: '#131313',
        rightbigtextcolor: '#c2ae75',
        rightsmalltextcolor:  '#ffffff',

        mvpbannerbgcolor: '#db3131',
        mvpbannertextcolor:  '#131313',
        mvpagentcolor:  '#ffffff',
        mvptextcolor: '#c2ae75',
        globaltextcolor: '#c2ae75',
        font: 'Arial',
        share_code: 'BTU17Y'
    },
    'Masters': {
        preset_id: 2,
        leftbgcolor: '#6644bb',
        leftbigtextcolor: '#dad9e4',
        leftsmalltextcolor: '#c2ae75',
        
        rightbgcolor: '#dad9e4',
        rightbigtextcolor: '#6644bb',
        rightsmalltextcolor:  '#000000',

        mvpbannerbgcolor: '#e9d98d',
        mvpbannertextcolor:  '#000000',
        mvpagentcolor:  '#ffffff',
        mvptextcolor: '#6644bb',
        globaltextcolor: '#e9d98d',
        font: 'Arial',
        share_code: 'WTLMH0'
    },
    'VCL NA': {
        preset_id: 3,
        leftbgcolor: '#0da68c',
        leftbigtextcolor: '#eff6f9',
        leftsmalltextcolor: '#e9d98d',
        
        rightbgcolor: '#eff6f9',
        rightbigtextcolor: '#0da68c',
        rightsmalltextcolor:  '#000000',

        mvpbannerbgcolor: '#e9d98d',
        mvpbannertextcolor:  '#000000',
        mvpagentcolor:  '#ffffff',
        mvptextcolor: '#0da68c',
        globaltextcolor: '#e9d98d',
        font: 'Arial',
        share_code: 'Z2XK7A'
    },
    'Red Bull': {
        preset_id: 4,
        leftbgcolor: '#bb4e52',
        leftbigtextcolor: '#163558',
        leftsmalltextcolor: '#ffffff',
        
        rightbgcolor: '#0f1221',
        rightbigtextcolor: '#bb4e52',
        rightsmalltextcolor:  '#ffffff',

        mvpbannerbgcolor: '#ffffff',
        mvpbannertextcolor:  '#000000',
        mvpagentcolor:  '#bb4e52',
        mvptextcolor: '#bb4e52',
        globaltextcolor: '#ffffff',
        font: 'Arial',
        share_code: '4F8N7X'
    },
    'SEN': {
        preset_id: 5,
        leftbgcolor: '#d4062c',
        leftbigtextcolor: '#ffffff',
        leftsmalltextcolor: '#e9d98d',
        
        rightbgcolor: '#0f1221',
        rightbigtextcolor: '#d4062c',
        rightsmalltextcolor:  '#ffffff',

        mvpbannerbgcolor: '#e9d98d',
        mvpbannertextcolor:  '#000000',
        mvpagentcolor:  '#ffffff',
        mvptextcolor: '#d4062c',
        globaltextcolor: '#e9d98d',
        font: 'Arial',
        share_code: '6F5Z3N'
    }
})


export const currentColor: Writable<App.ColorPreset> = writable (
    {
        preset_id: 1,
        leftbgcolor: '#c2ae75',
        leftbigtextcolor: '#131313',
        leftsmalltextcolor: '#db3131',
        
        rightbgcolor: '#131313',
        rightbigtextcolor: '#c2ae75',
        rightsmalltextcolor:  '#ffffff',

        mvpbannerbgcolor: '#db3131',
        mvpbannertextcolor:  '#131313',
        mvpagentcolor:  '#ffffff',
        mvptextcolor: '#c2ae75',
        globaltextcolor: '#c2ae75',
        font: 'Arial',
        share_code: 'BTU17Y'
    }
)