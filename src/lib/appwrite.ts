import { Client, Databases, Account, ID } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

export const IDEAS_DATABASE_ID = '677fba460023fb6cf7df';
export const IDEAS_COLLECTION_ID = 'ideas';

const client = new Client();
client.setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export async function initializeAppwrite() {
	try {
		// Try to get the collection, create if it doesn't exist
		try {
			await databases.listDocuments(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID);
		} catch (error: any) {
			if (error?.type === 'collection_not_found') {
				// Create collection with required attributes
				const data = {
					documentSecurity: false,
					name: 'Ideas Collection',
					permissions: ['read("any")', 'write("any")'],
					attributes: [
						{
							key: 'userId',
							type: 'string',
							size: 255,
							required: true,
							array: false,
							default: null
						},
						{
							key: 'userName',
							type: 'string',
							size: 255,
							required: true,
							array: false,
							default: null
						},
						{
							key: 'title',
							type: 'string',
							size: 255,
							required: true,
							array: false,
							default: null
						},
						{
							key: 'description',
							type: 'string',
							size: 65535,
							required: true,
							array: false,
							default: null
						},
						{
							key: 'isPublic',
							type: 'boolean',
							required: true,
							array: false,
							default: false
						}
					],
					indexes: [
						{
							key: 'userId_index',
							type: 'key',
							attributes: ['userId']
						},
						{
							key: 'isPublic_index',
							type: 'key',
							attributes: ['isPublic']
						}
					]
				};

				await fetch(`${PUBLIC_APPWRITE_ENDPOINT}/v1/databases/${IDEAS_DATABASE_ID}/collections`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Appwrite-Project': PUBLIC_APPWRITE_PROJECT_ID,
						'X-Appwrite-Response-Format': '1.0.0'
					},
					body: JSON.stringify(data)
				});
			} else {
				throw error;
			}
		}
	} catch (error) {
		console.error('Failed to initialize Appwrite:', error);
		throw error;
	}
}
