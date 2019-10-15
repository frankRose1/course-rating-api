import redis from 'redis';
import bluebird from 'bluebird';
const { REDIS_URL } = process.env;

// adds "Async" to all node_redis functions
// eg client.getAsync()
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(REDIS_URL);

client.on('error', err => {
    console.log(`Error connecting to redis: ${err}`)
});

export default client;