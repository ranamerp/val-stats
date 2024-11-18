//This store should be used to persist the selected match. It'll be referred to in the output route. 
// I think this can be done better (probably with Supabase), so will aim to remove this eventually
import { writable, type Writable } from 'svelte/store'

//I'm going to ignore the TS error here since this is going to be eventually removed
export const selectedmatch: Writable<{match: App.LocalMatch, colors: App.ColorPreset}> = writable ({
    match: {},
    colors: {}
})