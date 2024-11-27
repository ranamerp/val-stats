<script lang="ts">
    import StatsPlayer from "./StatsPlayer.svelte";
    import agents from "../stores/Agents";
    import maps from "../stores/Maps";
    import { globalFont } from "../stores/Fonts";
    export let playerData: App.LocalMatch;
    export let colors: App.ColorPreset;
    let blue_team = playerData.blue_team;
    let red_team = playerData.red_team;

    //New colors that will come in soon
    let leftbgcolor: string = colors.leftbgcolor
    let leftbigtextcolor: string = colors.leftbigtextcolor
    let leftsmalltextcolor: string = colors.leftsmalltextcolor
    let rightbgcolor: string = colors.rightbgcolor
    let rightbigtextcolor: string = colors.rightbigtextcolor
    let rightsmalltextcolor: string = colors.rightsmalltextcolor

    let mvpbannerbgcolor: string = colors.mvpbannerbgcolor
    let mvpbannertextcolor: string = colors.mvpbannerbgcolor
    let mvpagentcolor: string = colors.mvpagentcolor
    let mvptextcolor: string = colors.mvptextcolor
    let globaltextcolor: string = colors.globaltextcolor

    $: {
        leftbgcolor = colors.leftbgcolor
        leftbigtextcolor = colors.leftbigtextcolor
        leftsmalltextcolor = colors.leftsmalltextcolor

        rightbgcolor = colors.rightbgcolor
        rightbigtextcolor = colors.rightbigtextcolor
        rightsmalltextcolor = colors.rightsmalltextcolor

        mvpbannerbgcolor = colors.mvpbannerbgcolor
        mvpbannertextcolor = colors.mvpbannertextcolor
        mvpagentcolor = colors.mvpagentcolor
        mvptextcolor = colors.mvptextcolor
        globaltextcolor = colors.globaltextcolor
        
        blue_team = playerData.blue_team;
        red_team = playerData.red_team;
    }


    let mapData: {
        agentData: Record<string, App.ValorantAgent>;
        mapData: Record<string, App.ValorantMap>;
    } = {
        agentData: {},
        mapData: {}
    };

    
    agents.subscribe(value => { 
        mapData['agentData'] = value; 
    });

    maps.subscribe(value => { 
        mapData['mapData'] = value; 
    });

    
</script>


