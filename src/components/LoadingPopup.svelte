<script lang="ts">
    export let showPopup: boolean = false;
    export let message: string = "Loading...";
</script>
  
  {#if showPopup}
    <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div class="bg-gray-500 bg-opacity-50 w-full h-full absolute"></div>
      <div class="bg-white p-4 rounded-lg">
        <p class="text-center text-black">{message}</p>
      </div>
    </div>
  {/if}