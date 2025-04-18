<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { get } from "svelte/store";
    import { presets, currentColor } from "../stores/Presets";
    import type { SupabaseClient, User } from '@supabase/supabase-js'

    export let supabase: SupabaseClient<any, "stats", any>;
    export let userid: string | undefined;
    let isPopOpen = false;
    let presetName = "Preset";
    let temp_preset: App.ColorPreset = $currentColor;
    let currentPresetCode: string = $currentColor.share_code;

    let presetView: 'main' | 'save' | 'delete' | 'update' | 'share' = 'main';
    //const supabase: SupabaseClient = { supabaseC }
    //const user: any = getContext('user');

    function isAuthenticated(): boolean {
        return !!userid;
    }

    function handleAuthenticatedAction(action: () => void) {
        if (!isAuthenticated()) {
            // You could trigger an error message here
            console.log('Please login to use this feature');
            return;
        }
        action();
    }

    async function updateStore() {
        const { data: fetchedData, error } = await supabase
            .from('presets')
            .select('*')
            .eq("user_id", userid);
        
        //This means a user is found, so we can add new presets. Otherwise, if a user is not found, we just show them the stored presets
        if (fetchedData) {
            presets.update((currentPresets) => {
                const updatedPresets: Record<string, App.ColorPreset> = {...currentPresets};
                const fetchedPresetNames = new Set(fetchedData.map((preset: any) => preset.preset_name));

                // Remove items with preset_id < 100 that are not in fetchedData
                Object.keys(updatedPresets).forEach(presetName => {
                    const preset = updatedPresets[presetName];
                    if (preset.preset_id > 100 && !fetchedPresetNames.has(presetName)) {
                        delete updatedPresets[presetName];
                    }
                });

                // Process each fetched preset
                fetchedData.forEach((preset: any) => {
                    // If the preset already exists in the current presets, skip it
                    // if (updatedPresets[preset.preset_name]) {
                    //     return; // Skip this iteration
                    // }
                    

                    // If preset doesn't exist, add it
                    updatedPresets[preset.preset_name] = {
                        preset_id: preset.preset_id,
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
                        globaltextcolor: preset.global_text,
                        font: preset.font,
                        share_code: preset.share_code
                    };

                    
                });
                return updatedPresets;
            });
        }
    }
    
    async function deletePreset() {
        if ($currentColor.preset_id < 100) {
            console.log("You cannot delete this preset!")
            console.log($currentColor)
            return
        }

        try {
            const { data, error } = await supabase
                .from("presets")
                .delete()
                .eq('user_id', userid)
                .eq("preset_id", $currentColor.preset_id);

            if (error) {
                //If the error is it can't find id, then the user is not signed in. Need a popup that has them sign in
                console.error(error);
            } else {
                //Update button with confirmation of what got deleted
                updateStore();
                presetView = 'main';
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function savePreset(preset?: App.DatabaseColorPresetResponse) {
        // This should do the following:
        // Get the current user from auth
        // Get the current colors from root (send reactively)
        // Get name from value above
        // Get now()
        // Get current selected font 
        // Check if preset current exists. If it does, ask if they want to overwrite
        // Write all this data to supabase
        // Change button text and color to indicate preset is saved
        
        let finalObject: App.DatabaseColorPreset;

        if (preset) {
            finalObject = {
                user_id: userid ?? '',
                preset_name: preset.preset_name,
                last_updated: new Date().toISOString(),
                left_background: preset.left_background,
                left_bigtext: preset.left_bigtext,
                left_smalltext: preset.left_smalltext,
                right_background: preset.right_background,
                right_bigtext: preset.right_bigtext,
                right_smalltext:  preset.right_smalltext,
                mvpbanner_background: preset.mvpbanner_background,
                mvpbanner_text:  preset.mvpbanner_text,
                mvp_agent:  preset.mvp_agent,
                mvp_text: preset.mvp_text,
                global_text: preset.global_text,
                font: preset.font,
                share_code: preset.share_code
            }
        } else {
            // If no preset is passed, use the current color from the store
            finalObject = {
                user_id: userid ?? '',
                preset_name: presetName,
                last_updated: new Date().toISOString(),
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
                font: "Arial",
                share_code: Math.random().toString(36).slice(2,8).toUpperCase()
            }
        }

        // let finalObject: DatabasePreset = {
        //     user_id: userid,
        //     preset_name: presetName,
        //     last_updated: new Date().toISOString(),
        //     left_background: $currentColor.leftbgcolor,
        //     left_bigtext: $currentColor.leftbigtextcolor,
        //     left_smalltext: $currentColor.leftsmalltextcolor,
        //     right_background: $currentColor.rightbgcolor,
        //     right_bigtext: $currentColor.rightbigtextcolor,
        //     right_smalltext:  $currentColor.rightsmalltextcolor,
        //     mvpbanner_background: $currentColor.mvpbannerbgcolor,
        //     mvpbanner_text:  $currentColor.mvpbannertextcolor,
        //     mvp_agent:  $currentColor.mvpagentcolor,
        //     mvp_text: $currentColor.mvptextcolor,
        //     global_text: $currentColor.globaltextcolor,
        //     font: "Arial",
        //     share_code: Math.random().toString(36).slice(2,8).toUpperCase()
        // }

        if (get(presets)[presetName]) {
            console.log("DUMMY THIS EXISTS IN THE STORE")
            presetView = 'main';
            isPopOpen = !isPopOpen;
        }
        else {
            const { data, error } = await supabase
                .from('presets')
                .select('*')
                .or(`and(user_id.eq.${userid}, preset_name.ilike.${presetName}), share_code.eq.${finalObject.share_code}`)
                // .eq("user_id", userid)
                // .ilike("preset_name", presetName)
    
            if (error) {
                console.error('Supabase Query Error:', error)
            }
            
            //This should also check if it exists in the store
            if (data && data.length > 0) {
                // If the preset came from importing, we still want to save it but just change ID. 
                console.log("This preset already exists in the database!")
                if (preset) {
                    try {
                    const { data, error } = await supabase
                        .from('presets')
                        .insert([finalObject]);
    
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(finalObject);
                        updateStore();
                        presetView = 'main';
                        currentPresetCode = finalObject.share_code;
                        isPopOpen = !isPopOpen;
                    }
                    } catch (error) {
                    console.error(error);
                    }
                }
            } else {
                // This is a claude suggestion for post requests using fetch. Will attempt it for consistency
                // const { data, error } = await fetch('/api/your-endpoint', {
                // method: 'POST',
                // body: JSON.stringify(finalObject),
                // headers: {
                //     'Content-Type': 'application/json'
                // }
                // }).then(res => res.json());

                // Add preset to DB and also store. Return confirmation by changing button color and text
                try {
                    const { data, error } = await supabase
                        .from('presets')
                        .insert([finalObject]);
    
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(finalObject);
                        updateStore();
                        presetView = 'main';
                        currentPresetCode = finalObject.share_code;
                        isPopOpen = !isPopOpen;
                    }
                    } catch (error) {
                    console.error(error);
                    }
            }

        }

        
    }

    async function updatePreset() {
        // This should do the following:
        // Get current selected preset from store
        // Get current preset in general
        // Let you click button to swap between them to confirm changes
        // Have a input box that will let you change the name of the preset
        // When updating, it'll take either the "before" or "after" option, overwrite the store, and then update the database

        if ($currentColor.preset_id < 100) {
            console.log("You cannot update this preset!")
            isPopOpen = !isPopOpen;
            return
        }
        let finalObject = {
            preset_id: $currentColor.preset_id,
            user_id: userid,
            preset_name: presetName,
            last_updated: new Date().toISOString(),
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
            font: $currentColor.font,
            share_code: $currentColor.share_code
        }

        try {
            const { data, error } = await supabase
                .from('presets')
                .upsert([finalObject], {
                    onConflict: 'preset_id'
                });


            if (error) {
                console.error(error);
            } else {
                console.log(finalObject);
                updateStore();
                presetView = 'main';
                isPopOpen = !isPopOpen;
            }
        } catch (error) {
            console.error(error);
        }

        // Find the supabase record and update it. 

    }

    async function sharePreset(text: string) {
        // This should do the following:
        // Get the preset share
        try {
            await navigator.clipboard.writeText(text);
            console.log("Copied to clipboard: " + text);
            return true

        } catch (err) {
            console.error("Failed to copy: ", err);
            return false
        }

    }

    async function loadPreset(presetID: string) {
        //This will get the preset id from a text box, and grab it from the database
        // Currently, need to add a share_id to the preset table.
        const { data, error } = await supabase
                .from('presets')
                .select('*')
                .eq("share_code", presetID)
                .limit(1);
    
        if (error) {
            console.error('Supabase Query Error:', error)
        }

        if (data && data.length > 0) {
            const preset: App.DatabaseColorPresetResponse = data[0];
            let newPreset = {
                preset_id: preset.preset_id,
                leftbgcolor: preset.left_background,
                leftbigtextcolor: preset.left_bigtext,
                leftsmalltextcolor: preset.left_smalltext,
                rightbgcolor: preset.right_background,
                rightbigtextcolor: preset.right_bigtext,
                rightsmalltextcolor: preset.right_smalltext,
                mvpbannerbgcolor: preset.mvpbanner_background,
                mvpbannertextcolor: preset.mvpbanner_text,
                mvpagentcolor: preset.mvp_agent,
                mvptextcolor: preset.mvp_text,
                globaltextcolor: preset.global_text,
                font: "Arial",
                share_code: preset.share_code
            }
            applyPreset(newPreset, preset.preset_name);
            savePreset(preset);
            presetView = 'main';
        }
    }
    
    async function applyPreset(selectedPreset: App.ColorPreset, preName: string) {
        currentColor.set((selectedPreset))
        presetName = preName
        currentPresetCode = selectedPreset.share_code;
    }
    onMount(async () => {
        await updateStore();
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
        class="w-full min-h-10 px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => 
            {
                isPopOpen = !isPopOpen
                presetView = 'main';
                if (presetName.trim().length === 0) {
                    presetName = "Preset"
                }
            }
        }>
        {presetName}
    </button>

    {#if isPopOpen}
        <div class="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
            {#if presetView === 'save'}
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
                    on:click={() => presetView = 'main'}
                >
                    Back
                </button>

            </div>
            {:else if presetView === 'delete'}
                <div class="p-2">
                    <!-- Saving presets -->
                    <h2>Are you sure you want to delete this preset?</h2>
                    {presetName}
                    
                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        on:click={() => {
                            deletePreset()}
                        }
                    >
                        Delete Preset
                    </button>

                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        on:click={() => presetView = 'main'}
                    >
                        Back
                    </button>

                </div>
            {:else if presetView === 'update'}
                <div class="p-2">

                    <!-- Saving presets -->
                    <h2>Are you sure you want to update this preset?</h2>
                    <input
                        type="text"
                        placeholder={presetName}
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        bind:value={presetName}
                    />

                    <div class="flex flex-row gap-2">
                        <button
                            class="w-full mt-2 px-3 text-white bg-blue-500 rounded-lg  hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            on:click={() => {
                                temp_preset = { ...$currentColor };
                                let new_preset = Object.values($presets).find(preset => preset.preset_id === temp_preset.preset_id) ??
                                                temp_preset;
                                applyPreset(new_preset, presetName);
                            }}
                            >
                            Current Preset
                        </button>

                        <button
                            class="w-full mt-2 px-3 text-white bg-red-500 rounded-lg  hover:bg-red-600 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                            on:click={() => {
                                // By default this is already the current color. 
                                // If a user changes color away from the preset, then it should show here
                                // For current preset, it should save whatever user has, then pull the preset by id
                                applyPreset(temp_preset, presetName);
                            }}
                        >
                            New Preset
                        </button>
                    </div>

                    
                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        on:click={() => updatePreset()}
                    >
                        Update Preset
                    </button>

                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        on:click={() => presetView = 'main'}
                    >
                        Back
                    </button>
                </div>
            {:else if presetView === 'share'}
                <div class="p-2">
                    <!-- Saving presets -->
                    <h2>Preset ID</h2>
                    <input
                        type="text"
                        placeholder="Preset ID"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        bind:value={currentPresetCode}
                    />
                    <div class="flex flex-row gap-2">
                        <button
                            class="w-full mt-2 px-3 text-white bg-blue-500 rounded-lg  hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            on:click={() => {
                                loadPreset(currentPresetCode);
                            }}
                        >
                            Load Preset
                        </button>
                        <button
                            class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            on:click={() => {
                                sharePreset(currentPresetCode);
                                isPopOpen = !isPopOpen;
                            }}
                        >
                            Share Preset
                        </button>
                    </div>

                    <button
                        class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        on:click={() => presetView = 'main'}
                    >
                        Back
                    </button>
                </div>
            {:else}
            <div class="p-2">
                <button
                    class="w-full mt-2 px-3 py-2 text-white {isAuthenticated() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} 
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={() => handleAuthenticatedAction(() => 
                    {
                        presetView = 'share';
                    })}
                    disabled={!isAuthenticated()}
                >
                Share Preset
                </button>

                <button
                    class="w-full mt-2 px-3 py-2 text-white {isAuthenticated() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} 
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={() => handleAuthenticatedAction(() =>
                    {
                        presetView = 'save';
                        presetName = `Preset`;
                        
                    })}
                    disabled={!isAuthenticated()}
                >
                
                    Save Preset
                </button>



                <div class = "flex flex-row gap-x-1">

                    <button
                        class="w-full mt-2 px-3 py-2 text-white {isAuthenticated() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} 
                        rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        on:click={() => 
                        {
                            presetView = 'update';
                        }}
                        disabled={!isAuthenticated()}
                    >
                
                    Update
                    </button>

                    <button
                        class="w-full mt-2 px-3 py-2 text-white {isAuthenticated() ? 'bg-red-500  hover:bg-red-600': 'bg-gray-400 cursor-not-allowed'}  
                        rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        on:click={() => presetView = 'delete'}
                        disabled={!isAuthenticated()}
                    >
                        Delete
                    </button>
                </div>


            </div>
            <!-- This is listing all the stored presets. Get presets from user and then append to presets from store -->
            <div class="max-h-60 overflow-y-auto">
                {#each Object.entries($presets)
                    .sort((a, b) => b[1].preset_id - a[1].preset_id) 
                    as [presetname, preset]
                }
                
                    <button
                    class="w-full px-4 py-2 text-left hover:bg-blue-100 focus:outline-none focus:bg-blue-500"
                    on:click={() => {
                        applyPreset(preset, presetname);
                        isPopOpen = !isPopOpen;
                        presetView = 'main';
                    }}
                >
                    {presetname}
                </button>
                {/each}
                
            </div>
            {/if}
        </div>
    

    {/if}

</div>