<script lang='ts'>
   import Stats from "../../../components/Stats.svelte";
   import { selectedmatch } from "../../../stores/SelectedMatch"
   import { page } from '$app/stores'
   import { getContext } from "svelte";

   const userid = $page.params.userid
   const supabase: any = getContext('supabase')

   //Make sure page is reactive
   async function getData(userid: string) {
      const { data, error } = await supabase
         .schema('auth')
         .from('identities')
         .select('user_id')
      console.log(userid)
      console.log(data)
      console.log(error)


   }

   getData(userid)




   

// TODO: 
// - Remove Layout header on this page
// - Figure out schema and table name for this data
// - Be able to look up both display names, ids, and more
// - Get data from supabase and use it to populate the stats page
</script>

<div> 
   <!-- <Stats 
      playerData={$selectedmatch.match}
      colors = {$selectedmatch.colors}
   /> -->
</div>