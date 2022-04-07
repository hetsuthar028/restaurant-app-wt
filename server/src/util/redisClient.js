const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

module.exports =  redisClient;