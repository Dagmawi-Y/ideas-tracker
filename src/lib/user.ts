import { writable } from 'svelte/store';
import { ID, Account } from 'appwrite';
import { goto } from '$app/navigation';
import { account } from './appwrite';

interface User {
	$id: string;
	name: string;
	email: string;
	emailVerification: boolean;
	status: boolean;
}

const isBrowser = typeof window !== 'undefined';

const createUser = () => {
	const store = writable<User | null>(null);

	async function init() {
		if (!isBrowser) return;
		try {
			store.set(await account.get());
		} catch (e) {
			store.set(null);
		}
	}

	init();

	async function register(email: string, password: string, name: string) {
		if (!isBrowser) return;
		await account.create(ID.unique(), email, password, name);
		await login(email, password);
	}

	async function login(email: string, password: string) {
		if (!isBrowser) return;
		await account.createEmailPasswordSession(email, password);
		await init();
	}

	async function loginWithGoogle() {
		if (!isBrowser) return;
		const redirectUrl = window.location.origin;
		// @ts-ignore - Appwrite types are not up to date
		await account.createOAuth2Session('google', redirectUrl);
	}

	async function logout() {
		if (!isBrowser) return;
		await account.deleteSession('current');
		store.set(null);
		goto('/login');
	}

	return {
		subscribe: store.subscribe,
		register,
		login,
		loginWithGoogle,
		logout,
		init
	};
};

export const user = createUser();
