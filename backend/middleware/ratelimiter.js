const redisClient = require("../config/redis")

const ratelimiter = async(req,res,next)=>{
    const ip = req.ip
    const key =`rate:${req.ip}`
   try{
        const request = await redisClient.incr(key)
    if(request===1){
        await redisClient.expire(key,60)
    }
    if(request>5){
        return res.status(429).json({
            message:"Too many requests"
        })
    }
    next()
   } 
   catch(err){
     if(err){
        console.log("FAILED TO RATE LIMIT")
        return res.status(500).json({
            message:"Rate limiter error"
        })
     }
   }
}

module.exports=ratelimiter
