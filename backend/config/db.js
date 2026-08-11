const mysql = require("mysql2")
require("dotenv").config();
console.log("DATABASE:", process.env.DB_NAME);
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})  
connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        return;
    }

    console.log("Connected to MySQL");
});

module.exports=connection;