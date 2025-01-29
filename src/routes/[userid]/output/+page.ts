import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';

export const load: PageLoad = async ({ params, parent }) => {
  const { supabase } = await parent();
  
  try {
    const { data: userData, error } = await supabase
      .schema('stats')
      .from('users')
      .select('user_id, current_preset, current_match')
      .or(params.userid.includes('-') 
        ? `user_id.eq.${params.userid}` 
        : `provider_username.eq.${params.userid},provider_id.eq.${params.userid}`
      )
      .single();

    if (error) throw error;

    if (browser) {
      console.log('Subscribing to changes for user:', userData.user_id);
      
      const channel = supabase
        .channel(`user:${userData.user_id}`) // Unique channel name
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'stats',
            table: 'users',
            filter: `user_id=eq.${userData.user_id}` // Add quotes if string/UUID
          },
          (payload) => {
            console.log('Realtime update:', payload.new);
            window.location.reload(); // Soft refresh instead of reload
          }
        )
        .subscribe();

      return {
        match: userData.current_match,
        preset: userData.current_preset,
        hideHeader: true,
        destroy: () => {
          supabase.removeChannel(channel);
        }
      };
    }

    return {
      match: userData.current_match,
      preset: userData.current_preset,
      hideHeader: true
    };

  } catch (error) {
    console.error(error);
    return { status: 500, hideHeader: true };
  }
};