import { writable, type Writable } from 'svelte/store'


const agents: Writable<Record<string, App.ValorantAgent>> = writable({});

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
            console.log()
        });
        agents.set(newdata);
    } catch(error) {
        console.error('Error fetching data:', error);
    }

}

//Want this to only run when theres a diff in agents
await updateAgents()



export default agents;