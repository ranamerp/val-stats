<script lang='ts'>
   import Stats from "../../../components/Stats.svelte";
   export let data;
</script>

<div class="flex min-h-screen max-h-screen justify-center">
   {#if data?.match && data?.preset}
       <Stats 
           playerData={data.match}
           colors={data.preset}
       />
   {:else}
       <p>Loading...</p>
   {/if}
</div>