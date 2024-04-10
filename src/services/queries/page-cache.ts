import { client } from '$services/redis';
import { pageCacheKey } from '$services/keys';

const cacheRoutes = ['/about', '/orivacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string) => {
	if (cacheRoutes.includes(route)) {
		return client.get(pageCacheKey(route));
	}
};

export const setCachedPage = (route: string, page: string) => {
	if (cacheRoutes.includes(route)) {
		return client.set(pageCacheKey(route), page, {
			EX: 2
		});
	}
};
