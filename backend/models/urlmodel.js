const db = require("../config/db");
const redisClient = require("../config/redis");

const storeurl = (
    originalurl,
    shortcode,
    expiresAt,
    callback
) => {
    const sql = `
        INSERT INTO urls(
            original_url,
            short_code,
            expires_at
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [originalurl, shortcode, expiresAt],
        callback
    );
};

const geturl = (shortcode, callback) => {
    const sql = `
        SELECT original_url, expires_at
        FROM urls
        WHERE short_code = ?
    `;

    db.query(
        sql,
        [shortcode],
        callback
    );
};

const incrementClicks = async (shortcode) => {
    const key = `clicks:${shortcode}`;

    return await redisClient.incr(key);
};

const updateClicksInDB = (
    shortcode,
    clicks,
    callback
) => {
    const sql = `
        UPDATE urls
        SET clicks = ?
        WHERE short_code = ?
    `;

    db.query(
        sql,
        [clicks, shortcode],
        callback
    );
};

module.exports = {
    storeurl,
    geturl,
    incrementClicks,
    updateClicksInDB
};