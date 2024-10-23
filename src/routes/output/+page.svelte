<script>
import Stats from "../../components/Stats.svelte";
import { selectedmatch } from "../../stores/SelectedMatch.js"

// TODO: Add return button, make sure stats is cached or soemthing liek that.
</script>

<div> 
   <Stats 
      playerData={$selectedmatch.match}
      colors = {$selectedmatch.colors}
   />
</div>