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
    //These parts need to eventually be chosen by user via dropdown
    let primaryColor = "#0da68c";
    let secondaryColor = "#eff6f9";
    let tertiaryColor = "#e9d98d";
    let quadiaryColor = "#000000";
    let btname = "SEN";
    let rtname = "100T";

    

    for (let item in stats) {
        let base = stats[item]
        let map = base['metadata']['map'];
        let startTime = base['metadata']['game_start_patched']
        let totalRounds = base['metadata']['rounds_played']
        let teams = []
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
        //This logic probably has to change with v4 (and eventually with riot api). Sticking with v2 for now
        for (let team in base['teams']) {       
            let playerBase = base['players'][team];
            let localPlayers = [];
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
                //players.push(playerData)
                localPlayers.push(playerData)
            }
            localPlayers.sort((a, b) => a.team.localeCompare(b.team) || b.acs - a.acs)
            
            let teamData = {
                "team_id" : team,
                "team_name": team === "red" ? rtname : (team === "blue" ? btname : "ATK"),
                "won_bool": base['teams'][team]['has_won'],
                "won": base['teams'][team]['has_won'] ? "WIN" : "LOSS",
                "bg_color": base['teams'][team]['has_won'] ? primaryColor : secondaryColor,
                "text_color": base['teams'][team]['has_won'] ? secondaryColor : primaryColor,
                "small_text_color": base['teams'][team]['has_won'] ? tertiaryColor : quadiaryColor,
                "rounds_won": base['teams'][team]['rounds_won'],
                "players": localPlayers
            };
            teams.push(teamData)
        }
        //I want all the data sorted by blue/red team instead of split into team/players
        //players.sort((a, b) => a.team.localeCompare(b.team) || b.acs - a.acs)
        //Now try and get the red and blue dicts from it and put it in the correct place
        selection.push(
            {
                "index" : item,
                "match_id": base['metadata']['match_id'], 
                "mapName" : map,
                "startTime" : startTime,
                "red_team": teams.find(team => team.team_id == 'red'),
                "blue_team": teams.find(team => team.team_id == 'blue')
            }
        )
    }

    let colors = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        tertiaryColor: tertiaryColor,
        quadiaryColor: quadiaryColor,
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

<!-- <div class="w-[1280px] h-[720px]"> -->
<div class="w-[1920px] h-[1080px]">  
    <Stats 
        playerData={selection[value]}
        colors = {colors}
    
    />
</div>
