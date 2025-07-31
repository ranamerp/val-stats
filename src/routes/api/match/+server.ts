import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { processMatches } from '../../../utils/match';




export async function GET({ url }) {
    const region = url.searchParams.get('region');
    const name = url.searchParams.get('name');
    const tag = url.searchParams.get('tag');

    // The custom parameter is causing issues, we may do no custom parameter. 
    // ?mode=custom
    const apiUrl = `https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${name}/${tag}`;

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
    } catch (error: unknown) {
        console.error('Error fetching match data:', error);
        if ( error instanceof Error && error.message.includes('404')) {
            return json({ error: 'Match not found' }, { status: 404 });
        }
        return json({ error: 'Failed to fetch match data' }, { status: 500 });
    }
}



