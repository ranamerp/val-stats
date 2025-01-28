import { processMatches } from '../utils/match';
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {

    //Potential improvement: check if user is logged in and get their current match from db. 

    // Match fetching logic
    const region = 'na';
    let name: string = '469 ion2x';
    const tag = '1love';

    const matchResponse = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
    let matchData: App.APIResponse = {
        status: 500,
        data: []
    }

    if (matchResponse.status === 500) {
        const refResponse = await fetch('ref.json');
        const d = await refResponse.json();
        matchData = {status: 200, data: processMatches(d)}

        name = 'sen z#5193';
    } else {
        const d: App.LocalMatch[] = await matchResponse.json();
        matchData = {status: 200, data: d}
    }

    
    return { 
        stats: matchData.data,
        player: name }
  }