<!-- Have to find way to dynamically change width and height based on current screensize. All items need to stay at same proportions and take margin into account -->
<main>
    <!-- Overall Container -->
    <div class="flex flex-row w-full h-full">
        <!-- Left Side -->
        <div class="w-[42.7%] p-5 h-full flex flex-col flex-grow-0 flex-auto">
            <!-- Top Bar -->
            <div class='h-[14.5%] grid grid-cols-3' style="background-color: {leftbgcolor};">
                <div class="ml-8 my-5 items-center"> 
                    <!-- Need to make sure input here does not go past 5 characters -->
                    <div class='text-6xl' style="color: {leftbigtextcolor}">{blue_team.team_name.toUpperCase()} </div>
                    <div class='text-3xl' style="color: {leftsmalltextcolor}">{blue_team.won} </div> 
                </div> 
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width=170 height=170>
                </div>
                <div class={'text-8xl text-right m-3'} style="color: {leftbigtextcolor}"> {blue_team.rounds_won} </div>
            </div>
            <!-- MVP Section -->
            <div class="h-[30%] my-5 grid grid-cols-3 bg-black bg-opacity-45 overflow-hidden">
                <div class="flex flex-col flex-auto">
                    <div class='my-8 w-11/12 text-6xl text-center' style = "background-color: {mvpbannerbgcolor}; color: {mvpbannertextcolor}"> MVP </div>
                    <div class='mx-5 pt-12 text-2xl' style="color: {mvpagentcolor}">{blue_team.players[0].agent.toUpperCase().substring(0, 5)}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div class='mx-5 text-4xl' style="color: {mvptextcolor}">{blue_team.players[0].name.toUpperCase()}</div>
                </div>
                <div class="flex overflow-y-clip">
                    <!-- This might need some JS or some code to make it fit. Like as the height of the box changes, the X coord of the image needs to change. For now keeping it as is -->
                    <img class="object-contain scale-[4] z-0" style="object-position: 0% 245%" src={mapData.agentData[blue_team.players[0].agent].fullPortrait} alt="ur mom">
                </div>
                <div class="mx-4 text-5xl flex flex-col flex-auto">
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].kills}/{blue_team.players[0].deaths}</div>
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].acs}</div>
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].firstkills}</div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="h-[50%] overflow-hidden flex flex-row"> 
                <!-- Map Section -->
                <div class="relative w-[50%] flex overflow-hidden pr-3">
                    <img class="object-none" src={mapData.mapData[playerData.mapName].splash} alt={playerData.mapName}>
                    <p class="absolute inset-x-0 bottom-0 pb-5 text-center text-6xl"style="color: {globaltextcolor}"> {playerData.mapName} </p>
    
                </div>
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col min-w-[68%] w-[75%] gap-3">
                    {#each blue_team.players.slice(1) as player}
                        <StatsPlayer orientation="left" playerData={player} colorData={{bg: leftbgcolor, text: leftbigtextcolor, smalltext: leftsmalltextcolor}} agentData={mapData.agentData}/>
                    {/each}
                </div>
            </div>
        
        </div>

        <!-- Middle Side -->
        <div class = "w-[11.3%] mx-5 py-5 h-full flex flex-col flex-grow-0 flex-auto">
            <!-- Above div to push it down (and have logo) -->
             <!-- This needs to be fixed at some point, it's a small design detail I will work on later -->
            <div class="relative flex h-[14.75%] bg-yellow-200 overflow-hidden"> 
                <img class="object-contain" src="https://owcdn.net/img/63067806d167d.png" alt="vct" width=170 height="100">
            </div>
            <div class="h-full bg-black bg-opacity-45 overflow-hidden w-full mt-5 text-center">
                <div class= "h-[35%] text-3xl mt-2 mb-5 flex flex-col flex-auto">
                    <div class="my-6" style="color: {globaltextcolor}"> K/D </div>
                    <div class="my-6" style="color: {globaltextcolor}"> ACS </div>
                    <div class="my-6" style="color: {globaltextcolor}"> First Kills </div>
                </div>
                
                <div class="flex flex-col flex-auto gap-2">
                    {#each blue_team.players.slice(1) as player}
                        <div class= "my-[4.3%]">
                            <div class = "align-text-bottom content-center grid gap-y-4">
                                <div class ="text-center text-2xl mb-[4.4%]" style="color: {globaltextcolor}"> K/D </div>
                                <div class = "text-center text-2xl" style="color: {globaltextcolor}"> ACS </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Right Side -->
        <div class="w-[42.7%] p-5 h-full flex flex-col flex-grow-0 flex-auto">
            <!-- Top Bar -->
            <div class='h-[14.5%] grid grid-cols-3' style="background-color: {rightbgcolor};">
                <div class='text-8xl text-left m-3' style="color: {rightbigtextcolor}"> {red_team.rounds_won} </div>
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width=170 height=170>
                </div>
                <div class="mr-8 my-5 items-center justify-items-end"> 
                    <!-- Need to make sure input here does not go past 5 characters -->
                    <div class='text-6xl text-right' style="color: {rightbigtextcolor}">{red_team.team_name.toUpperCase().substring(0, 5)} </div>
                    <div class='text-3xl text-right' style="color: {rightsmalltextcolor}">{red_team.won} </div> 
                </div> 
            </div>
            <!-- MVP Section -->
            <div class="h-[30%] my-5 grid grid-cols-3 bg-black bg-opacity-45 overflow-hidden">
                <div class="mx-4 text-5xl flex flex-col flex-auto">
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].kills}/{red_team.players[0].deaths}</div>
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].acs}</div>
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].firstkills}</div>
                </div>
                <div class="flex overflow-y-clip">
                    <!-- This might need some JS or some code to make it fit. Like as the height of the box changes, the X coord of the image needs to change. For now keeping it as is -->
                    <img class="object-contain scale-[4] scale-x-[-4] z-0" style="object-position: 0% 245%" src={mapData.agentData[red_team.players[0].agent].fullPortrait} alt="ur mom">
                </div>
                <div class="flex flex-col flex-auto justify items-end">
                    <div class='my-8 w-11/12 text-6xl text-center' style = "background-color: {mvpbannerbgcolor}; color: {mvpbannertextcolor}"> MVP </div>
                    <div class='mx-5 pt-12 text-2xl text-right' style="color: {mvpagentcolor}">{red_team.players[0].agent.toUpperCase()}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div class='mx-5 text-4xl text-right' style="color: {mvptextcolor}">{red_team.players[0].name.toUpperCase()}</div>
                </div>


            </div>
            
            <!-- Bottom Section -->
            <div class="h-[50%] overflow-hidden flex flex-row"> 
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col min-w-[68%] w-[75%] gap-3">
                    {#each red_team.players.slice(1) as player}
                        <StatsPlayer orientation="right" playerData={player} colorData={{bg: rightbgcolor, text: rightbigtextcolor, smalltext: rightsmalltextcolor}} agentData={mapData.agentData}/>
                    {/each}
                </div>

                <!-- Map Section -->
                <div class="relative w-[50%] ml-3 justify items-end" style="background-color: {rightbgcolor};">
                    <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width=170 height=170>
                </div>

            </div>
        
        </div>
        
    </div>


</main>

<!-- <style>
    *{
        font-family: '`{globalFont.family}`, sans-serif';
    }
</style> -->