<script>
    //Input box for player tag
    //Does page.js update? Or do we need to do an API fetch on the search. 
    //Maybe home page is search bar, which sends to page.js for a stats page (where the real fun is)
    //Player tag split and data sent to page.js 
    //Page.js returns matchData object
    //Right now, store all the data in a table 

    import Stats from "../../components/Stats.svelte";

    
    export let data;
    const { stats } = data
    let selection = [];
    let value = 0;
    for (let item in stats) {
        let base = stats[item]
        let map = base['metadata']['map'];
        let startTime = base['metadata']['game_start_patched']
        let totalRounds = base['metadata']['rounds_played']
        
        let firstkills = {};
        let currentRound = -1;
        //This syntax was done by chatgpt, I should maybe consider doing something similar. 
        base.kills.forEach(kill => {
            let itemRound = kill.round;
            if (currentRound === itemRound) {
                return;
            }
            let killer = kill.killer_puuid;
            if (killer in firstkills) {
                firstkills[killer] += 1;
            } else {
                firstkills[killer] = 1;
            }
            currentRound = itemRound;
        });
        let teams = []
        let players = []
        for (let team in base['teams']) {
            let teamData = {
                "team_name": team,
                "won_bool": base['teams'][team]['has_won'],
                "rounds_won": base['teams'][team]['rounds_won']
            };
            let playerBase = base['players'][team];
            for (let pindex in playerBase) {
                let player = playerBase[pindex]
                let kd = 1;
                if(player['stats']['deaths'] != 0) {
                    kd = Number(parseFloat(player['stats']['kills'] / player['stats']['deaths']).toFixed(2))
                }
                let playerData = {
                    "puuid": player['puuid'],
                    "name": player['name'],
                    "team": player['team'],
                    "agent": player['character'],
                    'kd': kd,
                    'kills': player['stats']['kills'],
                    'deaths': player['stats']['deaths'],
                    'acs': Math.round(player['stats']['score'] / totalRounds),
                    'firstkills': firstkills[player['puuid']]
                }
                players.push(playerData)
            }
            teams.push(teamData)
        }
        
        players.sort((a, b) => a.team.localeCompare(b.team) || b.acs - a.acs)
        selection.push(
            {
                "index" : item,
                "match_id": base['metadata']['match_id'], 
                "mapName" : map,
                "startTime" : startTime,
                "teams": teams,
                "players": players

            }
        )
    }
</script>

<h1> Choose a match :</h1>


<select bind:value>
    {#each selection as item}
        {#if stats[item.index]['metadata']['mode'] == "Custom Game"}
            <option value = {item.index}>"{item.mapName} ({item.startTime})"</option>
        {/if}
    {/each}
</select>

<br>
<!-- Get data from selection[value] and place here, then start using it to style.  -->
{console.log(selection[value])}
<Stats playerData={selection[value]}></Stats>
<!-- { #each Object.entries(selection[value]['teams']) as [team, teamData] }
<h2> Team {teamData['team_name']} Stats: </h2>
Team Name: {teamData['team_name']}
Winner? : { #if teamData['has_won'] == true} WON {:else} LOSS {/if}
Rounds Won: {teamData['rounds_won']}

<br>
{#each Object.entries(selection[value]['players']) as [index, player] }
{#if player['team'].toLowerCase() == teamData['team_name'].toLowerCase()}
Player Name: {player['name']} 
<br>
Team: {player['team']}
<br>
Agent: {player['agent']}
<br>
K/D: {player['kd']}
<br>
Kills: {player['kills']}
<br>
First Kills: {player['firstkills']}
{/if}
{/each}

<br>
<br>
{/each}


Map: {stats[value]['metadata']['map']}
<br>
Time: {stats[value]['metadata']['game_start_patched']} -->