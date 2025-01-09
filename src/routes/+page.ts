import { getIdeas } from '$lib/ideas';
import { user } from '$lib/user';
import { get } from 'svelte/store';

export async function load() {
	const currentUser = get(user);
	return {
		ideas: await getIdeas(currentUser?.$id)
	};
}
