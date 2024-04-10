import { itemsByViewsKey, itemsKey, itemsViewsKey } from '$services/keys';
import { client } from '$services/redis';

export const incrementView = async (itemId: string, userId: string) => {
	// const inserted = await client.pfAdd(itemsViewsKey(itemId), userId);

	// if (inserted) {
	// 	return Promise.all([
	// 		client.hIncrBy(itemsKey(itemId), 'views', 1),
	// 		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	// 	]);
	// }

	return client.incrementView(itemId, userId);
};

// Keys I need to access
// 1) itemsViewsKey
// 2) itemsKey
// 3) itemsByViewsKey

// Arguments I need to accept
// 1) itemId
// 2) userId

// EVALSHA ID 3
