<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores';
    import { on } from 'svelte/events';
	const { data: propsData, children } = $props();
    const { supabase, session, user } = propsData;
	let optionMenu = $state(false);

	
	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			// I'm keeping this commented out, but we probably need to figure out auth states properly
			// We need to be able to have short sessions (aka log them back in after a while) while still being able to load a site without a session
			// if (!newSession) {
			// 	/**
			// 	 * Queue this as a task so the navigation won't prevent the
			// 	 * triggering function from completing
			// 	 */
			// 	setTimeout(() => {
			// 		goto('/', { invalidateAll: true });
			// 	});
			// }
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

	function signInWithRiot() {
		// Redirect to your Riot OAuth server route
		goto('/auth/login/riot');
	}


	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Sign out error', error.message);
		//Once sign out is done need to refresh page
		location.reload();
	}

</script>

<div class="min-h-screen flex flex-col">
	{#if !$page.data.hideHeader}
  		<header class="bg-gray-500 flex items-center justify-between p-1 shadow-md">
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

		<button
			type="submit" 
			class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
			onclick={signOut}
		>
		  Logout
		</button>

		  <div class="relative">
			<img 
			  src={user.user_metadata.avatar_url} 
			  alt="User Profile" 
			  class="w-11 h-11 rounded-full border-2 border-gray-300 hover:border-blue-600 transition cursor-pointer"
			/>
		  </div>
		</div>
	{:else}
		<div class = "flex flex-row gap-x-3">
			{#if optionMenu}
				<div class="bg-[#f12b15] text-white hover:bg-[#a41d0e] rounded-md px-4">
					<button 
						class="w-full text-left p-2 rounded-md transition"
						onclick={signInWithRiot}>
					Riot
					</button>
				</div>
				
				<div class=" bg-[#7289DA] text-white hover:bg-[#5768a6] rounded-md px-4">
					<button 
						class="w-full text-left p-2 rounded-md transition"
						onclick={signInWithDiscord}>
					Discord
					</button>
				</div>

			{/if}
			<button
				type="submit" 
				class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
				onclick={() => {
					optionMenu = !optionMenu;
					console.log('Login button clicked, optionMenu:', optionMenu);
					}
				}
				>
				Login
			</button>

		</div>
	{/if}
	</div>
  		</header>

  	{/if}
	<main class="flex-1 overflow-hidden">
		{@render children()}
	</main>
	{#if !$page.data.hideHeader}
	<footer class="flex flex-row bg-gray-800 text-white text-center p-4">
		<a href="/tos" class="ml-auto hover:text-gray-400">Terms of Service</a>
		<a href="/privacy" class="ml-4 hover:text-gray-400">Privacy Policy</a>
	</footer>
	{/if}
</div>