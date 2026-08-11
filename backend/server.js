const express = require("express")
const app = express()
require("dotenv").config();
require("./config/redis");
require("./config/db")

app.use(express.json());
const PORT = process.env.PORT || 5000;

const urlroutes = require("./routes/urlroutes")
app.get("/",(req,res)=>{
    res.send("WELCOME TO URL SHORTNER BACKEND");
})
const redisClient = require("./config/redis");

app.use("/url",urlroutes)

app.listen(PORT,(err)=>{
    if(err){
        console.log("COULD NOT CONNECT TO BACKEND");
    }
    console.log(`Server Listening On ${PORT}`)
})