import { writable, type Writable, get } from 'svelte/store'


const maps: Writable<Record<string, App.ValorantMap>> = writable({});

function getNewMaps(apiData: Record<string, App.ValorantMap>): Record<string, App.ValorantMap> {
  const currentMaps = get(maps);
  const newMaps: Record<string, App.ValorantMap> = {};
  
  for (const [id, map] of Object.entries(apiData)) {
    if (!(id in currentMaps)) {
      newMaps[id] = map;
    }
  }
  
  return newMaps;
}

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
    
    // Get only the new maps
    const diff = getNewMaps(newdata);
    
    // Only update if there are new maps
    if (Object.keys(diff).length > 0) {
      maps.update(currentMaps => ({
        ...currentMaps,
        ...diff
      }));
      console.log(`Added ${Object.keys(diff).length} new maps:`, Object.keys(diff));
    } else {
      console.log('No new maps to add');
    }
    
  } catch(error) {
    console.error('Error fetching data:', error);
  }
}



export default maps;
export { updateMaps };