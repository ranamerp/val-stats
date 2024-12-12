<script lang='ts'>
   import Stats from "../../../components/Stats.svelte";
   export let data;
</script>

<div>
   {#await data}
      <p> Loading... </p>
   {:then resp}
      <Stats 
         playerData={resp?.match}
         colors = {resp.preset}
      />
   {:catch error}
      <p>Error: {error.message}</p>
   {/await}
</div>