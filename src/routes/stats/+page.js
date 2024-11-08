// import { agents } from "../../stores/Agents.js";
//import { getMatchData } from '../../lib/match.js'

// async function getMatchData(region, name, tag) {
//     const url = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}?mode=custom`;
//     try {
//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Authorization': 'HDEV-de097c2b-bc59-4f35-a19b-f9308d212407',
//           },
//         });
    
//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }
    
//         const data = await response.json();

//         if (!data.data || data.data.length === 0) {
//             //This eventually needs to be a popup sent back to the user
//             console.warn('No matching data found.')
//             return null;
//         }

//         return data.data;
//     } catch (error) {
//         console.error('Error fetching match data:', error);
//         return null;
//     }
// }    


export async function load({ fetch }) {
    const region = 'na';
    let name = 'kaoticcc';
    const tag = '555';

    const response = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
    let data = {};

    // This is for when we can't get a player json, so we use our reference one. 
    // Will need to update this to v4, but for now this works
    if (response.status === 500) {
        const req = await fetch('ref.json');
        data = await req.json();
        name = 'katsumi#fps';
    }
    else {
        data = await response.json();
    }

    
    return {
        stats: data.data,
        player: name
    }
}