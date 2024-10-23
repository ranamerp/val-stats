//This store should be used to persist the selected match. It'll be referred to in the output route. 
import { writable } from 'svelte/store'

export const selectedmatch = writable ({
    match: {},
    colors: {}
})