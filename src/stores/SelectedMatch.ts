//This store should be used to persist the selected match. It'll be referred to in the output route. 
// I think this can be done better (probably with Supabase), so will aim to remove this eventually
import { writable } from 'svelte/store'

export const selectedmatch = writable ({
    match: {},
    colors: {}
})