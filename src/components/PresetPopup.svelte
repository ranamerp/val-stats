<script lang="ts">
    import { getContext, onMount, setContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { presets, currentColor } from "../stores/Presets";

    let searchQuery: string = '';
    let isPopOpen = false;
    let saveBox = false;
    let deleteBox = false;
    let presetName = "";
    let overwrite = false;
    const supabase: any = getContext('supabase');
    const user: any = getContext('user');
    // TODO: Make ColorPreset object like supabase schema
    // Fix SavePreset saving wrong version
    // Finish Delete Preset
    // Clean up where needed
    async function deletePreset(selectedPreset: App.ColorPreset) {
        //Make sure they can't delete default presets
        // 
        try {
        const { data, error } = await supabase
            .from("presets")
            .delete()
            .eq('user_id', user.id)
            .ilike("preset_id", selectedPreset.preset_id);

        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
        } catch (error) {
        console.error(error);
        }
    }

    async function savePreset() {
        // This should do the following:
        // Get the current user from auth
        // Get the current colors from root (send reactively)
        // Get name from value above
        // Get now()
        // Get current selected font 
        // Check if preset current exists. If it does, ask if they want to overwrite
        // Write all this data to supabase
        // Change button text and color to indicate preset is saved

        let finalObject = {
            user_id: user.id,
            preset_name: presetName,
            last_updated: '2024-01-01',
            left_background: $currentColor.leftbgcolor,
            left_bigtext: $currentColor.leftbigtextcolor,
            left_smalltext: $currentColor.leftsmalltextcolor,
            right_background: $currentColor.rightbgcolor,
            right_bigtext: $currentColor.rightbigtextcolor,
            right_smalltext:  $currentColor.rightsmalltextcolor,
            mvpbanner_background: $currentColor.mvpbannerbgcolor,
            mvpbanner_text:  $currentColor.mvpbannertextcolor,
            mvp_agent:  $currentColor.mvpagentcolor,
            mvp_text: $currentColor.mvptextcolor,
            global_text: $currentColor.globaltextcolor,
            font: "Arial"
        }

        const { data, error } = await supabase
            .from('presets')
            .select('*')
            .eq("user_id", user.id)
            .ilike("preset_name", presetName)

        if (error) {
            console.error('Supabase Query Error:', error)
        }

        if (data.length > 0) {
            overwrite = !overwrite;
            console.log("This already exists lol, no bueno!")
        } else {
            // Add preset to DB and also store. Return confirmation by changing button color and text
            try {
                const { data, error } = await supabase
                    .from('presets')
                    .insert([finalObject]);

                if (error) {
                    console.error(error);
                } else {
                    console.log(data);
                }
                } catch (error) {
                console.error(error);
                }
        }
        
    }
    
    async function applyPreset(selectedPreset: App.ColorPreset) {
        currentColor.set(selectedPreset)
    }
    onMount(async () => {
        const { data: fetchedData, error } = await supabase
        .from('presets')
        .select('*')
        .eq("user_id", user.id);
        
        if (fetchedData) {
            //Need to get preset type from schema at some point.
            fetchedData.forEach((preset: any) => {
                presets.update((currentPreset) => ({
                    [preset.preset_name]: {
                        leftbgcolor: preset.left_background,
                        leftbigtextcolor: preset.left_bigtext,
                        leftsmalltextcolor: preset.left_smalltext,
                        rightbgcolor: preset.right_background,
                        rightbigtextcolor: preset.right_bigtext,
                        rightsmalltextcolor: preset.right_smalltext,
                        mvpagentcolor: preset.mvp_agent,
                        mvpbannerbgcolor: preset.mvpbanner_background,
                        mvpbannertextcolor: preset.mvpbanner_text,
                        mvptextcolor: preset.mvp_text,
                        globaltextcolor: preset.global_text
                    },
                    ...currentPreset
                    }));
                
            });
        }
    })
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
        on:click={() => isPopOpen = !isPopOpen}>
        Preset
    </button>

    {#if isPopOpen}
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
                    on:click={() => savePreset()}
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
            {:else if deleteBox}
                <div class="p-2">
                    <!-- Saving presets -->
                    <h2>Are you sure you want to delete this preset? </h2>
                    
                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        on:click={() => savePreset()}
                    >
                        Delete Preset
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
                {#each Object.entries($presets) as [presetname, preset]}
                    <button
                    class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    on:click={() => applyPreset(preset)}
                >
                    {presetname}
                </button>
                {/each}
                
            </div>
            {/if}
        </div>
    

    {/if}

</div>