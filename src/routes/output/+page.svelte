<script lang='ts'>
import Stats from "../../components/Stats.svelte";
import { selectedmatch } from "../../stores/SelectedMatch"

// TODO: Add return button, make sure stats is cached or soemthing liek that.
</script>

<div> 
   <Stats 
      playerData={$selectedmatch.match}
      colors = {$selectedmatch.colors}
   />
</div>