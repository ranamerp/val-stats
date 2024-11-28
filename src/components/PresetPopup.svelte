<script lang="ts">
    let currentPreset = "VCT Champions 2024"
    let searchQuery: string = '';
    // let presets: { family: string; category: string }[] = [];
    let isOpen = false;
    // let filteredFonts: { family: string; category: string }[] = [];
    
    // There's 2 parts to this. First part is main button. Will have Search, Dropdown, Save, and Delete.
    // Dropdown, if paid, will show user presets first and then suggested ones. Otherwise show just suggested
    // Search works like font search 
    // Save replaces current page with Input box to put name, and then a big save button
    // Note: If name already exists (name.lower), just overwrite
    // Delete replaces with text that says "Are you sure you want to delete, and a yes/no button"

</script>


<div class="font-dropdown relative w-64">
    <button
        class="w-full px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => isOpen = !isOpen}>
        Preset
    </button>

    {#if isOpen}
        <div class="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
            <div class="p-2">
                <!-- Searching presets -->
                <input
                    type="text"
                    placeholder="Search fonts..."
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={searchQuery}
                />
                
                <!-- These should only save if user is paid. But for now keep -->
                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save Preset
                </button>

                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Delete Preset
                </button>


            </div>

            <div class="max-h-60 overflow-y-auto">
                
            </div>
        </div>

    {/if}

</div>