const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient({
    host: "redis",
    password: process.env.REDIS_PASSWORD
});

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redisClient;
