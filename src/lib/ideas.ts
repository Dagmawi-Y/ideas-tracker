// @ts-nocheck

import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';

const IDEAS_DATABASE_ID = '677fba460023fb6cf7df';
const IDEAS_COLLECTION_ID = 'ideas';

export interface Idea {
	$id: string;
	$createdAt: string;
	userId: string;
	userName: string;
	title: string;
	description: string;
	isPublic: boolean;
}

interface IdeasResponse {
	total: number;
	documents: Idea[];
}

const emptyResponse: IdeasResponse = {
	total: 0,
	documents: []
};

export async function getIdeas(userId?: string): Promise<IdeasResponse> {
	try {
		const queries = [Query.orderDesc('$createdAt')];

		// If viewing as a specific user, show all their ideas plus public ideas from others
		if (userId) {
			queries.push(Query.equal('isPublic', true));
			queries.push(Query.notEqual('userId', userId));
		}

		const response = await databases.listDocuments(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, queries);

		// If viewing as a user, also get their private ideas
		if (userId) {
			try {
				const userIdeas = await databases.listDocuments(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, [
					Query.equal('userId', userId)
				]);

				// Combine and sort by creation date
				const allIdeas = [...response.documents, ...userIdeas.documents];
				allIdeas.sort(
					(a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
				);

				return {
					...response,
					documents: allIdeas
				};
			} catch (e) {
				// If getting user's private ideas fails, just return public ones
				return response;
			}
		}

		return response;
	} catch (error: any) {
		if (error?.type === 'collection_not_found') {
			return emptyResponse;
		}
		throw error;
	}
}

export async function getIdea(id: string) {
	try {
		return await databases.getDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
	} catch (error: any) {
		if (error?.type === 'collection_not_found') {
			return null;
		}
		throw error;
	}
}

export async function addIdea(
	userId: string,
	userName: string,
	title: string,
	description: string,
	isPublic: boolean
) {
	try {
		await databases.createDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, ID.unique(), {
			userId,
			userName,
			title,
			description,
			isPublic
		});
	} catch (error: any) {
		if (error?.type === 'collection_not_found') {
			throw new Error('Ideas collection not set up. Please contact administrator.');
		}
		throw error;
	}
}

export async function deleteIdea(id: string) {
	try {
		await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
	} catch (error: any) {
		if (error?.type === 'collection_not_found') {
			return; // If collection doesn't exist, consider delete successful
		}
		throw error;
	}
}

export async function updateIdea(id: string, data: Partial<Idea>) {
	try {
		await databases.updateDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id, data);
	} catch (error: any) {
		if (error?.type === 'collection_not_found') {
			throw new Error('Ideas collection not set up. Please contact administrator.');
		}
		throw error;
	}
}
