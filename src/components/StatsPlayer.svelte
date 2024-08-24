<script> 
    export let orientation;
    export let playerData;
    export let colorData;
    export let agentData; 
</script>

<style>
    :root {
      --aspect-ratio: calc(114px / 490px); /* Adjust this value based on your original aspect ratio */
    }
</style>

<div class="flex w-full h-1/4" style="background-color: {colorData.bg};">
    {#if orientation == "left"}
        <!-- This should be the agent background -->
        <div class="flex relative bg-black w-[25%] h-full justify-center items-center overflow-hidden">
            <img class="object-cover h-full w-full" src={agentData[playerData.agent].displayIcon} alt={playerData.agent}>
            <div class="absolute inset-0">
                <img class="absolute bottom-0 right-0 flex items-center z-10 w-[25%] h-[22%]" style="background-color: {colorData.bg}" src={agentData[playerData.agent].roleIcon} alt={agentData[playerData.agent].role}>
            </div>
        </div>
        <div class="w-full grid grid-cols-2">
            <div class="pl-5 align-text-bottom content-end"> 
                <div class="text-l" style="color: {colorData.smalltext}"> {playerData.agent.toUpperCase()} </div>
                <div class="text-2xl" style="color: {colorData.text}"> {playerData.name.toUpperCase()} </div>
            </div>

            <div class="pr-5 align-text-bottom content-center grid"> 
                <div class="text-right text-4xl mb-5" style="color: {colorData.text}">{playerData.kills}/{playerData.deaths}</div>
                <div class="text-right text-4xl" style="color: {colorData.text}">{playerData.acs}</div>
            </div>
        </div>
    {/if}
    {#if orientation == "right"}
    <!-- This should be the agent background -->
    <div class="w-full grid grid-cols-2"> 
        <div class="pl-5 align-text-bottom content-center grid"> 
            <div class="text-left text-4xl mb-5" style="color: {colorData.text}">{playerData.kills}/{playerData.deaths}</div>
            <div class="text-left text-4xl" style="color: {colorData.text}">{playerData.acs}</div>
        </div>

        <div class="pr-5 align-text-bottom content-end"> 
            <div class="text-right text-l" style="color: {colorData.smalltext}"> {playerData.agent.toUpperCase()} </div>
            <div class="text-right text-2xl" style="color: {colorData.text}"> {playerData.name.toUpperCase()} </div>
        </div>


    </div>
    <div class="flex relative bg-black w-[25%] h-full justify-center items-center overflow-hidden">
        <img class="object-cover h-full min-w-full" src={agentData[playerData.agent].displayIcon} alt={playerData.agent}>
        <div class="absolute inset-0">
            <img class="absolute bottom-0 left-0 flex items-center z-10 w-[25%] h-[22%]" style="background-color: {colorData.bg}" src={agentData[playerData.agent].roleIcon} alt={agentData[playerData.agent].role}>
        </div>
    </div>
{/if}
</div>

