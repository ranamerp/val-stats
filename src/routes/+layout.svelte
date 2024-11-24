<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
    import { getTableName } from 'drizzle-orm';

	const {data: propsData, children} = $props();

	const { supabase, session } = propsData;


	async function signInWithDiscord() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
        })
    }

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div>
	Hello {propsData.user?.user_metadata.full_name ?? "Name"}
	<button type="submit" onclick={signInWithDiscord} class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Login with Discord</button>
</div>

{@render children()}
