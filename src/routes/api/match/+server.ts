import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { processMatches } from '../../../utils/match';




export async function GET({ url }) {
    const region = url.searchParams.get('region');
    const name = url.searchParams.get('name');
    const tag = url.searchParams.get('tag');

    //Temp removing custom game from this list, this probably will change
    const apiUrl = `https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${name}/${tag}?mode=custom`;

    try {
        
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': env.VALORANT_API_KEY,
            },
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    
        

        const data: App.APIResponse = await response.json();
        
        if (data.data.length === 0) throw new Error('Unable to find custom match, please try again later!')

        const selection: App.LocalMatch[] = processMatches(data);
        return json(selection);
        //Need an error for when data is empty or player can't be found.
    } catch (error) {
        console.error('Error fetching match data:', error);
        return json({ error: 'Failed to fetch match data' }, { status: 500 });
    }
}



