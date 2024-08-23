import { writable } from 'svelte/store'
//I want to write a script that checks if this data exists, and if not then update the store

const agents = writable([]);

async function updateAgents() {
    let newdata = {};
    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        const data = await response.json();
        data.data.forEach(item => {
            newdata[item.displayName] = {
                uuid: item.uuid,
                displayIcon: item.displayIcon,
                fullPortrait: item.fullPortrait,
                role: item.role?.displayName,
                roleIcon: item.role?.displayIcon
            }

        });
        agents.set(newdata); // Replace the store's value with the fetched data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//Want this to only run when theres a diff in agents
await updateAgents()


export default agents;
