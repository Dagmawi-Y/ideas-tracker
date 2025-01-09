import { getIdeas } from '$lib/ideas';
import { account } from '$lib/appwrite';

export async function load() {
	try {
		await account.get();
		return {
			ideas: await getIdeas()
		};
	} catch (error) {
		return {
			ideas: { total: 0, documents: [] }
		};
	}
}
