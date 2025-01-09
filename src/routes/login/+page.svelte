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

	const login = async (e: SubmitEvent) => {
		e.preventDefault();
		loading = true;
		error = '';
		
		try {
			const formData = new FormData(e.target as HTMLFormElement);
			await user.login(
				formData.get('email') as string,
				formData.get('password') as string
			);
			goto('/');
		} catch (e) {
			error = 'Invalid email or password';
		}
		loading = false;
	};

	const register = async (e: SubmitEvent) => {
		e.preventDefault();
		loading = true;
		error = '';
		
		try {
			const formData = new FormData(e.target as HTMLFormElement);
			await user.register(
				formData.get('email') as string,
				formData.get('password') as string,
				formData.get('name') as string
			);
			goto('/');
		} catch (e) {
			error = 'Registration failed. Please try again.';
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
		class="w-full max-w-md space-y-8"
	>
		{#if error}
			<div 
				in:fly={{ y: -10, duration: 300 }}
				class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center"
			>
				{error}
			</div>
		{/if}

		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
			<div class="text-center">
				<h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
					Login
				</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-300">
					Sign in to share your innovative ideas
				</p>
			</div>

			<form on:submit={login} class="space-y-4">
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Email
						<input 
							type="email" 
							name="email" 
							required
							placeholder="your@email.com"
							class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
						/>
					</label>
				</div>
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
						<input 
							type="password" 
							name="password" 
							required
							placeholder="••••••••"
							class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
						/>
					</label>
				</div>
				<button 
					type="submit"
					disabled={loading}
					class="w-full px-6 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
				>
					{#if loading}
						<span class="inline-block animate-spin mr-2">⟳</span>
					{/if}
					Sign In
				</button>
			</form>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 mt-6">
			<div class="text-center">
				<h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
					New Here?
				</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-300">
					Create an account to get started
				</p>
			</div>

			<form on:submit={register} class="space-y-4">
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Name
						<input 
							type="text" 
							name="name" 
							required
							placeholder="Your name"
							class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
						/>
					</label>
				</div>
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Email
						<input 
							type="email" 
							name="email" 
							required
							placeholder="your@email.com"
							class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
						/>
					</label>
				</div>
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
						<input 
							type="password" 
							name="password" 
							required
							minlength="8"
							placeholder="••••••••"
							class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
						/>
					</label>
				</div>
				<button 
					type="submit"
					disabled={loading}
					class="w-full px-6 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
				>
					{#if loading}
						<span class="inline-block animate-spin mr-2">⟳</span>
					{/if}
					Create Account
				</button>
			</form>
		</div>
	</div>
</div>
