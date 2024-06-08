<script>

    import StatsPlayer from "./StatsPlayer.svelte";
    export let playerData;
    let primaryColor = "#0196bb";
    let secondaryColor = "#2a2c30";
    let tertiaryColor = "#e9d98d";
    let quadiaryColor = "#ffffff";
    let btname = "SEN";
    let rtname = "100T";
    let blue_team = {
        players: [],
        name: btname

    }
    let red_team = {
        players: [],
        name: rtname
    }
    console.log(playerData)
    playerData.teams.forEach(team =>{
        console.log(team)
        if (team.team_name == "blue") {
            blue_team.rounds_won = team.rounds_won
            if (team.won_bool) {
                blue_team.won = "WIN"
                blue_team.bg_color = primaryColor
                blue_team.text_color = secondaryColor
                blue_team.small_text_color = tertiaryColor
            } else {
                blue_team.won = "LOSS"
                blue_team.bg_color = secondaryColor
                blue_team.text_color = primaryColor
                blue_team.small_text_color = quadiaryColor
            }
        } else if (team.team_name == "red") {
            red_team.rounds_won = team.rounds_won
            if (team.won_bool) {
                red_team.won = "WIN"
                red_team.bg_color = primaryColor
                red_team.text_color = secondaryColor
                red_team.small_text_color = tertiaryColor
            } else {
                red_team.won = "LOSS"
                red_team.bg_color = secondaryColor
                red_team.text_color = primaryColor
                red_team.small_text_color = quadiaryColor
            }
        }
    })
    playerData.players.forEach(player => {
        if (player.team == "Blue") {
            blue_team['players'].push(player)
        } else if (player.team == "Red") {
            red_team['players'].push(player)
        }
    });
    console.log(blue_team)

    
    // let playerData = {
    //     primaryColor: "#0196bb",
    //     secondaryColor: "#2a2c30",
    //     tertiaryColor: "#ffffff"
    // }
</script>

