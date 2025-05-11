<script lang="ts">

    import Stats from "../components/Stats.svelte";
    import FontPopup from "../components/FontPopup.svelte";
    import LoadingPopup from "../components/LoadingPopup.svelte";
    import PresetPopup from "../components/PresetPopup.svelte";
    import ErrorComp from "../components/ErrorComp.svelte";

    import { presets, currentColor } from "../stores/Presets";
    import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
    import { error } from "@sveltejs/kit";
    
    

    export let data;
    const { stats, supabase, user } = data;
    let player = data.player.split('#')[0]
    let value = 0;
    let btname = "ATK";
    let rtname = "DEF";
    let searchTerm = data.player;
    let selection = stats as App.LocalMatch[];
    selection[value].red_team.team_name = rtname;
    selection[value].blue_team.team_name = btname;

    let showPopup = false;
    let showError = true;
    let popupMessage = "";
    let errorMessage = '';
    let region = 'na';

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
        font: $currentColor.font ?? 'Arial',
        share_code: $currentColor.share_code ?? 'BTU17Y',
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

    async function searchPlayers(origin?: string) {
        let terms = searchTerm.split("#");


        showPopup = true;
        popupMessage = `"Loading player data for ${searchTerm}"`

        try{
            const response = await fetch(`/api/match?region=${region}&name=${terms[0]}&tag=${terms[1]}`);
            if (response.status === 404) {
                if (origin === 'reload') {
                    throw new Error("Reload failed, user not found!");
                }
                throw new Error("User not found!");
            }
            else if (response.status !== 200) {
                if (origin === 'reload') {
                    throw new Error("Reload failed, please refresh the page!");
                }
                throw new Error('Invalid response from server');
            }
            else {
                selection = await response.json();
                value = 0;
                player = terms[0];
                selection[value].red_team.team_name = rtname;
                selection[value].blue_team.team_name = btname;

            }
        } catch (err: any) {
            triggerError(err.message);
        } finally {
            showPopup = false;
        }
    }

    async function gotoOutput(currentmatch: App.LocalMatch, colors: App.ColorPreset) {
        const stat = await outputMatch(currentmatch, colors)
        //If provider is discord, lets use their discord username instead of the id
        let username = ''
        if (user?.app_metadata.provider === 'discord') {
            username = user?.user_metadata.full_name
        }
        //If provider is riot, we should still try to use their name, but I currently don't know what the name is.
        if (stat.status === 200) {
            //goto(`${username}/output`)
            window.open(`${username}/output`, '_blank');
        }        
    }

    async function outputMatch(currentmatch: App.LocalMatch, colors: App.ColorPreset) {
        const finalobject = {
            current_match: currentmatch,
            current_preset: colors
        }

        //Try and move this to the server if possible
        if (!user?.id) {
            //console.error('User ID is missing');
            triggerError('User ID is missing! Are you logged in?');
            return { status: 400, error: 'User ID is missing' };
        }

        try {
            const { data, error } = await supabase
                .schema('stats')
                .from('users')
                .update(finalobject)
                .eq('user_id', user.id)
                .select();

        if (error) {
            triggerError(`Supabase Error: ${error.message}`);
            return { status: 404, error: error.message };
        }

        console.log('Update Successful:', data);
        return { status: 200, data: data };

        } catch (error) {
            console.error('Unexpected Error:', error);
            triggerError('Error when updating match, please try again later.');
            return { status: 500, error: 'Internal Server Error' };
        }
    }

    function getTimeAgo(timestamp: string | Date): string {
        try {
            const now = new Date();
            const then = timestamp instanceof Date ? timestamp : new Date(timestamp);
            
            if (isNaN(then.getTime())) {
                throw new Error('Invalid date');
            }

            const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

            if (diff < 60) return `${diff} ${diff === 1 ? 'second' : 'seconds'} ago`;
            if (diff < 3600) {
                const minutes = Math.floor(diff / 60);
                return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
            }
            if (diff < 86400) {
                const hours = Math.floor(diff / 3600);
                return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
            }
            if (diff < 2592000) {
                const days = Math.floor(diff / 86400);
                return `${days} ${days === 1 ? 'day' : 'days'} ago`;
            }
            if (diff < 31536000) {
                const months = Math.floor(diff / 2592000);
                return `${months} ${months === 1 ? 'month' : 'months'} ago`;
            }
            const years = Math.floor(diff / 31536000);
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Invalid date';
        }
    }

    function triggerError(message: string) {
        showError = false;
        errorMessage = message;
        showError = true;
        setTimeout(() => {
            showError = false;
        }, 5000);
    }

    let isLoading = false;

