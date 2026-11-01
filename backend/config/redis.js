
const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

redisClient.connect()
    .then(() => {
        console.log("Connected to Upstash Redis");
    })
    .catch((err) => {
        console.log("Redis connection failed:", err);
    });

module.exports = redisClient;
