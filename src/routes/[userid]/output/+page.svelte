<script lang='ts'>
   import Stats from "../../../components/Stats.svelte";
   export let data;

   
</script>

<div class="flex justify-center">
   {#await data}
      <p> Loading... </p>
   {:then resp}
      {#if resp?.match && resp?.preset}
         <Stats 
            playerData={resp?.match}
            colors = {resp.preset}
         />
      {/if}
   {:catch error}
      <p>Error: {error.message}</p>
   {/await}
</div>