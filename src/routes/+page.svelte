<script lang="ts">

    import Stats from "../components/Stats.svelte";
    import FontPopup from "../components/FontPopup.svelte";
    import LoadingPopup from "../components/LoadingPopup.svelte";
    import PresetPopup from "../components/PresetPopup.svelte";
    import { presets, currentColor } from "../stores/Presets";
    import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
    import { goto } from '$app/navigation';
    

    export let data;
    const { stats, supabase, user } = data;
    let player = data.player.split('#')[0]
    let value = 0;
    let btname = "SEN";
    let rtname = "100T";
    let searchTerm = data.player;
    let selection = stats as App.LocalMatch[];
    selection[value].red_team.team_name = rtname;
    selection[value].blue_team.team_name = btname;

    let showPopup = false;
    let popupMessage = "";

    let colors: App.ColorPreset = {
        preset_id: $currentColor.preset_id ?? 0,
        leftbgcolor: $currentColor.leftbgcolor ?? '#c2ae75',
        leftbigtextcolor: $currentColor.leftbigtextcolor ??'#131313',
        leftsmalltextcolor: $currentColor.leftsmalltextcolor ?? '#db3131',
        
        rightbgcolor: $currentColor.rightbgcolor ?? '#131313',
        rightbigtextcolor: $currentColor.rightbigtextcolor ?? '#c2ae75',
        rightsmalltextcolor:  $currentColor.rightsmalltextcolor ?? '#ffffff',

        mvpbannerbgcolor: $currentColor.mvpbannerbgcolor ?? '#db3131',
        mvpbannertextcolor:  $currentColor.mvpbannertextcolor ?? '#131313',
        mvpagentcolor:  $currentColor.mvpagentcolor ?? '#ffffff',
        mvptextcolor: $currentColor.mvptextcolor ?? '#c2ae75',
        globaltextcolor: $currentColor.globaltextcolor ?? '#c2ae75',
        font: $currentColor.font ?? 'Arial'
    }

    $: if ($currentColor) {
        colors.preset_id = $currentColor.preset_id
        colors.leftbgcolor = $currentColor.leftbgcolor
        colors.leftbigtextcolor = $currentColor.leftbigtextcolor
        colors.leftsmalltextcolor = $currentColor.leftsmalltextcolor

        colors.rightbgcolor = $currentColor.rightbgcolor
        colors.rightbigtextcolor = $currentColor.rightbigtextcolor
        colors.rightsmalltextcolor = $currentColor.rightsmalltextcolor

        colors.mvpbannerbgcolor = $currentColor.mvpbannerbgcolor
        colors.mvpbannertextcolor = $currentColor.mvpbannertextcolor
        colors.mvpagentcolor = $currentColor.mvpagentcolor
        colors.mvptextcolor = $currentColor.mvptextcolor
        colors.globaltextcolor = $currentColor.globaltextcolor

    }
    
    currentColor.set(colors)

    async function searchPlayers() {
        let terms = searchTerm.split("#");


        showPopup = true;
        popupMessage = `"Loading player data for ${searchTerm}"`

        try{
            const response = await fetch(`/api/match?region=${'na'}&name=${terms[0]}&tag=${terms[1]}`);
            selection = await response.json();
            value = 0;
            player = terms[0];
            selection[value].red_team.team_name = rtname;
            selection[value].blue_team.team_name = btname;
        } catch (err: any) {
            console.log("ERROR!")
            console.log(err.message);
        } finally {
            showPopup = false;
        }
    }

    async function gotoOutput(currentmatch: App.LocalMatch, colors: App.ColorPreset) {
        const stat = await outputMatch(currentmatch, colors)
        if (stat.status === 200) {
            goto(`${user?.id}/output`)
        }        
    }

    //There should be a button that triggers this function without the redirect. 
    async function outputMatch(currentmatch: App.LocalMatch, colors: App.ColorPreset) {

        //once set, need to redirect
        const finalobject = {
            current_match: currentmatch,
            current_preset: colors
        }
        //Try and move this to the server if possible
        try {
            const { data, error } = await supabase
                .schema('stats')
                .from('users')
                .update([finalobject])
                .eq('user_id', user?.id)
            if (error) {
                console.error(error);
                return {status: 404, error: error}
            } else {
                console.log(finalobject);
                return {status: 200}
            }
        } catch (error) {
            console.error(error);
            return {status: 500, error: error}
        }

    }


    let isLoading = false;

