<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Idea } from '$lib/ideas';
	import { formatDate } from '$lib/utils';

	export let idea: Idea;
	export let onClose: () => void;
</script>

<div 
	class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
	on:click={onClose}
	in:fade={{ duration: 200 }}
>
	<div
		class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl"
		on:click|stopPropagation
		in:fly={{ y: 20, duration: 300 }}
	>
		<div class="p-6 space-y-4">
			<div class="flex justify-between items-start">
				<div>
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
						{idea.title}
					</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Posted by {idea.userName} on {formatDate(idea.$createdAt)}
					</p>
				</div>
				<button
					on:click={onClose}
					class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="prose dark:prose-invert max-w-none">
				<p class="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
					{idea.description || 'No description provided.'}
				</p>
			</div>

			<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
				<span class={idea.isPublic ? 'text-green-500' : 'text-yellow-500'}>
					{#if idea.isPublic}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
							<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
						</svg>
						Public
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
						</svg>
						Private
					{/if}
				</span>
			</div>
		</div>
	</div>
</div> 