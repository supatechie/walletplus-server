import cacheManager from 'cache-manager';
import Promise from 'es6-promise'
const memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10/*seconds*/,promiseDependency: Promise.Promise});
export default memoryCache