</script>
<div class="w-screen h-screen">
{#if isLoading}
   <p> Loading...</p>
{:else}
<LoadingPopup {showPopup} message= {popupMessage} />
    <!-- Top Div -->
    <div class="flex flex-row space-x-8 bg-purple-500">
        <!-- Match Selection -->
        <div>
            <h1> Choose a match :</h1>
            
            <select
            class="py-3 px-4 pe-9 block w-full border-gray-200 
            rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 
            disabled:opacity-50 disabled:pointer-events-none" 
            value={value}
            onchange={(event) => {
                value = (event.target as any).selectedIndex;
                selection[value].red_team.team_name = rtname;
                selection[value].blue_team.team_name = btname;
                }
            }
            >
            {#each selection as item}
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
                    <input type="text" bind:value={btname} oninput={() => {
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
                    <input type="text" bind:value={rtname} oninput={() => {
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
                <button onclick={searchPlayers} type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
        </form>

        <!-- Add Match Reload Button -->
            <div>
            <button type="submit" onclick={searchPlayers} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Reload Matches</button>
            </div>

            <div> 
            <!-- This will be where we send users to the page that they can pull their image.  -->
            <!-- For now start with just an output page but then eventually need to do user auth. -->
            <button type="submit" onclick={() => outputMatch(selection[value], colors)} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Export to Page</button>
            
        </div>

        <PresetPopup 
            supabase = {supabase}
            userid = {user?.id}
        />
            
    </div>

    <!-- <div class="w-[1280px] h-[720px]"> -->
    <!-- Main Bottom Div -->
    <div class="flex flex-row py-5 bg-purple-500">
        <!-- Colors -->
        <div class="bg-slate-600 flex flex-col">
            <!-- We can make this custom, refer to doc for creating custom components. -->
            <ColorPicker
                on:input={(event) => {
                    colors.leftbgcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Left Background"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.leftbgcolor}
                --cp-bg-color="{colors.leftbgcolor}"
                --cp-text-color="black"
                --picker-indicator-size="10px"
                --input-size="25px"
    
            />
    
            <ColorPicker
            on:input={(event) => {
                
                colors.leftbigtextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "Left Text"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.leftbigtextcolor}
    
            />
    
            <ColorPicker
            on:input={(event) => {
                
                colors.leftsmalltextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "Left Small Text"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.leftsmalltextcolor}
    
            />

            <br>
            <br>
    
            <ColorPicker
            on:input={(event) => {
                
                colors.mvpbannerbgcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "MVP Banner Background"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvpbannerbgcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.mvpbannertextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "MVP Banner Text"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvpbannertextcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.mvpagentcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "MVP Agent Text Color"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvpagentcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.mvptextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "MVP Name Color"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvptextcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.globaltextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "General Text Color"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.globaltextcolor}
    
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



            </div>

        <!-- Other Dropdowns -->
        <div class="bg-slate-600 flex flex-col gap-y-5">
            
            <!-- <FontPopup/> -->
            



            <!-- Right colors -->
            <div class="flex flex-col">
                <!-- We can make this custom, refer to doc for creating custom components. -->
                <ColorPicker
                on:input={(event) => {
                    colors.rightbgcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Right Background"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.rightbgcolor}
                --cp-bg-color="{colors.rightbgcolor}"
                --cp-text-color="black"
                --picker-indicator-size="10px"
                --input-size="25px"
    
                />
    
                <ColorPicker
                on:input={(event) => {
                    
                    colors.rightbigtextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Right Text"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.rightbigtextcolor}
        
                />
        
                <ColorPicker
                on:input={(event) => {
                    
                    colors.rightsmalltextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Right Small Text"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.rightsmalltextcolor}
        
                />
                <br>
                <br>
                
                <ColorPicker
                on:input={(event) => {
                    
                    colors.mvpbannerbgcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "MVP Banner Background"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvpbannerbgcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.mvpbannertextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "MVP Banner Text"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvpbannertextcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.mvpagentcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "MVP Agent Text Color"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvpagentcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.mvptextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "MVP Name Color"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvptextcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.globaltextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "General Text Color"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.globaltextcolor}
        
                />
            </div>
        </div>

    </div>
{/if}
</div>

