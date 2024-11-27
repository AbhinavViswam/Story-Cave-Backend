const Wishlist=require("../models/wishlist.models.js")
const jwt=require("jsonwebtoken")
const { removeFromCart } = require("./cart.controller.js")

const getWishlist=async(req,res)=>{
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    try {
        const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
        const userid=decoded._id;
      
        let wishlist = await Wishlist.findOne({ userid }).populate('productid');
        res.render("user/wishlist",{wishlist})
    } catch (error) {
        res.send("Some Internal error Occured, cannot show orders")
    }
}

const addToWishlist=async(req,res)=>{
    const {productId}=req.params
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    try {
        const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
        const userid=decoded._id;
      
        let wishlist = await Wishlist.findOne({ userid });
    
        if (!wishlist) {
            wishlist = new Wishlist({ userid, productid: [] });
        }
        if (!wishlist.productid.includes(productId)) {
            wishlist.productid.push(productId);
        }
        await wishlist.save();
        res.redirect('/users/main')
    } catch (error) {
        res.send("Some Internal error Occured, cannot show orders")
    }
}

removeFromWishlist=async(req,res)=>{
    const {productId}=req.params
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    try{
    const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
    const userid=decoded._id;
  
    let wishlist = await Wishlist.findOne({ userid });
    if(wishlist.productid && wishlist.productid.length>0){
       const productIndex=wishlist.productid.findIndex((pdctid)=>pdctid.toString()===productId)
       wishlist.productid.splice(productIndex,1)
       await wishlist.save();
       return res.redirect("/users/wishlist")
    }
    return res.json({e:"Error occured"})
}catch(err){
    res.send("Some Internal error Occured, cannot show orders")
}
}


module.exports={getWishlist,addToWishlist,removeFromWishlist};