import { Client, Databases, Account } from 'appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('677fb4260027182dcecb');

export const account = new Account(client);
export const databases = new Databases(client);
