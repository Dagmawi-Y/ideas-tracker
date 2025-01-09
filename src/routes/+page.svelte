<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { addIdea, deleteIdea } from '$lib/ideas.js';
	import type { Idea } from '$lib/ideas.js';
	import { user } from '$lib/user.js';
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import IdeaModal from '$lib/components/IdeaModal.svelte';
	import { formatDate } from '$lib/utils';

	export let data;

	let selectedIdea: Idea | null = null;
	let isPublic = true;
	let error = '';

	const add = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		
		try {
			const formEl = e.target as HTMLFormElement;
			const formData = new FormData(formEl);
			if (!$user) return;
			
			await addIdea(
				$user.$id,
				$user.name,
				formData.get('title') as string,
				formData.get('description') as string,
				isPublic
			);
			invalidateAll();
			formEl.reset();
			isPublic = true;
		} catch (e: any) {
			error = e.message || 'Failed to create idea. Please try again.';
		}
	};

	const remove = async (id: string) => {
		error = '';
		try {
			await deleteIdea(id);
			invalidateAll();
		} catch (e: any) {
			error = e.message || 'Failed to delete idea. Please try again.';
		}
	};
</script>

{#if error}
	<div 
		in:fly={{ y: -10, duration: 300 }}
		class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
	>
		{error}
	</div>
{/if}

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
			<div class="flex items-center gap-3">
				<label class="relative inline-flex items-center cursor-pointer">
					<input 
						type="checkbox" 
						bind:checked={isPublic}
						class="sr-only peer"
					>
					<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
					<span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Make Public</span>
				</label>
				{#if !isPublic}
					<span class="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
						</svg>
						Only you can see private ideas
					</span>
				{/if}
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
			{#if $user}
				<p class="text-gray-600 dark:text-gray-300">No ideas yet. Be the first to share one!</p>
			{:else}
				<p class="text-gray-600 dark:text-gray-300">
					No ideas yet. <a href="/login" class="text-purple-600 dark:text-purple-400 hover:underline">Login</a> to share your ideas!
				</p>
			{/if}
		</div>
	{:else}
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{data.ideas.total} ideas shared</p>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.ideas.documents as idea (idea.$id)}
				<div
					animate:flip={{ duration: 300 }}
					in:scale={{ duration: 300, delay: 300 }}
					class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
					on:click={() => selectedIdea = idea}
				>
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
								{idea.title}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
								by {idea.userName}
							</p>
						</div>
						{#if $user && $user.$id === idea.userId}
							<button
								on:click|stopPropagation={() => remove(idea.$id)}
								class="text-gray-400 hover:text-red-500 transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
								</svg>
							</button>
						{/if}
					</div>
					<p class="text-gray-600 dark:text-gray-300 line-clamp-3">
						{idea.description || 'No description provided.'}
					</p>
					<div class="flex items-center justify-between mt-4 text-sm">
						<span class="text-gray-500 dark:text-gray-400">
							{formatDate(idea.$createdAt)}
						</span>
						<span class={idea.isPublic ? 'text-green-500' : 'text-yellow-500'}>
							{#if idea.isPublic}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
								</svg>
							{/if}
						</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

{#if selectedIdea}
	<IdeaModal 
		idea={selectedIdea}
		onClose={() => selectedIdea = null}
	/>
{/if}

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
