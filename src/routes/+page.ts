import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth')
  
    const supabase = isBrowser()
      ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
          global: {
            fetch,
          },
        })
      : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
          global: {
            fetch,
          },
          cookies: {
            getAll() {
              return data.cookies
            },
          },
        })
  
    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Match fetching logic
    const region = 'na';
    let name: string = 'kaoticcc';
    const tag = '555';

    const matchResponse = await fetch(`/api/match?region=${region}&name=${name}&tag=${tag}`);
    let matchData: App.APIResponse = {
        status: 500,
        data: []
    };

    if (matchResponse.status === 500) {
        const refResponse = await fetch('ref.json');
        matchData = await refResponse.json();
        name = 'sen z#5193';
    } else {
        matchData = await matchResponse.json();
    }

    return { 
        session, 
        supabase, 
        user,
        stats: matchData.data,
        player: name }
  }
