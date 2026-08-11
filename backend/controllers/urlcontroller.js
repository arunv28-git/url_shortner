const URL = require("../models/urlmodel");
const redisClient = require("../config/redis");
const crypto = require("crypto");

const storeurl = (req, res) => {
    const { originalUrl, customalias, expiresIn } = req.body;

    const shortcode =
        customalias || crypto.randomBytes(4).toString("hex");

    let expiresAt = null;

    if (expiresIn) {
        expiresAt = new Date(
            Date.now() + expiresIn * 1000
        );
    }

    URL.storeurl(
        originalUrl,
        shortcode,
        expiresAt,
        (err) => {

            if (err) {
                console.log("DATABASE ERROR:", err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Custom alias already exists"
                    });
                }

                return res.status(500).json({
                    message: "Failed to connect to DATABASE"
                });
            }

            const shorturl =
                `http://localhost:5000/url/${shortcode}`;

            return res.status(201).json({
                message: "stored successfully",
                originalurl: originalUrl,
                shortcode: shortcode,
                shorturl: shorturl,
                expiresAt: expiresAt
            });
        }
    );
};

const geturl = (req, res) => {
    const { shortcode } = req.params;
    const cachekey = `url:${shortcode}`;

    redisClient
        .get(cachekey)
        .then((redisresult) => {

            if (redisresult) {
                console.log("CACHE HIT");

                URL.incrementClicks(shortcode)
                    .then((clicks) => {
                        console.log("CLICK COUNT:", clicks);
                        return res.redirect(redisresult);
                    })
                    .catch((err) => {
                        console.log("CLICK COUNTER ERROR:", err);

                        return res.status(500).json({
                            message: "Unable to update click count"
                        });
                    });

                return;
            }

            console.log("CACHE MISS");

            URL.geturl(
                shortcode,
                async (err, result) => {

                    if (err) {
                        console.log("DATABASE ERROR:", err);

                        return res.status(500).json({
                            message: "Failed to fetch URL"
                        });
                    }

                    if (result.length === 0) {
                        return res.status(404).json({
                            message: "URL not found"
                        });
                    }

                    const originalurl = result[0].original_url;
                    const expire = result[0].expires_at;

                    if (expire && new Date() > expire) {
                        return res.status(410).json({
                            message: "URL expired"
                        });
                    }

                    if (expire) {
                        const ttl = Math.floor(
                            (new Date(expire).getTime() - Date.now()) / 1000
                        );

                        if (ttl > 0) {
                            await redisClient.set(
                                cachekey,
                                originalurl,
                                { EX: ttl }
                            );
                        }
                    } else {
                        await redisClient.set(
                            cachekey,
                            originalurl
                        );
                    }

                    console.log("URL STORED IN CACHE");

                    try {
                        const clicks =
                            await URL.incrementClicks(shortcode);

                        console.log("CLICK COUNT:", clicks);

                        return res.redirect(originalurl);

                    } catch (err) {
                        console.log("CLICK COUNTER ERROR:", err);

                        return res.status(500).json({
                            message: "Unable to update click count"
                        });
                    }
                }
            );
        })
        .catch((err) => {
            console.log("REDIS ERROR:", err);

            return res.status(500).json({
                message: "Redis error"
            });
        });
};

module.exports = {
    storeurl,
    geturl
};