<main>
    <!-- Overall Container -->
    <div class="flex flex-row w-[1920px] h-[1080px]">
        <!-- Left Side -->
        <div class="pl-5 py-5 w-[820px] h-screen grid grid-cols-2 gap-2">
            <!-- Top Bar -->
            <div class='col-span-2 grid grid-cols-3 w-[796px] h-[157px]' style="background-color: {blue_team.bg_color};">
                <div class="ml-8 my-5 items-center"> 
                    <!-- Need to make sure input here does not go past 5 characters -->
                    <div class='text-7xl' style="color: {blue_team.text_color}">{blue_team.name} </div>
                    <div class='text-4xl' style="color: {quadiaryColor}">{blue_team.won} </div> 
                </div> 
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width="150" height="150">
                </div>
                <div class={'text-9xl text-right m-3'} style="color: {blue_team.text_color}"> {blue_team.rounds_won} </div>
            </div>
            <!-- MVP Section -->
            <div class="col-span-2 grid grid-cols-3 bg-black bg-opacity-5 w-[796px] h-[320px] overflow-hidden">
                <div class="flex flex-col flex-auto">
                    <div class='my-8 w-11/12 text-6xl text-center' style = "background-color: {tertiaryColor}; color: {quadiaryColor}"> MVP </div>
                    <div class='mx-5 pt-9 text-3xl' style="color: {secondaryColor}">{blue_team.players[0].agent.toUpperCase()}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div class='mx-5 text-6xl' style="color: {primaryColor}">{blue_team.players[0].name.toUpperCase()}</div>
                </div>
                <div class="flex overflow-y-clip">
                    <img class="object-contain scale-[4]" style="object-position: 50% 115%" src="https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png" alt="ur mom">
                </div>
                <div class="mx-4 text-5xl flex flex-col flex-auto">
                    <div class="my-5 text-right" style="color: {tertiaryColor}">{blue_team.players[0].kills}/{blue_team.players[0].deaths}</div>
                    <div class="my-5 text-right" style="color: {tertiaryColor}">{blue_team.players[0].acs}</div>
                    <div class="my-5 text-right" style="color: {tertiaryColor}">{blue_team.players[0].firstkills}</div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="w-[796px] h-[497px] flex flex-row"> 
                <!-- Map Section -->
                <div class="relative flex overflow-hidden w-[298px] h-[497px]">
                    <img class="object-none" src="https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png" alt="ur mom">
                    <p class="absolute inset-x-0 bottom-0 pb-5 text-center text-6xl"style="color: {tertiaryColor}"> {playerData.mapName} </p>
    
                </div>
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col  w-[485px] h-[497px] pl-[12px]">
                    {#each blue_team.players.slice(1) as player}
                        <StatsPlayer orientation="left" playerData={player} colorData={{bg: blue_team.bg_color, text: blue_team.text_color, smalltext: blue_team.small_text_color}}/>
                    {/each}
                </div>
            </div>
        
        </div>
        
        <!-- Middle -->
        <div class = "m-5">
            <!-- Above div to push it down (and have logo) -->
            <div class="h-[182px]"></div>
            <div class=" bg-black bg-opacity-5 w-[212px] h-[842px] text-center">
                <div class= "h-[320px]">
                    <div> K/D </div>
                    <div> ACS </div>
                    <div> First Kills </div>
                </div>

                <div class= "h-[114px] mb-[13.5px]">
                    <div class = "align-text-bottom content-center grid">
                        <div class ="text-center"> K/D </div>
                        <div class = "text-center"> ACS </div>
                    </div>
                </div>

                <div class= "h-[114px] mb-[13.5px]">
                    <div class = "align-text-bottom content-center grid">
                        <div class ="text-center"> K/D </div>
                        <div class = "text-center"> ACS </div>
                    </div>
                </div>
                <div class= "h-[114px] mb-[13.5px]">
                    <div class = "align-text-bottom content-center grid">
                        <div class="text-center"> K/D </div>
                        <div class= "text-center"> ACS </div>
                    </div>
                </div>
                <div class= "h-[114px] mb-[13.5px]">
                    <div class = "align-text-bottom content-center grid">
                        <div class ="text-center"> K/D </div>
                        <div class = "text-center"> ACS </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side (Eventually just left but mirrored) -->
        <div class="pr-5 py-5 w-[820px] h-screen grid grid-cols-2 gap-2">
            <!-- Top Bar -->
            <div class="col-span-2 grid grid-cols-3 w-[796px] h-[157px]" style="background-color: {red_team.bg_color};">
                <div class="text-9xl text-left m-3" style="color: {red_team.text_color}"> {red_team.rounds_won} </div>
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width="150" height="150">
                </div>
                <div class="mr-8 my-5 items-center justify-items-end"> 
                    <!-- Need to make sure input here does not go past 5 characters -->
                    <div class="text-7xl text-right" style="color: {red_team.text_color}">{red_team.name} </div>
                    <div class="text-4xl text-right" style="color: {quadiaryColor}">{red_team.won} </div> 
                </div> 
            </div>
            <!-- MVP Section -->
            <div class="col-span-2 grid grid-cols-3 bg-black bg-opacity-5 w-[796px] h-[320px] overflow-hidden">
                <div class="mx-4 text-5xl flex flex-col flex-auto">
                    <div class="my-5 text-left" style="color: {tertiaryColor}">{red_team.players[0].kills}/{red_team.players[0].deaths}</div>
                    <div class="my-5 text-left" style="color: {tertiaryColor}">{red_team.players[0].acs}</div>
                    <div class="my-5 text-left" style="color: {tertiaryColor}">{red_team.players[0].firstkills}</div>
                </div>
                <div class="flex overflow-y-clip">
                    <img class="object-contain scale-[4]" style="object-position: 50% 115%" src="https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png" alt="ur mom">
                </div>
                <div class="flex justify items-end flex-col flex-auto">
                    <div class='my-8 w-11/12 text-6xl text-center' style = "background-color: {tertiaryColor}; color: {quadiaryColor}"> MVP </div>
                    <div class='mx-5 pt-9 text-3xl' style="color: {secondaryColor}">{red_team.players[0].agent.toUpperCase()}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div class='mx-5 text-6xl' style="color: {primaryColor}">{red_team.players[0].name.toUpperCase()}</div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="w-[796px] h-[497px] flex flex-row"> 
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col  w-[485px] h-[497px] pr-[12px]">
                    {#each red_team.players.slice(1) as player}
                        <StatsPlayer orientation="right" playerData={player}  colorData={{bg: red_team.bg_color, text: red_team.text_color, smalltext: red_team.small_text_color}}/>
                    {/each}
                </div>
                <!-- Map Section -->
                <div class="ml-5 relative flex overflow-hidden w-[298px] h-[497px]" style="background-color: {red_team.bg_color}">
                    
    
                </div>
            </div>
        
        </div>

    </div>

</main>