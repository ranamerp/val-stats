import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { processMatches } from '../../../utils/match';




export async function GET({ url }) {
    const region = url.searchParams.get('region');
    const name = url.searchParams.get('name');
    const tag = url.searchParams.get('tag');
    const puuid = url.searchParams.get('puuid')

    // The custom parameter is causing issues, we may do no custom parameter. 
    // ?mode=custom
    // Need a fallback url for when custom doesnt work. Just use normal.
    let apiUrl: string = ''
    if (puuid) {
        apiUrl = `https://api.henrikdev.xyz/valorant/v4/by-puuid/matches/${region}/pc/${puuid}?mode=custom`;

    }
    else if (name && tag) {
        apiUrl = `https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${name}/${tag}?mode=custom`;

    }
    else {
        throw new Error(`Unable to parse API ${404}`);
    }
    

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
        if (selection.length === 0) throw new Error('No matches found for the specified player.');
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



