<script lang="ts">
    import { fade } from 'svelte/transition';
    export let message: string;
</script>

{#if message}
    <div class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
        {message}
    </div>
{/if}