<script lang="ts">
	import '../app.css';
	import { user } from '$lib/user';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
	<nav class="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-900/80 z-50">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<a href="/" class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
					IdeaSpace
				</a>
				<div class="flex items-center gap-4">
					{#if $user}
						<span class="text-sm text-gray-600 dark:text-gray-300">Hi, {$user.name}</span>
						<a href="/logout" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
							Logout
						</a>
					{:else}
						<a href="/login" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity">
							Login
						</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<main class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
		{#if mounted}
			<div in:fade={{ duration: 300, delay: 150 }}>
				<slot />
			</div>
		{/if}
	</main>
</div>

<style>
	:global(body) {
		@apply antialiased;
	}
</style>
