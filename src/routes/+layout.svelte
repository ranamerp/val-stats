<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation'
	import { setContext } from 'svelte';
	const { data: propsData, children } = $props();
    const { supabase, session, user } = propsData;

	setContext('supabase', supabase);
	setContext('session', session);
	setContext('user', user);

	
	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	async function signInWithDiscord() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
        })
    }

</script>
  
  <header class="bg-gray-500 flex items-center justify-between p-4 shadow-md">
	<!-- Logo (Home Link) -->
	<a href="/" class="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md transition" aria-label="Home">
	  <svg 
		xmlns="http://www.w3.org/2000/svg" 
		width="40" 
		height="40" 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		stroke-width="2" 
		stroke-linecap="round" 
		stroke-linejoin="round" 
		class="text-gray-700"
		
	  >
		<path d="M12 8L10 12H7v4h3l2 4h1z"/>
		<path d="M15.54 11.5c.48.79.76 1.73.76 2.73 0 1.04-.29 2-.78 2.83"/>
		<path d="M17.5 8c1 1.5 1.5 3.5 1.5 5s-.5 3.5-1.5 5"/>
	  </svg>
	</a>
  
	<!-- Stats Link -->
	<a 
	  href="/" 
	  class="text-xl font-semibold text-gray-800 hover:text-gray-600 transition ml-4"
	>
	  Stats
	</a>
  
	<!-- Login/Profile Section -->
	<div class="ml-auto relative">
	  {#if user}
		<div class="flex items-center space-x-2">
		  <div class="relative">
			<img 
			  src={user.user_metadata.avatar_url} 
			  alt="User Profile" 
			  class="w-11 h-11 rounded-full border-2 border-gray-300"
			/>
		  </div>
		</div>
	  {:else}
		<button
			type="submit" 
			class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
			onclick={signInWithDiscord}
		>
		  Login
		</button>
	  {/if}
	</div>
  </header>

  {@render children()}
