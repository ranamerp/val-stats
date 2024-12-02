<script lang="ts">

    import { getContext } from "svelte";

    let searchQuery: string = '';
    export let presets: Record<string, App.ColorPreset>;
    export let currentColors: App.ColorPreset;
    let isOpen = false;
    let saveBox = false;
    let presetName = "";
    const supabase: any = getContext('supabase');
    const user: any = getContext('user');

    console.log(user);

    async function savePreset(currentColors: App.ColorPreset) {
        // This should do the following:
        // Get the current user from auth
        // Get the current colors from root (send reactively)
        // Get name from value above
        // Get now()
        // Get current selected font 
        // Check if preset current exists. If it does, ask if they want to overwrite
        // Write all this data to supabase
        // Change button text and color to indicate preset is saved
        console.log(currentColors)
        let finalObject = {
            user_id: user.id,
            preset_name: presetName,
            last_updated: '2024-01-01',
            leftbgcolor: currentColors.leftbgcolor,
            leftbigtextcolor: currentColors.leftbigtextcolor,
            leftsmalltextcolor: currentColors.leftsmalltextcolor,
            rightbgcolor: currentColors.rightbgcolor,
            rightbigtextcolor: currentColors.rightbigtextcolor,
            rightsmalltextcolor:  currentColors.rightsmalltextcolor,
            mvpbannerbgcolor: currentColors.mvpbannerbgcolor,
            mvpbannertextcolor:  currentColors.mvpbannertextcolor,
            mvpagentcolor:  currentColors.mvpagentcolor,
            mvptextcolor: currentColors.mvptextcolor,
            globaltextcolor: currentColors.globaltextcolor,
            font: "Arial"
        }

        const { data, error } = await supabase
                .from('presets')
                .select()
                .eq(presetName, "preset_name")
        
        
                
        if (data) {
            console.log(data)
        }
        
    }

    
    // There's 2 parts to this. First part is main button. Will have Search, Dropdown, Save, and Delete.
    // Dropdown, if paid, will show user presets first and then suggested ones. Otherwise show just suggested
    // Search works like font search 
    // Save replaces current page with Input box to put name, and then a big save button
    // Note: If name already exists (name.lower), just overwrite
    // Delete replaces with text that says "Are you sure you want to delete, and a yes/no button"
    // I could also pass through the store and user from root. Would make it easier to work with?

</script>


<div class="font-dropdown relative w-64">
    <button
        class="w-full px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => isOpen = !isOpen}>
        Preset
    </button>

    {#if isOpen}
        <div class="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
            {#if saveBox}
            <div class="p-2">
                <!-- Saving presets -->
                <input
                    type="text"
                    placeholder="Preset Name"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={presetName}
                />
                
                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={() => savePreset(currentColors)}
                >
                    Save Preset
                </button>

                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={() => saveBox = !saveBox}
                >
                    Back
                </button>

            </div>
            {:else}
            <div class="p-2">
                <!-- Searching presets -->
                <input
                    type="text"
                    placeholder="Search presets..."
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={searchQuery}
                />
                
                <!-- These should only save if user is paid. But for now keep -->
                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={() => saveBox = !saveBox}
                >
                
                    Save Preset
                </button>

                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Delete Preset
                </button>


            </div>
            <!-- This is listing all the stored presets. Get presets from user and then append to presets from store -->
            <div class="max-h-60 overflow-y-auto">
                {#each Object.entries(presets) as [presetname, preset]}
                    <button
                    class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    on:click={() => console.log(preset)}
                >
                    {presetname}
                </button>
                {/each}
                
            </div>
            {/if}
        </div>
    

    {/if}

</div>