import { writable, type Writable } from 'svelte/store'


const maps: Writable<Record<string, App.ValorantMap>> = writable({});

async function updateMaps() {
    const newdata: Record<string, App.ValorantMap> = {};
    try {
        const response = await fetch('https://valorant-api.com/v1/maps');
        const data = await response.json();
        data.data.forEach((item: App.ValorantMap) => {
            newdata[item.displayName] = {
                uuid: item.uuid,
                displayName: item.displayName,
                displayIcon: item.displayIcon,
                splash: item.splash
            }
        });
        maps.set(newdata); 
    } catch(error) {
        console.error('Error fetching data:', error);
    }

}

//Want this to only run when theres a diff in maps
await updateMaps()


export default maps;