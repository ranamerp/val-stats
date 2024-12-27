<script lang="ts">
    import StatsPlayer from "./StatsPlayer.svelte";
    import agents from "../stores/Agents";
    import maps from "../stores/Maps";
    import { globalFont } from "../stores/Fonts";
    import { onMount } from "svelte";
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

    let blue_canvas: HTMLCanvasElement | null = null;
    let red_canvas: HTMLCanvasElement | null = null;
    let blue_div: HTMLDivElement | null = null;
    let red_div: HTMLDivElement | null = null;

    let div_height = 0;
    let stats_height = 0;
    

    async function cropImage(imageUrl: string, cropWidth: number, cropHeight: number, flip: boolean = false): Promise<HTMLCanvasElement | null> {
        const image = new Image();
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        image.crossOrigin = "anonymous"; // Enable CORS handling

        return new Promise((resolve, reject) => {
            image.onload = () => {
                if (!canvas) {
                    console.error("Canvas element not found");
                    reject(null);
                    return;
                }

                const context = canvas.getContext('2d');
                if (!context) {
                    console.error("Canvas context could not be initialized");
                    reject(null);
                    return;
                }

                // Set the canvas dimensions
                canvas.width = cropWidth + 400;
                canvas.height = cropHeight;

                image.width = cropWidth;
                image.height = cropHeight;

                cropWidth = cropWidth
                cropHeight = cropHeight

                // Apply horizontal flip if needed
                if (flip) {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(image, 400, 200, cropWidth + 840, cropHeight + 300, cropWidth / 4, 0, cropWidth + 300, cropHeight);
                } else {
                    context.drawImage(image, 400, 200, cropWidth + 840, cropHeight + 300, cropWidth / 4, 0, cropWidth + 300, cropHeight);
                }

                // Draw the cropped portion of the image onto the canvas
                //context.drawImage(image, 0, cropHeight, image.width, canvas.height, 0, 0, image.width, canvas.height);
                resolve(canvas);
            };

            image.onerror = () => {
                console.error("Failed to load image");
                reject(null);
            };

            // Load the image
            image.src = imageUrl;
        });
    }

    async function updateCanvas(canvasElement: HTMLCanvasElement | null, imageUrl: string, cropWidth: number, cropHeight: number, flip: boolean = false) {
        const croppedCanvas = await cropImage(imageUrl, cropWidth, cropHeight, flip);
        if (canvasElement && croppedCanvas) {
            const context = canvasElement.getContext('2d');
            if (context) {
                canvasElement.width = croppedCanvas.width;
                canvasElement.height = croppedCanvas.height;
                context.drawImage(croppedCanvas, 0, 0);
            }
        }
    }

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

        if (blue_div) {
            const blueDivRect = blue_div.getBoundingClientRect();
            updateCanvas(blue_canvas, mapData.agentData[blue_team.players[0].agent].fullPortrait, blueDivRect.width, blueDivRect.height);
            div_height = blueDivRect.height;
        }
        if (red_div) {
            const redDivRect = red_div.getBoundingClientRect();
            updateCanvas(red_canvas, mapData.agentData[red_team.players[0].agent].fullPortrait, redDivRect.width, redDivRect.height, true); // Flip the red canvas
        }
        //console.log(statsHeight);
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

        
    onMount(async () => {
        if (blue_div) {
            const blueDivRect = blue_div.getBoundingClientRect();
            await updateCanvas(blue_canvas, mapData.agentData[blue_team.players[0].agent].fullPortrait, blueDivRect.width, blueDivRect.height);
            div_height = blueDivRect.height;
        }
        if (red_div) {
            const redDivRect = red_div.getBoundingClientRect();
            await updateCanvas(red_canvas, mapData.agentData[red_team.players[0].agent].fullPortrait, redDivRect.width, redDivRect.height, true); // Flip the red canvas
        }
    });
</script>


