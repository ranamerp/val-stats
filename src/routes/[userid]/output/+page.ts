import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';

export const load: PageLoad = async ({ params, parent }) => {
    // This retrieves the Supabase client from the parent layout
   const { supabase } = await parent();
   try {
      const { data, error } = await supabase
         .schema('stats')
         .from('users')
         .select('user_id, current_preset, current_match')
         .or(
         params.userid.includes('-') 
            ? `user_id.eq."${params.userid}"` 
            : `provider_username.eq.${params.userid},provider_id.eq.${params.userid}`
         );

      if (error) {
         console.error(error);
         return { status: 500, hideHeader: true };
      }

      // Assuming data is an array and you want the first matching record
      if (data && data.length > 0) {
         const firstRecord = data[0];
         
         if (browser) {
            const channel = supabase
               .channel('schema-db-changes')
               .on(
                  'postgres_changes',
                  {
                     event: 'UPDATE',
                     schema: 'stats',
                     table: 'users',
                     filter: `user_id=eq.${firstRecord.user_id}`
                  },
                  async (payload) => {
                     console.log('Change received!', payload);
                     await invalidate('app:data');
                  }
               )
               .subscribe();

            // Cleanup function
            return {
               status: 200,
               match: firstRecord.current_match,
               preset: firstRecord.current_preset,
               hideHeader: true,
               destroy: () => {
                     supabase.removeChannel(channel);
               }
            };
         }
      }

        // No matching record found
        return { status: 404, hideHeader: true  };
     } catch (error) {
        console.error(error);
        return { status: 500, hideHeader: true  };
     }

  }