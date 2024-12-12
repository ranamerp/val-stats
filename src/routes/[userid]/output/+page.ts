export const load = async ({ params, parent }) => {
    // This retrieves the Supabase client from the parent layout
    const { supabase } = await parent();

    try {
        const { data, error } = await supabase
           .schema('stats')
           .from('users')
           .select('user_id, current_preset, current_match')
           .eq('provider_username', params.userid)  // Add filter for specific user

        if (error) {
           console.error(error);
           return { status: 500, hideHeader: true };
        }

        // Assuming data is an array and you want the first matching record
        if (data && data.length > 0) {
           const firstRecord = data[0];
           return {
              status: 200,
              match: firstRecord.current_match,
              preset: firstRecord.current_preset,
              hideHeader: true
           };
        }

        // No matching record found
        return { status: 404, hideHeader: true  };
     } catch (error) {
        console.error(error);
        return { status: 500, hideHeader: true  };
     }

  }