<script> 
    export let orientation;
    export let playerData;
    export let colorData; 
</script>

<div class="flex w-[486px] h-[114px] mb-[13.5px]"  style="background-color: {colorData.bg};">
    {#if orientation == "left"}
        <!-- This should be the agent background -->
        <div class="flex relative bg-black w-[114px] h-[114px] justify-center items-center">
            <img src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" alt="Gekko">
            <div class="absolute inset-0">
                <img class="absolute bottom-0 right-0 flex items-center z-10 w-[25px] h-[25px]" style="background-color: {colorData.bg}" src="https://media.valorant-api.com/agents/roles/1b47567f-8f7b-444b-aae3-b0c634622d10/displayicon.png" alt="Role">
            </div>
        </div>
        <div class="w-[371px] grid grid-cols-2"> 
            <div class="pl-5 align-text-bottom content-end"> 
                <div class="text-l" style="color: {colorData.smalltext}"> {playerData.agent.toUpperCase()} </div>
                <div class="text-4xl" style="color: {colorData.text}"> {playerData.name.toUpperCase()} </div>
            </div>

            <div class="pr-5 align-text-bottom content-center grid"> 
                <div class="text-right text-4xl mb-5" style="color: {colorData.text}">{playerData.kills}/{playerData.deaths}</div>
                <div class="text-right text-4xl" style="color: {colorData.text}">{playerData.acs}</div>
            </div>

        </div>
    {/if}
    {#if orientation == "right"}
    <!-- This should be the agent background -->
    <div class="w-[371px] grid grid-cols-2"> 
        <div class="pl-5 align-text-bottom content-center grid"> 
            <div class="text-left text-4xl mb-5" style="color: {colorData.text}">{playerData.kills}/{playerData.deaths}</div>
            <div class="text-left text-4xl" style="color: {colorData.text}">{playerData.acs}</div>
        </div>

        <div class="pr-5 align-text-bottom content-end"> 
            <div class="text-right text-l" style="color: {colorData.smalltext}"> {playerData.agent.toUpperCase()} </div>
            <div class="text-right text-4xl" style="color: {colorData.text}"> {playerData.name.toUpperCase()} </div>
        </div>


    </div>
    <div class="flex relative bg-black w-[114px] h-[114px] justify-center items-center">
        <img src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png" alt="Gekko">
        <div class="absolute inset-0">
            <img class="absolute bottom-0 left-0 flex items-center z-10 w-[25px] h-[25px]" style="background-color: {colorData.bg}" src="https://media.valorant-api.com/agents/roles/1b47567f-8f7b-444b-aae3-b0c634622d10/displayicon.png" alt="Role">
        </div>
    </div>
{/if}
</div>

