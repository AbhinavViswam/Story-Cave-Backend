const mongoose=require("mongoose")
const User=require("../models/user.models.js")
const Product=require("../models/products.models.js")

const wishlistSchema=new mongoose.Schema({
    userid:{
        type:String,
        ref:"User",
        required:true
    },
    productid:[{
        type:String,
        ref:"Product",
        required:true
    }]
},{timestamps:true})

const Wishlist=mongoose.model("Wishlist",wishlistSchema)
module.exports=Wishlist;