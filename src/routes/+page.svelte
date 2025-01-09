<script lang="ts">
    // @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import { addIdea, deleteIdea } from '$lib/ideas.js';
	import { user } from '$lib/user.js';
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let data;

	const add = async (e: SubmitEvent) => {
		e.preventDefault();
		const formEl = e.target as HTMLFormElement;
		const formData = new FormData(formEl);
		await addIdea($user.$id, formData.get('title') as string, formData.get('description') as string);
		invalidateAll();
		formEl.reset();
	};

	const remove = async (id: string) => {
		await deleteIdea(id);
		invalidateAll();
	};
</script>

{#if $user}
	<section in:fly={{ y: 20, duration: 300, delay: 300 }} class="mb-12">
		<h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Submit Your Idea</h2>
		<form on:submit={add} class="space-y-4 max-w-2xl">
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Title
					<input 
						type="text" 
						placeholder="What's your brilliant idea?" 
						name="title" 
						required
						class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
					/>
				</label>
			</div>
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Description
					<textarea 
						placeholder="Tell us more about your idea..." 
						name="description"
						rows="4"
						class="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none"
					></textarea>
				</label>
			</div>
			<button 
				type="submit"
				class="w-full px-6 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
			>
				Share Idea
			</button>
		</form>
	</section>
{:else}
	<section 
		in:fly={{ y: 20, duration: 300, delay: 300 }}
		class="mb-12 p-8 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-2xl text-center"
	>
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Join Our Community of Innovators</h2>
		<p class="text-gray-600 dark:text-gray-300 mb-6">Login to share your ideas and connect with others.</p>
		<a 
			href="/login"
			class="inline-block px-6 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all"
		>
			Get Started
		</a>
	</section>
{/if}

<section in:fly={{ y: 20, duration: 300, delay: 450 }}>
	<h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Latest Ideas</h2>
	
	{#if data.ideas.total === 0}
		<div class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
			<p class="text-gray-600 dark:text-gray-300">No ideas yet. Be the first to share one!</p>
		</div>
	{:else}
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{data.ideas.total} ideas shared</p>
		<div class="grid gap-6">
			{#each data.ideas.documents as idea (idea.$id)}
				<div
					animate:flip={{ duration: 300 }}
					in:scale={{ duration: 300, delay: 300 }}
					class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
				>
					<div class="flex justify-between items-start mb-4">
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{idea.title}</h3>
						{#if $user && $user.$id === idea.userId}
							<button
								on:click={() => remove(idea.$id)}
								class="text-gray-400 hover:text-red-500 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
								</svg>
							</button>
						{/if}
					</div>
					<p class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.description || 'No description provided.'}</p>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	section {
		margin-bottom: 3rem;
	}
	form {
		display: grid;
		gap: 0.75rem;
	}
	label {
		display: grid;
		gap: 0.25rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		border-radius: 0.5rem;
		border: 2px dashed pink;
		min-width: 20%;
		padding: 1rem;
		margin-bottom: 1rem;
	}
</style>
