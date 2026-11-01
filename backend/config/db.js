
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: "TLSv1.2"
    }
});

connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed:", err.message);
        return;
    }

    console.log("Connected to TiDB Cloud");
});

module.exports = connection;
