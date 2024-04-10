import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usernamesKey, usernamesUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	// Use the username argument to look up the persons User ID
	// with the usernames sorted set
	const decimalId = await client.zScore(usernamesKey(), username);

	// make sure we actuall got an ID from the lookup
	if (!decimalId) {
		throw new Error('User does not exist');
	}

	// Take the id and convert it back to hex
	const id = decimalId.toString(16);
	// Use the id to look up the user's hash
	const user = await client.hGetAll(usersKey(id));

	// deserialize and return the hash
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId(); // id is a string represents a number encoded in hexadecimal.

	// See if the username is already in the set of usernames
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	// If so, throw an error.
	if (exists) {
		throw new Error('Usernname is taken.');
	}
	// Otherwise, continue.

	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});

	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
