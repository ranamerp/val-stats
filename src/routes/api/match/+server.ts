import { json } from '@sveltejs/kit';




export async function GET({ url }) {
    const region = url.searchParams.get('region');
    const name = url.searchParams.get('name');
    const tag = url.searchParams.get('tag');

    //Temp removing custom game from this list, this probably will change
    const apiUrl = `https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${name}/${tag}?mode=custom`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'HDEV-de097c2b-bc59-4f35-a19b-f9308d212407',
            },
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    
        

        const data: App.APIResponse = await response.json();
        
        if (data.data.length === 0) throw new Error('Unable to find custom match, please try again later!')

        return json(data);
        //Need an error for when data is empty or player can't be found.
    } catch (error) {
        console.error('Error fetching match data:', error);
        return json({ error: 'Failed to fetch match data' }, { status: 500 });
    }
}