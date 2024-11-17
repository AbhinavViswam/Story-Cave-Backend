const Cart=require("../models/cart.models.js")
const Product=require("../models/products.models.js")
const jwt=require("jsonwebtoken")


const getCart=async(req,res)=>{
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
    const cart=await Cart.findOne({userid:decoded._id}).populate('items.productid')
    if(!cart){
        return res.json({error:"No cart found"})
    }
    res.render("user/cart",{cart,user:decoded})
}

const addToCart=async(req,res)=>{
    const {productId}=req.params
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
    const userid=decoded._id;
    let cart = await Cart.findOne({ userid });
    if (!cart) {
        cart = new Cart({ userid, items: [] });
    }
    const productExists = cart.items.find((item) => item.productid.toString() === productId);

    if (productExists) {
        productExists.quantity += 1;
    } else {
        cart.items.push({ productid:productId, quantity: 1 });
    }
    const product=await Product.findOne({_id:productId})
    cart.totalprice+=product.offerprice
    await cart.save();
    res.render("product/productdetail",{product})
}
module.exports={getCart,addToCart};