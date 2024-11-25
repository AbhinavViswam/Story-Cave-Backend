const Cart=require("../models/cart.models.js")
const Product=require("../models/products.models.js")
const jwt=require("jsonwebtoken")


const getCart=async(req,res)=>{
    try {
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
    } catch (error) {
        res.send("Some Internal error Occured, Cannot Get Cart")
    }
}

const addToCart=async(req,res)=>{
    try {
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
        const productExists = cart.items.find((item) => item.productid.toString() === productId)
        const product=await Product.findOne({_id:productId})
        if (productExists) {
            if(productExists.quantity>=product.stock){
                return res.json({m:"Cannot order products more that in stock"})
            }
            productExists.quantity+= Number(inputQuantity);
        } else {
            cart.items.push({ productid:productId, quantity: inputQuantity?inputQuantity:1 });
        }
        product.stock-=Number(inputQuantity)
        await product.save();
        cart.totalprice+=product.offerprice
        await cart.save();
        res.redirect("/users/main")
    } catch (error) {
        res.send("Some Internal error Occured, Cannot Add To Cart")
    }
}


const removeFromCart=async(req,res)=>{
    try {
        const { productId } = req.params;
        const {quantityy}=req.body 
        const userToken = req.cookies.accessTokenUser; 
        const products=await Product.findOne({_id:productId})
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
            products.stock+=Number(quantityy)
            await products.save()
            await cart.save();
            res.redirect("/users/cart")
    } catch (error) {
        res.send("Some Internal error Occured,Cannot Remove from cart ")
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantities } = req.body; 
        const userToken = req.cookies.accessTokenUser;
    
        if (!userToken) {
            return res.status(401).json({ error: "Token expired" });
        }
    
        const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
        const userid = decoded._id;
    
        // Validate the input quantity
        if (isNaN(quantities) || quantities <= 0) {
            return res.status(400).send("Invalid quantity.");
        }
    
        let cart = await Cart.findOne({ userid });
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
    
        const itemIndex = cart.items.findIndex(item => item.productid.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send("Product not found in cart");
        }
    
        const newQuantity = parseInt(quantities, 10);
        const product = await Product.findById(productId);
    
        if (!product) {
            return res.status(404).send("Product not found");
        }
    
        const currentCartQuantity = cart.items[itemIndex].quantity;
    
        // Ensure the updated quantity does not exceed stock
        if (newQuantity > product.stock + currentCartQuantity) {
            return res.status(400).send("Cannot update quantity. Not enough stock available.");
        }
    
        // Adjust stock based on quantity change
        const quantityDifference = newQuantity - currentCartQuantity;
    
        if (quantityDifference > 0) {
            // User increased quantity -> Decrease stock
            product.stock -= quantityDifference;
        } else if (quantityDifference < 0) {
            // User decreased quantity -> Increase stock
            product.stock += Math.abs(quantityDifference);
        }
    
        // Update the cart item quantity
        cart.items[itemIndex].quantity = newQuantity;
    
        // Save changes
        await product.save();
        await cart.save();
    
        res.redirect("/users/cart");
    } catch (error) {
        res.send("Some Internal error Occured, Cannot update Cart")
    }
};



module.exports={getCart,addToCart, removeFromCart,updateCart};