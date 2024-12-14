export function processMatch(match: App.ValorantMatch) {
    const totalRounds = match.rounds.length;
    const teams: App.LocalTeam[] = [];
    const firstkills: any = {};
    let currentRound = -1;
    match.kills.forEach((kill) => {
        const itemRound = kill.round;
        if (currentRound === itemRound) {
            return;
        }
        const killer = kill.killer.puuid;
        firstkills[killer] = (firstkills[killer] || 0) + 1;
        currentRound = itemRound;
    });
    for (const team of match.teams) {       
        const playerBase = match.players;
        const localPlayers: App.LocalPlayer[] = [];
        for (const player of playerBase) {
            let kd = 1;
            if(player.stats.deaths != 0) {
                kd = +(player.stats.kills / player.stats.deaths).toFixed(2);
            }
            const playerData = {
                puuid: player.puuid,
                name: player.name,
                team: player.team_id,
                agent: player.agent.name,
                kd: kd,
                kills: player.stats.kills,
                deaths: player.stats.deaths,
                acs: Math.round(player.stats.score / totalRounds),
                firstkills: (firstkills[player.puuid] === undefined ) ? 0 : firstkills[player.puuid]
            }
            
            localPlayers.push(playerData)
        }
        localPlayers.sort((a, b) => a.team.localeCompare(b.team) || b.acs - a.acs)
        let teamData = {
            team_id : team.team_id,
            //team_name: team.team_id.toLowerCase() === "red" ? (rtname || "ATK") : (team.team_id.toLowerCase() === "blue" ? (btname || "DEF") : ""),
            team_name: team.team_id.toLowerCase() === "red" ? ("ATK") : (team.team_id.toLowerCase() === "blue" ? ("DEF") : ""),
            won_bool: team.won,
            won: team.won ? "WIN" : "LOSS",
            rounds_won: team.rounds.won,
            players: localPlayers
        };
        teams.push(teamData)
    }

    for (const team of teams) {
        const filteredPlayers = team.players?.filter(player => player.team.toLowerCase() === team.team_id.toLowerCase());
        team.players = filteredPlayers;
    }

    return {
        index: 0,
        match_id: match.metadata.match_id,
        mapName: match.metadata.map.name,
        startTime: match.metadata.started_at,
        red_team: teams?.find(team => team.team_id.toLowerCase() === 'red') as App.LocalTeam,
        blue_team: teams?.find(team => team.team_id.toLowerCase() === 'blue') as App.LocalTeam
    }
}

export function processMatches(data: App.APIResponse) {
    const selection: App.LocalMatch[] = []

    data.data?.forEach((match, index) => {
        const m = processMatch(match as App.ValorantMatch)
        m.index = index;
        selection.push(m)
    });
    
    return selection;
}