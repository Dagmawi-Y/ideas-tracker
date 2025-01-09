// @ts-nocheck

import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';

const IDEAS_DATABASE_ID = '677fba460023fb6cf7df';
const IDEAS_COLLECTION_ID = 'ideas';

export async function getIdeas() {
	return await databases.listDocuments(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, [
		Query.orderDesc('$createdAt')
	]);
}

export async function addIdea(userId, title, description) {
	await databases.createDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, ID.unique(), {
		userId,
		title,
		description
	});
}

export async function deleteIdea(id) {
	await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
}