</script>
<div>
{#if isLoading}
   <p> Loading...</p>
{:else}
    
    {#if showError}
        <ErrorComp message = {errorMessage}/>
    {/if}

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
                    {item.mapName} ({getTimeAgo(item.startTime)})
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

        <!-- Add Match Reload Button -->
        <div>
            <button type="submit" onclick={() => searchPlayers("reload")} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Reload Matches</button>
        </div>

        <!-- Current Player -->
        <div class=""> 
            Current Player: {player}
        </div>

        <!-- Region Selection -->
        <div>
            <label for="region" class="block mb-2 px-2 text-sm font-medium text-gray-900 dark:text-white">Region</label>
            <select 
            id="region" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onchange={(event) => {
                region = (event.target as any).value;
            }}
            >
                <option value="na">NA</option>
                <option value="eu">EU</option>
                <option value="ap">AP</option>
                <option value="kr">KR</option>
            </select>
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
                <button onclick={() => searchPlayers("search")} type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
        </form>

        <!-- Update Output -->
        <div>
        <button type="submit" onclick={() => outputMatch(selection[value], colors)} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Update Output</button>
        </div>

        <div> 
            <!-- This will be where we send users to the page that they can pull their image.  -->
            <!-- For now start with just an output page but then eventually need to do user auth. -->
            <button type="submit" onclick={() => gotoOutput(selection[value], colors)} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Export to Page</button>
            
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
        <div class="bg-slate-600 flex flex-col min-w-[10%] z-20">
            <!-- We can make this custom, refer to doc for creating custom components. -->
            <ColorPicker
                on:input={(event) => {
                    colors.leftbgcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Left BG"
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
            label = "Left Accent"
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
            label = "MVP Banner BG"
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
            label = "MVP Agent Text"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvpagentcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.mvptextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "MVP Name"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.mvptextcolor}
    
            />

            <ColorPicker
            on:input={(event) => {
                
                colors.globaltextcolor = event.detail.hex as string;
                currentColor.set(colors);
            }}
            label = "General Text"
            components={ChromeVariant} 
            sliderDirection="horizontal"
            hex = {colors.globaltextcolor}
    
            />
        </div>
        
        <!-- Stats -->
            <div class="flex flex-col">
                    <Stats 
                        playerData={selection[value]}
                        colors = {colors}
                    />
            </div>

        <!-- Other Dropdowns -->
        <div class="bg-slate-600 flex flex-col min-w-[10%] z-20">
            
            <!-- <FontPopup/> -->
            



            <!-- Right colors -->
            <div class="flex flex-col">
                <!-- We can make this custom, refer to doc for creating custom components. -->
                <ColorPicker
                on:input={(event) => {
                    colors.rightbgcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "Right BG"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.rightbgcolor}
                --cp-bg-color="{colors.rightbgcolor}"
                --cp-text-color="black"
                --picker-indicator-size="10px"
                --input-size="25px"
                --position="responsive-x"

                
    
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
                label = "Right Accent"
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
                label = "MVP Banner BG"
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
                label = "MVP Agent Text"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvpagentcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.mvptextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "MVP Name"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.mvptextcolor}
        
                />

                <ColorPicker
                on:input={(event) => {
                    
                    colors.globaltextcolor = event.detail.hex as string;
                    currentColor.set(colors);
                }}
                label = "General Text"
                components={ChromeVariant} 
                sliderDirection="horizontal"
                hex = {colors.globaltextcolor}
        
                />
            </div>
        </div>

    </div>
{/if}
</div>

