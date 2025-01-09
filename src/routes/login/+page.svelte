<script lang="ts">
	import { user } from '$lib/user';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let error = '';
	let loading = false;

	onMount(() => {
		if ($user) {
			goto('/');
		}
	});

	const login = async () => {
		loading = true;
		error = '';
		try {
			await user.loginWithGoogle();
			goto('/');
		} catch (e) {
			error = 'Failed to login. Please try again.';
		}
		loading = false;
	};
</script>

<div 
	in:fade={{ duration: 300 }}
	class="min-h-[80vh] flex flex-col items-center justify-center"
>
	<div 
		in:fly={{ y: 20, duration: 300, delay: 150 }}
		class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-8"
	>
		<div class="text-center">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
				Welcome Back
			</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-300">
				Sign in to share your innovative ideas
			</p>
		</div>

		{#if error}
			<div 
				in:fly={{ y: -10, duration: 300 }}
				class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center"
			>
				{error}
			</div>
		{/if}

		<button
			on:click={login}
			disabled={loading}
			class="w-full flex items-center justify-center gap-3 px-6 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
		>
			{#if loading}
				<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{:else}
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
				</svg>
			{/if}
			Sign in with Google
		</button>

		<p class="text-sm text-center text-gray-500 dark:text-gray-400">
			By signing in, you agree to our terms and conditions.
		</p>
	</div>
</div>
