import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {


    // Match fetching logic
    const region = 'na';
    let name: string = '469 ion2x';
    const tag = '1love';

    const matchResponse = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
    let matchData: App.APIResponse = {
        status: 500,
        data: []
    };

    if (matchResponse.status === 500) {
        const refResponse = await fetch('ref.json');
        matchData = await refResponse.json();
        name = 'sen z#5193';
    } else {
        matchData = await matchResponse.json();
    }

    return { 
        stats: matchData.data,
        player: name }
  }
