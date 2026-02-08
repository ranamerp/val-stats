import { writable, type Writable, get } from 'svelte/store'


const agents: Writable<Record<string, App.ValorantAgent>> = writable({});

function getNewAgents(apiData: Record<string, App.ValorantAgent>): Record<string, App.ValorantAgent> {
  const currentAgents = get(agents);
  const newAgents: Record<string, App.ValorantAgent> = {};
  
  for (const [id, agent] of Object.entries(apiData)) {
    if (!(id in currentAgents)) {
      newAgents[id] = agent;
    }
  }
  
  return newAgents;
}

async function updateAgents() {
    const newdata: Record<string, App.ValorantAgent> = {};

    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        data.data.forEach((item: App.ValorantAgent) => {
            newdata[item.displayName] = {
                uuid: item.uuid,
                displayName: item.displayName,
                displayIcon: item.displayIcon,
                fullPortrait: item.fullPortrait,
                role: typeof item.role === 'string' 
                    ? item.role 
                    : item.role?.displayName,
                roleIcon: typeof item.role === 'string'
                    ? undefined
                    : item.role?.displayIcon
            }
            
        });

        const diff = getNewAgents(newdata);

        if (Object.keys(diff).length > 0) {
            agents.update(currentAgents => ({
                ...currentAgents,
                ...diff
            }));
            console.log(`Added ${Object.keys(diff).length} new agents:`, Object.keys(diff));
        } else {
            console.log('No new agents to add');
        }
    } catch(error) {
        console.error('Error fetching data:', error);
    }
}

await updateAgents();

export default agents;
export { updateAgents };