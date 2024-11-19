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
    const {inputQuantity}=req.body;
    const userToken=req.cookies.accessTokenUser
    if(!userToken){
        return res.json({error:"Token expired"})
    }
    const decoded=jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
    const userid=decoded._id;
    let cart = await Cart.findOne({ userid })
    if (!cart) {
        cart = new Cart({ userid, items: [] });
    }
    const productExists = cart.items.find((item) => item.productid.toString() === productId);

    if (productExists) {
        productExists.quantity+= Number(inputQuantity);
    } else {
        cart.items.push({ productid:productId, quantity: inputQuantity?inputQuantity:1 });
    }
    const product=await Product.findOne({_id:productId})
    cart.totalprice+=product.offerprice
    await cart.save();
    res.redirect("/users/main")
}


const removeFromCart=async(req,res)=>{
    const { productId } = req.params; 
    const userToken = req.cookies.accessTokenUser; 

    if (!userToken) {
        return res.status(401).json({ error: "Token expired" });
    }

    const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
    const userid = decoded._id;

    let cart = await Cart.findOne({ userid }); 
    if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
    }
    const productIndex = cart.items.findIndex(item => item.productid.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        const product = cart.items[productIndex];
        const productDetails = await Product.findOne({ _id: productId });
        if (!productDetails || !productDetails.offerprice) {
            return res.status(404).json({ error: "Product not found or invalid price" });
        }

        cart.items.splice(productIndex, 1); 
        cart.totalprice -= productDetails.offerprice * product.quantity;
        await cart.save();
        res.redirect("/users/cart")
}

const updateCart = async (req, res) => {
    const { productId } = req.params;
    const { quantities } = req.body; 
    const userToken = req.cookies.accessTokenUser;

    if (!userToken) {
        return res.status(401).json({ error: "Token expired" });
    }
        const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
        const userid = decoded._id;

        if (isNaN(quantities) || quantities <= 0) {
            return res.status(400).send("Invalid quantity.");
        }
        let cart = await Cart.findOne({ userid: userid });
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        const itemIndex = cart.items.findIndex(item => item.productid.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send("Product not found in cart");
        }
        cart.items[itemIndex].quantity = parseInt(quantities, 10);
        await cart.save();
        res.redirect("/users/cart"); 
};

module.exports={getCart,addToCart, removeFromCart,updateCart};