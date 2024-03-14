<script>

    import StatsPlayer from "./StatsPlayer.svelte";
    let left=true

</script>

<main>
    <div class="h-screen grid grid-cols-2 grid-rows-3 gap-2">
        <div class="flex flex-row col-span-2 bg-green-500">
            <div class="m-10 flex flex-col flex-auto"> 
                <div class="text-7xl flex-col-1">DTL </div>
                <div class="text-3xl flex">Loss </div> 
            </div> 
            <div class="teamLogo">
                <img src="https://owcdn.net/img/65207bdae3e06.png" alt="ur mom" width="200" height="200">
            </div>
            <div class="m-10 text-9xl text-right"> 3 </div>
        </div>
        
        <div class="flex flex-row col-span-2 bg-red-500">
            <div class="flex flex-col flex-auto">
                <div class="my-8 w-5/12 text-black text-6xl text-center bg-yellow-200"> MVP </div>
                <div class="mx-5 pt-9 text-3xl">Reyna</div>
                <div class="mx-5 text-6xl">Wildfire</div>
            </div>
            <div class="flex">
                <img class="object-contain " src="https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png" alt="ur mom">
            </div>
            <div class="mx-10 text-5xl flex flex-col flex-auto">
                <div class="my-5 text-right">7/16</div>
                <div class="my-5 text-right">148</div>
                <div class="my-5 text-right">2</div>
            </div>
        </div>
        
    
        <div class="flex bg-yellow-500 overflow-hidden">
            <img class="scale-150" src="https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png" alt="ur mom">
        </div>
            <!--This probably needs a for loop, but for now I'm sticking with just putting 1-->
        <div class="flex flex-col bg-blue-500">
            <StatsPlayer/>
            <StatsPlayer/>
            <StatsPlayer/>
            <StatsPlayer/>
            <StatsPlayer/>
    
    </div>
        


</main>