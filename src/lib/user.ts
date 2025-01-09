import { writable } from 'svelte/store';
import { ID } from 'appwrite';
import { goto } from '$app/navigation';
import { account } from './appwrite';

const isBrowser = typeof window !== 'undefined';

const createUser = () => {
	const store: any = writable(null);

	async function init() {
		if (!isBrowser) return;
		try {
			store.set(await account.get());
		} catch (e) {
			store.set(null);
		}
	}

	init();

	async function register(email: any, password: any, name: any) {
		if (!isBrowser) return;
		await account.create(ID.unique(), email, password, name);
		await login(email, password);
	}

	async function login(email: any, password: any) {
		if (!isBrowser) return;
		await account.createEmailPasswordSession(email, password);
		await init();
		goto('/'); // Redirect to home page after login
	}

	async function logout() {
		await account.deleteSession('current');
		store.set(null);
	}

	return {
		subscribe: store.subscribe,
		register,
		login,
		logout,
		init
	};
};
export const user = createUser();
