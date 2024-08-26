<script>

    import Stats from "../../components/Stats.svelte";
    import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
    //import { getMatchData } from '../../lib/match.js'
    import { onMount } from 'svelte'

    export let data;
    const { stats } = data;
    let value = 0;
    //These parts need to eventually be chosen by user via dropdown
    let primaryColor = "#0da68c";
    let secondaryColor = "#eff6f9";
    let tertiaryColor = "#e9d98d";
    let quadiaryColor = "#000000";
    let btname = "SEN";
    let rtname = "100T";
    let searchTerm = "";
    //let hex = "#f6f0dc"
    let colors = {
        primaryColor,
        secondaryColor,
        tertiaryColor,
        quadiaryColor,
    }

    async function searchPlayers() {
        let terms = searchTerm.split("#");
        
        try{
            //matchData = await getMatchData('na', terms[0], terms[1]);
            const response = await fetch(`/api/match?region=${'na'}&name=${terms[0]}&tag=${terms[1]}`);
            const matchData = await response.json();
            console.log(matchData.data);
            processMatch(matchData.data).then(result => {
                selection = result
                value = 0;
            })
        } catch (err) {
            console.log(err.message);
        }
    }

    async function processMatch(stats) {
        let selection = []
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
                    "match_id": base['metadata']['matchid'], 
                    "mapName" : map,
                    "startTime" : startTime,
                    "red_team": teams.find(team => team.team_id == 'red'),
                    "blue_team": teams.find(team => team.team_id == 'blue')
                }
            )
        }
        return selection;
    }
    
    let selection = [];
    let isLoading = true;
    onMount(async () => {
        selection = await processMatch(stats);
        isLoading = false;
    });
    
    $: if (!isLoading && stats) {
        processMatch(stats).then(result => {
            selection = result;
            

        });
    }
    
 



</script>
{#if isLoading}
    <p>Loading...</p>
{:else}
    <div class="flex flex-row">
        <div>
            <h1> Choose a match :</h1>
            
            <select
            class="py-3 px-4 pe-9 block w-full border-gray-200 
            rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:pointer-events-none" 
            bind:value={value}
            on:change={(event) => {
                console.log(event)
                console.log(primaryColor)
                console.log(colors.primaryColor)
                console.log()
                if (selection[event.target.selectedIndex].red_team.won_bool) {
                    selection[event.target.selectedIndex].red_team.bg_color = colors.primaryColor;
                    selection[event.target.selectedIndex].red_team.text_color = colors.secondaryColor;
                    selection[event.target.selectedIndex].red_team.small_text_color = colors.tertiaryColor;
                    
                    selection[event.target.selectedIndex].blue_team.bg_color = colors.secondaryColor;
                    selection[event.target.selectedIndex].blue_team.text_color = colors.primaryColor;
                    selection[event.target.selectedIndex].blue_team.small_text_color = colors.quadiaryColor;
                } else if (selection[event.target.selectedIndex].blue_team.won_bool) {
                    selection[event.target.selectedIndex].blue_team.bg_color = colors.primaryColor;
                    selection[event.target.selectedIndex].blue_team.text_color = colors.secondaryColor;
                    selection[event.target.selectedIndex].blue_team.small_text_color = colors.tertiaryColor;
                    
                    selection[event.target.selectedIndex].red_team.bg_color = colors.secondaryColor;
                    selection[event.target.selectedIndex].red_team.text_color = colors.primaryColor;
                    selection[event.target.selectedIndex].red_team.small_text_color = colors.quadiaryColor;
                };
            }}
            >
            {#if selection && selection.length > 0}
                {#each selection as item}
                    {#if stats[item.index]['metadata']['mode'] == "Custom Game"}
                        <option value = {item.index}>"{item.mapName} ({item.startTime})"</option>
                    {/if}
                {/each}
            {/if}
            </select>
        </div>
        
        <div>
        <ColorPicker
            on:input={(event) => {
                // Need to figure out a way to update our team colors whenever this is selected
                colors.primaryColor = event.detail.hex;
                if (selection[value].red_team.won_bool) {
                    selection[value].red_team.bg_color = event.detail.hex;
                    selection[value].blue_team.text_color = event.detail.hex;
                } else if (selection[value].blue_team.won_bool) {
                    selection[value].blue_team.bg_color = event.detail.hex;
                    selection[value].red_team.text_color = event.detail.hex;
                };
            }}
            label = "Primary"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {primaryColor}

        />

        <ColorPicker
        on:input={(event) => {
            // Need to figure out a way to update our team colors whenever this is selected
            colors.secondaryColor = event.detail.hex;
            if (selection[value].red_team.won_bool) {
                selection[value].red_team.text_color = event.detail.hex;
                selection[value].blue_team.bg_color = event.detail.hex;
            } else if (selection[value].blue_team.won_bool) {
                selection[value].blue_team.text_color = event.detail.hex;
                selection[value].red_team.bg_color = event.detail.hex;
            };
        }}
        label = "Secondary"
        components={ChromeVariant} 
        sliderDirection="horizontal"
        hex = {secondaryColor}

        />

        <ColorPicker
        on:input={(event) => {
            // Need to figure out a way to update our team colors whenever this is selected
            colors.tertiaryColor = event.detail.hex;
            if (selection[value].red_team.won_bool) {
                selection[value].red_team.small_text_color = event.detail.hex;
            } else if (selection[value].blue_team.won_bool) {
                selection[value].blue_team.small_text_color = event.detail.hex;
            };
        }}
        label = "Tertiary"
        components={ChromeVariant} 
        sliderDirection="horizontal"
        hex = {tertiaryColor}

        />

        <ColorPicker
        on:input={(event) => {
            // Need to figure out a way to update our team colors whenever this is selected
            colors.quadiaryColor = event.detail.hex;
            if (!selection[value].red_team.won_bool) {
                selection[value].red_team.small_text_color = event.detail.hex;
            } else if (!selection[value].blue_team.won_bool) {
                selection[value].blue_team.small_text_color = event.detail.hex;
            };
        }}
        label = "Quadiary"
        components={ChromeVariant} 
        sliderDirection="horizontal"
        hex = {quadiaryColor}

        />
        </div>

        <div class="flex flex-row">
            <!-- Team A -->
             <div class="px-8">
                <!-- Edit Players Name -->
                <div>
                    <label for="blue_team" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Left Team</label>
                    <input type="text" bind:value={btname} id="blue_team" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                </div>
                <!-- Change Logo -->
                <div>

                </div>
             </div>

            <!-- Team B -->
             <div>
                <div>
                    <label for="red_team" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Right Team</label>
                    <input type="text" bind:value={rtname} id="red_team" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                </div>
                
             </div>
        </div>

        <form
        class="w-1/4 mx-auto"
        >   
            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <!-- This is the search icon -->
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search"  bind:value={searchTerm} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Players..." required />
                <button on:click={searchPlayers} type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
        </form>

    </div>

    <br>
    <!-- Get data from selection[value] and place here, then start using it to style.  -->

    <!-- <div class="w-[1280px] h-[720px]"> -->
    <div class="w-[1920px] h-[1080px]">
        <Stats 
            playerData={selection[value]}
            colors = {colors}
        />
    </div>
{/if}