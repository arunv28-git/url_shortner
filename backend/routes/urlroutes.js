const express= require("express")
const routes = express.Router();
const ratelimiter=require("../middleware/ratelimiter")

const urlcontroller = require("../controllers/urlcontroller")
routes.post("/",ratelimiter,urlcontroller.storeurl)
routes.get("/:shortcode",urlcontroller.geturl)


module.exports=routes;