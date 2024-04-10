import { itemsIndexKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const searchItems = async (term: string, size: number = 5) => {
	const cleaned = term
		.replaceAll(/[^a-zA-Z0-9 ]/g, '')
		.trim()
		.split(' ')
		.map((word) => (word ? `%${word}%` : ''))
		.join(' ');

	// Look at cleaned and make sure it is valid
	if (cleaned === '') {
		return [];
	}

	const query = `(@name:(${cleaned}) => { $weight: 5.0 }) | (@description:(${cleaned}))`;

	console.log(query);
	// Use the client to do an actual search
	const results = await client.ft.search(itemsIndexKey(), query, {
		LIMIT: {
			from: 0, // 省略前 0 个结果
			size // 返回 size 个结果
		}
	});

	console.log(results);

	// Deserialize and return the search results
	return results.documents.map(({ id, value }) => deserialize(id, value as any));
};
