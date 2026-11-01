const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

require("./config/redis");
require("./config/db");

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());

const urlroutes = require("./routes/urlroutes");

app.get("/", (req, res) => {
    res.send("WELCOME TO URL SHORTNER BACKEND");
});

app.use("/url", urlroutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Listening On ${PORT}`);
});