<script lang="ts">

    import Stats from "../components/Stats.svelte";
    import LoadingPopup from "../components/LoadingPopup.svelte";
    import { selectedmatch } from "../stores/SelectedMatch";
    import { presets } from "../stores/Presets";
    import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';


    export let data;
    const { stats } = data;
    let player = data.player.split('#')[0]
    let value = 0;
    //These parts need to eventually be chosen by user via dropdown

    let btname = "SEN";
    let rtname = "100T";
    let searchTerm = data.player;

    //For now this will work, but I think adding more options (like left background, small text, etc) may be a good advanced paid option
    let showPopup = false;
    let popupMessage = "";

    let preset = 'Champs 24'

    let presetColors = $presets[preset];

    let colors = {
        primaryColor: presetColors.primaryColor ?? "#0da68c",
        secondaryColor: presetColors.secondaryColor ?? "#eff6f9",
        tertiaryColor: presetColors.tertiaryColor ?? "#e9d98d",
        quadiaryColor: presetColors.quadiaryColor ?? "#000000"
    }


    $: if (presetColors) {
        colors.primaryColor = presetColors.primaryColor;
        colors.secondaryColor = presetColors.secondaryColor;
        colors.tertiaryColor = presetColors.tertiaryColor;
        colors.quadiaryColor = presetColors.quadiaryColor;
    }
    

    async function searchPlayers() {
        let terms = searchTerm.split("#");


        showPopup = true;
        popupMessage = `"Loading player data for ${searchTerm}"`

        try{
            const response = await fetch(`/api/match?region=${'na'}&name=${terms[0]}&tag=${terms[1]}`);
            const matchData = await response.json();
            processMatch(matchData.data).then(result => {
                selection = result
                value = 0;
                player = terms[0];
            })
            //Need to find this type later, for now any should be fine
        } catch (err: any) {
            console.log("ERROR!")
            console.log(err.message);
        } finally {
            showPopup = false;
        }
    }

    function outputMatch(currentmatch, colors) {
        selectedmatch.set({
            match: currentmatch,
            colors: colors
    })
        //once set, need to redirect
        goto('/output')

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
                        'firstkills': (firstkills[player['puuid']] === undefined ) ? 0 : firstkills[player['puuid']]
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
                    "bg_color": base['teams'][team]['has_won'] ? colors.primaryColor : colors.secondaryColor,
                    "text_color": base['teams'][team]['has_won'] ? colors.secondaryColor : colors.primaryColor,
                    "small_text_color": base['teams'][team]['has_won'] ? colors.tertiaryColor : colors.quadiaryColor,
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

    function matchHandler(selectedMatch) {
        // All of these are just immediate object property assignments
        const { red_team, blue_team } = selectedMatch;
        const winningTeam = red_team.won_bool ? red_team : blue_team;
        const losingTeam = red_team.won_bool ? blue_team : red_team;
        
        // These updates happen immediately
        winningTeam.bg_color = colors.primaryColor;
        winningTeam.text_color = colors.secondaryColor;
        winningTeam.small_text_color = colors.tertiaryColor;
        
        losingTeam.bg_color = colors.secondaryColor;
        losingTeam.text_color = colors.primaryColor;
        losingTeam.small_text_color = colors.quadiaryColor;
    }

    async function savePreset() {
        // This code should do the following:
        // Check that the store doesn't exist already
        // Take the current colors and put it in the store
        // Show a popup that lets you write the name of the preset
        console.log(colors);
        

    }
    
    let selection = [];
    $: customGames = selection?.filter(item => 
        stats[item.index]?.metadata?.mode === "Custom Game"
    ) ?? [];

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



    // Set default value when customGames changes
    $: if (customGames.length > 0 && !value) {
        value = customGames[0].index;
        matchHandler(customGames[0]);
    }
    



</script>
{#if isLoading}
   <p> Loading...</p>
{:else}
    <LoadingPopup {showPopup} message= {popupMessage} />
    <div class="flex flex-row space-x-8">
        <!-- Match Selection -->
        <div>
            <h1> Choose a match :</h1>
            
            <select
            class="py-3 px-4 pe-9 block w-full border-gray-200 
            rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:pointer-events-none" 
            bind:value={value}
            on:change={(event) => matchHandler(selection[event.target.selectedIndex])}
            >
            {#each customGames as item}
                <option value={item.index}>
                    {item.mapName} ({item.startTime})
                </option>
            {/each}
            </select>
        </div>
        
        <!-- Team Selection -->
        <div class="flex flex-row">
            <!-- Team A -->
             <div class="px-8">
                <!-- Edit Players Name -->
                <div>
                    <label for="blue_team" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Left Team</label>
                    <input type="text" bind:value={btname} on:input={() => {
                        selection[value].blue_team.team_name = btname.substring(0,5);
                    }} id="blue_team" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                </div>
                <!-- Change Logo -->
                <div>

                </div>
             </div>

            <!-- Team B -->
             <div>
                <div>
                    <label for="red_team" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Right Team</label>
                    <input type="text" bind:value={rtname} on:input={() => {
                        selection[value].red_team.team_name = rtname.substring(0,5);
                    }} id="red_team" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                </div>
                
             </div>
        </div>

        <!-- Current Player -->
        <div class="p-5"> 
            Current Player: {player}
        </div>

        <!-- Search Bar -->
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

        <!-- Add Match Reload Button -->
         <div>
            <button type="submit" on:click={searchPlayers} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Reload Matches</button>
         </div>
         
    </div>

    <br>
    

    <!-- <div class="w-[1280px] h-[720px]"> -->
    <div class="flex flex-row">
        <!-- Colors -->
        <div class="bg-slate-600 flex flex-col">
            <!-- We can make this custom, refer to doc for creating custom components. -->
            <ColorPicker
                on:input={(event) => {
                    //currently when I click this, the previous value is the one that gets sent. This means that we aren't reactive enough
                    // need to change this
                    colors.primaryColor = event.detail.hex;
                }}
                label = "Primary"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.primaryColor}
                --cp-bg-color="{colors.primaryColor}"
                --cp-text-color="black"
                --picker-indicator-size="10px"
                --input-size="25px"
    
            />
    
            <ColorPicker
            on:input={(event) => {
                // Need to figure out a way to update our team colors whenever this is selected
                colors.secondaryColor = event.detail.hex;
            }}
            label = "Secondary"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.secondaryColor}
    
            />
    
            <ColorPicker
            on:input={(event) => {
                // Need to figure out a way to update our team colors whenever this is selected
                colors.tertiaryColor = event.detail.hex;
            }}
            label = "Tertiary"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.tertiaryColor}
    
            />
    
            <ColorPicker
            on:input={(event) => {
                // Need to figure out a way to update our team colors whenever this is selected
                colors.quadiaryColor = event.detail.hex;
            }}
            label = "Quadiary"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.quadiaryColor}
    
            />
        </div>
        
        <!-- Stats -->
         <div class="flex flex-col">
             <div class="w-[1920px] h-[1080px]">
                 <Stats 
                     playerData={selection[value]}
                     colors = {colors}
                 />
             </div>

             <div class="flex justify-center items-center"> 
                <!-- This will be where we send users to the page that they can pull their image.  -->
                <!-- For now start with just an output page but then eventually need to do user auth. -->
                <button type="submit" on:click={outputMatch(selection[value], colors)} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Export to Page</button>
                
            </div>

         </div>

        <!-- Other Dropdowns -->
        <div class="bg-slate-600 flex flex-col gap-y-5">
            <select
            class="py-3 px-4 pe-9 block w-full border-gray-200 
            rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:pointer-events-none"
            bind:value={preset} 
            on:change={(event) => {
                if (event.target.value && $presets[event.target.value]) {
                    presetColors = $presets[event.target.value];
                }
                if (event.target.value === "preset") {savePreset()}
            }}
            >
                <option value="" disabled selected> Color Presets </option>
                <!-- Save up to 3 presets unpaid -->
                <option value="preset"> Save a Preset </option>

                <option value="Champs 24"> VCT Champions 2024 </option>
                <option value="Masters"> VCT Masters </option>
                <option value="VCL NA"> Challengers NA </option>
                <option value="Red Bull"> Red Bull Home Ground </option>
                <option value="SEN"> Sentinels </option>
            </select>

            <select
            class="py-3 px-4 pe-9 block w-full border-gray-200 
            rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:pointer-events-none" 
            on:change={(event) => {
            }}
            >
            <!-- This should be a search bar that lets you search for fonts (much like realtimecolors.com does) -->
            <!-- Paid option lets you add local fonts, otherwise it's google -->
            <option> Fonts </option>
            </select>
        </div>

    </div>
{/if}