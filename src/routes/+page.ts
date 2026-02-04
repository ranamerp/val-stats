import { processMatches } from '../utils/match';
import type { PageLoad } from './$types'
import { updateAgents } from '../stores/Agents';
import { updateMaps } from '../stores/Maps';


export const load: PageLoad = async ({ fetch, parent }) => {

    await updateMaps();

    await updateAgents();

    const statsPromise = (async () => {
        // Match fetching logic
        const region = 'na';
        let name: string = 'zeek';
        let puuids: string[] | null = null;
        let final_puuid: string | null = null;
        const tag = '777';
        //Potential improvement: check if user is logged in and get their current match from db. 
        const { supabase, user } = await parent();

        if (!user?.id) {
            console.log('No user logged in, using default name.');
            name = 'zeek';
        } else {
        try {
            const { data, error } = await supabase
                .schema('stats')
                .from('users')
                .select('current_match')
                .eq("user_id", user?.id)
                .single();
            
            const playerlist = data?.current_match.red_team.players;
            puuids = playerlist?.map((p: { puuid: string }) => p.puuid) ?? [];
            if (error) {
                //return { status: 404, error: error.message };
                //This acts as a fallback
                name = 'zeek';
            }
            } catch (error) {
                console.error('Unexpected Error:', error);
                name = 'zeek';

                //return { status: 500, error: 'Internal Server Error' };
            }

        }

        let matchResponse: Response | null = null;
        if (puuids) {
            // Go through it, if 
            for (const puuid of puuids) {
                matchResponse = await fetch(`/api/match?region=${region}&puuid=${puuid}`);
                if (matchResponse.status === 200) {
                    final_puuid = puuid;
                    break; // Exit the loop if a successful response is received
                }
            }
        }
        else {
            matchResponse = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
        }
        let matchData: App.APIResponse = {
            status: 500,
            data: []
        }

        if (matchResponse?.status === 500) {
            const refResponse = await fetch('ref.json');
            const d = await refResponse.json();
            matchData = {status: 200, data: processMatches(d)}

            name = 'sen z#5193';
        } else {
            const d: App.LocalMatch[] = await matchResponse?.json() ?? [];
            
            const players = d[0] 
                ? [...d[0].red_team.players, ...d[0].blue_team.players]
                : [];
            const player = players.find(p => p.puuid === final_puuid);
            name = player ? player.name + '#' + tag : name;
            matchData = {status: 200, data: d}
        }

        
        return { 
            stats: matchData.data,
            player: name }
    })();

    return {
        statsPromise
    }
}
