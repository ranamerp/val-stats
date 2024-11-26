<script lang="ts">
    import { onMount } from 'svelte';
    import { globalFont } from "../stores/Fonts";

    let searchQuery: string = '';
    let fonts: { family: string; category: string }[] = [];
    let isOpen = false;
    let filteredFonts: { family: string; category: string }[] = [];
    
    
    async function fetchGoogleFonts() {
        const fontresponse = await fetch(`/api/fonts`);
        const resp = await fontresponse.json()
        fonts = resp.fonts
        updateFilteredFonts();
    }
    
    function updateFilteredFonts() {
        if (!searchQuery) {
            filteredFonts = fonts;
        } else {
            filteredFonts = fonts.filter(font => 
                font.family.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    }
    
    function selectFont(font: { family: string, category: string }) {
        globalFont.set(font);
        console.log($globalFont) // Update global store
        isOpen = false;
        searchQuery = '';
        updateFilteredFonts();
    }
    
    function selectRandomFont() {
        const randomIndex = Math.floor(Math.random() * fonts.length);
        selectFont(fonts[randomIndex]);
    }
    
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dropdown = document.querySelector('.font-dropdown');
        if (dropdown && !dropdown.contains(target)) {
            isOpen = false;
        }
    }
    
    // Update filtered fonts when search query changes
    $: searchQuery, updateFilteredFonts();
    
    onMount(() => {
        fetchGoogleFonts();
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="font-dropdown relative w-64">
    <button
        class="w-full px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => isOpen = !isOpen}
    >
        {$globalFont.family}
    </button>
    
    {#if isOpen}
        <div class="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
            <div class="p-2">
                <input
                    type="text"
                    placeholder="Search fonts..."
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={searchQuery}
                />
                <button
                    class="w-full mt-2 px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    on:click={selectRandomFont}
                >
                    Random Font
                </button>
            </div>
            
            <div class="max-h-60 overflow-y-auto">
                {#each filteredFonts as font}
                    <button
                        class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        style="font-family: '{font.family}'"
                        on:click={() => selectFont(font)}
                    >
                        {font.family} ({font.category})
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>