<!-- Have to find way to dynamically change width and height based on current screensize. All items need to stay at same proportions and take margin into account -->
<main>
    <!-- Overall Container -->
    <div class="flex flex-row w-full h-full">
        <!-- Left Side -->
        <div class="w-[42.7%] p-5 flex flex-col flex-grow">
            <!-- Top Bar -->
            <div class='h-[19.5%] grid grid-cols-3' style="background-color: {leftbgcolor};">
                <div class="ml-8 my-5 items-center"> 
                    <!-- Need to make sure input here does not go past 5 characters -->
                    <div class='text-7xl' style="color: {leftbigtextcolor}">{blue_team.team_name.toUpperCase()} </div>
                    <div class='text-4xl' style="color: {leftsmalltextcolor}">{blue_team.won} </div> 
                </div> 
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://i.postimg.cc/rFcBLJsY/1280px-HD-transparent-picture.png" alt="ur mom">
                </div>
                <div class={'text-9xl text-right m-3'} style="color: {leftbigtextcolor}"> {blue_team.rounds_won} </div>
            </div>
            <!-- MVP Section -->
            <div class="h-[30%] my-5 grid grid-cols-3 bg-black bg-opacity-45 relative" bind:this={blue_div}>
                <!-- Text Divs -->
                <div class="flex flex-col flex-auto z-10">
                    <div class='my-8 w-11/12 text-6xl text-center' style="background-color: {mvpbannerbgcolor}; color: {mvpbannertextcolor}"> MVP </div>
                    <div class="flex-auto"></div>
                    <div class='mx-5 pt-12 text-3xl' style="color: {mvpagentcolor}">{blue_team.players[0].agent.toUpperCase().substring(0, 5)}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div 
                        class='mx-5 mb-5 text-4xl overflow-hidden whitespace-nowrap'
                        style="
                            color: {mvptextcolor};
                            max-width: 300px; 
                            transform: {blue_team.players[0].name.length > 15 ? 'scale(0.8)' : 'scale(1)'};
                            transition: transform 0.3s ease;
                        "
                    >
                        {blue_team.players[0].name.toUpperCase()}
                    </div>
                </div>
                <!-- Blank Div to push the stats div to the right -->
                <div class="flex-auto"></div>

                <!-- Canvas Div -->
                <div class="absolute inset-0">
                    <canvas class="w-full h-full" style="object-position: 0%;" bind:this={blue_canvas}></canvas>
                </div>
                
                <!-- Stats Div -->
                 <!-- I think there is a better way to space out the numbers. Going to keep as is for now -->
                <div class="mx-4 text-5xl flex flex-col flex-auto z-10">
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].kills}/{blue_team.players[0].deaths}</div>
                    <div class="flex-auto"></div>
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].acs}</div>
                    <div class="flex-auto"></div>
                    <div class="my-5 text-right" style="color: {globaltextcolor}">{blue_team.players[0].firstkills}</div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="flex flex-row flex-grow"> 
                <!-- Map Section -->
                <div class="relative w-[50%] flex overflow-hidden pr-3">
                    <img class="object-none" src={mapData.mapData[playerData.mapName].splash} alt={playerData.mapName}>
                    <p class="absolute inset-x-0 bottom-0 pb-5 text-center text-6xl"style="color: {globaltextcolor}"> {playerData.mapName} </p>
    
                </div>
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col min-w-[68%] w-[75%] gap-3" bind:clientHeight={stats_height}>
                    {#each blue_team.players.slice(1) as player}
                        <StatsPlayer orientation="left" playerData={player} colorData={{bg: leftbgcolor, text: leftbigtextcolor, smalltext: leftsmalltextcolor}} agentData={mapData.agentData}/>
                    {/each}
                </div>
            </div>
        
        </div>

        <!-- Middle Side -->
        <div class = "w-[11.3%] p-5 flex flex-col flex-grow">
            <!-- Top Image -->
            <div class="h-[19.5%] overflow-hidden"> 
                <img src="https://i.postimg.cc/rFcBLJsY/1280px-HD-transparent-picture.png" alt="vct" class="w-full h-full object-contain">
            </div>

            <!--  -->
            <div class="flex flex-col flex-auto bg-black bg-opacity-45 overflow-hidden w-full mt-5 gap-5 text-center">
                <div class= "text-3xl flex flex-col flex-auto" style="height: {div_height}px; max-height: {div_height}px; min-height: {div_height}px;">
                    <div class="my-7" style="color: {globaltextcolor}"> K/D </div>
                    <div class="flex-auto"></div>
                    <div class="my-7" style="color: {globaltextcolor}"> ACS </div>
                    <div class="flex-auto"></div>
                    <div class="my-7" style="color: {globaltextcolor}"> First Kills </div>
                </div>
                
                
                <div class="flex flex-col gap-3">
                    {#each blue_team.players.slice(1) as player}
                    <div class= "">
                            <div class="flex flex-col items-center gap-y-5">
                                <div class = "text-center text-2xl" style="color: {globaltextcolor}"> K/D </div>
                                <div class = "text-center text-2xl" style="color: {globaltextcolor}"> ACS </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Right Side -->
        <div class="w-[42.7%] p-5 flex flex-col flex-grow">
            <!-- Top Bar -->
            <div class='h-[19.5%] grid grid-cols-3' style="background-color: {rightbgcolor};">
                <div class='text-9xl text-left m-3' style="color: {rightbigtextcolor}"> {red_team.rounds_won} </div>
                <div class="flex justify-center items-center opacity-20">
                    <img src="https://i.postimg.cc/rFcBLJsY/1280px-HD-transparent-picture.png" alt="ur mom">
                </div>
                <div class="mr-8 my-5 items-center justify-items-end"> 
                    <div class='text-7xl text-right' style="color: {rightbigtextcolor}">{red_team.team_name.toUpperCase().substring(0, 5)} </div>
                    <div class='text-4xl text-right' style="color: {rightsmalltextcolor}">{red_team.won} </div> 
                </div> 
            </div>
            <!-- MVP Section -->
            <div class="h-[30%] max-h-[30%] my-5 grid grid-cols-3 bg-black bg-opacity-45 relative" bind:this={red_div}>
                <!-- Stats Div -->
                <div class="mx-4 text-5xl flex flex-col flex-auto z-10">
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].kills}/{red_team.players[0].deaths}</div>
                    <div class="flex-auto"></div>
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].acs}</div>
                    <div class="flex-auto"></div>
                    <div class="my-5 text-left" style="color: {globaltextcolor}">{red_team.players[0].firstkills}</div>
                </div>
                
                <!-- Blank Div to push the stats div to the left -->
                <div class="flex-auto"></div>
                
                <!-- Canvas Div -->
                <div class="absolute inset-0">
                    <canvas class="w-full h-full" style="object-position: 0%;" bind:this={red_canvas}></canvas>
                </div>
                
                <!-- Text Divs -->
                <div class="flex flex-col flex-auto z-10">
                    <div class='my-8 w-full text-6xl text-center' style="background-color: {mvpbannerbgcolor}; color: {mvpbannertextcolor}"> MVP </div>
                    <div class="flex-auto"></div>
                    <div class='mx-5 pt-12 text-3xl text-right' style="color: {mvpagentcolor}">{red_team.players[0].agent.toUpperCase()}</div>
                    <!-- Need to figure out how to make this a dynamic text size based on character length -->
                    <div 
                        class='mx-5 mb-5 text-4xl text-right overflow-hidden whitespace-nowrap'
                        style="
                            color: {mvptextcolor};
                            max-width: 300px; 
                            transform: {red_team.players[0].name.length > 15 ? 'scale(0.8)' : 'scale(1)'};
                            transition: transform 0.3s ease;
                        "
                    >
                        {red_team.players[0].name.toUpperCase()}
                    </div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="flex flex-row flex-grow"> 
                <!--For loop using {#each}-->
                <!-- Other Player Stats Section -->
                <div class="flex flex-col min-w-[68%] w-[75%] gap-3">
                    {#each red_team.players.slice(1) as player}
                        <StatsPlayer  orientation="right" playerData={player} colorData={{bg: rightbgcolor, text: rightbigtextcolor, smalltext: rightsmalltextcolor}} agentData={mapData.agentData}/>
                    {/each}
                </div>

                <!-- Map Section -->
                <div class="relative w-[50%] ml-3 justify items-end" style="background-color: {rightbgcolor};">
                    <img src="https://i.postimg.cc/rFcBLJsY/1280px-HD-transparent-picture.png" alt="ur mom">
                </div>

            </div>
        
        </div>
        
    </div>


</main>

<style>
    /* *{
        font-family: '`{globalFont.family}`, sans-serif';
    } */
</style>

