const redis = require("redis");

const redisClient = redis.createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

redisClient.connect()
    .then(() => {
        console.log("Connected to Redis");
    })
    .catch((err) => {
        console.log("Redis connection failed:", err);
    });

module.exports = redisClient;