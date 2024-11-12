import { writable, type Writable } from 'svelte/store'

interface ValorantAgent {
    uuid: string;
    displayName: string;
    displayIcon: string;
    fullPortrait: string;
    rawRole?: {
        displayName: string;
        displayIcon: string;
    };
    role?: string;
    roleIcon?: string;

}



const agents: Writable<Record<string, ValorantAgent>> = writable({});

async function updateAgents() {
    const newdata: Record<string, ValorantAgent> = {};
    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        data.data.forEach((item: ValorantAgent) => {
            newdata[item.displayName] = {
                uuid: item.uuid,
                displayName: item.displayName,
                displayIcon: item.displayIcon,
                fullPortrait: item.fullPortrait,
                role: item.rawRole?.displayName,
                roleIcon: item.rawRole?.displayIcon
            }
        });
        agents.set(newdata); 
    } catch(error) {
        console.error('Error fetching data:', error);
    }

}

//Want this to only run when theres a diff in agents
await updateAgents()


export default agents;