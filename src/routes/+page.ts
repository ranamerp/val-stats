export async function load({ fetch }) {
    const region = 'na';
    let name: string = 'kaoticcc';
    const tag = '555';

    const response = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
    let data: App.APIResponse = {
        status: 500,
        data: []
    };


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