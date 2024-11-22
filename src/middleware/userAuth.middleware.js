const jwt=require("jsonwebtoken")
const User=require("../models/user.models.js")

async function verifyUser(req,res,next){
    const userToken=req.cookies.accessTokenUser;
    if(!userToken){
        return res.send("Token Expired")
    }
    const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
    const userId=decoded._id
    const user=await User.findById(userId)
    req.user=user;
    if(user.isBlocked===true){
        res.clearCookie('accessTokenUser')
        return res.send("Your Account is blocked")
    }
    next()
}

module.exports=verifyUser;