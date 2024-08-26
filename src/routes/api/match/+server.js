import { json } from '@sveltejs/kit';
//import { getMatchData } from '$lib/match.js';

export async function GET({ url }) {
    const region = url.searchParams.get('region');
    const name = url.searchParams.get('name');
    const tag = url.searchParams.get('tag');

    const apiUrl = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}?mode=custom`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'HDEV-de097c2b-bc59-4f35-a19b-f9308d212407',
            },
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return json(data);
        //Need an error for when data is empty or player can't be found.
    } catch (error) {
        console.error('Error fetching match data:', error);
        return json({ error: 'Failed to fetch match data' }, { status: 500 });
    }
}