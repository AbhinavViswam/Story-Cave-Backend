const User=require("../models/user.models.js")
const Cart=require("../models/cart.models.js")
const OrderConfirmMail=require("../middleware/orderplacedmail.middleware.js")
const Orders=require("../models/order.models.js")

const addAddress=async(req,res)=>{
    const userid=req.user._id
    const {city,place,district,pincode}=req.body
    if(!(city || place || district || pincode)){
        return res.json({e:"All fields are required"})
    }
    const user=await User.findOne({_id:userid})
    const newAddress={
        city,
        place,
        district,
        pincode
    }
    user.address.push(newAddress)
    await user.save()
    res.redirect("/users/order/checkout")
}

const getCheckoutOrder=async(req,res)=>{
    const userid=req.user._id
    const user=await User.findOne({_id:userid})
    const cart=await Cart.findOne({userid}).populate('items.productid')
    const cartItems=cart.items
    const address=user.address
    res.render("user/checoutOrder",{address,cartItems})
}

const checkOut=async(req,res)=>{
    const userId = req.user._id; 
    const email=req.user.email
        const selectedAddress = JSON.parse(req.body.selectedAddress); 
        const {paymentMethod}=req.body
        const cart = await Cart.findOne({ userid: userId }).populate('items.productid'); 

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Cart is empty. Cannot place order.");
        }

        const orderItems = cart.items.map(item => ({
            productid: item.productid._id, 
            quantity: item.quantity,       
            price: item.productid.offerprice || item.productid.price 
        }));
      
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const newOrder = new Orders({
            userid: userId,
            items: orderItems,
            totalAmount,
            address: `${selectedAddress.city}, ${selectedAddress.place}, ${selectedAddress.district}, ${selectedAddress.pincode}`,
            paymentMethod
        });

        if(paymentMethod=='cash-on-delivery'){
            const placedOrder=await newOrder.save();
            await OrderConfirmMail(email,placedOrder._id)
            res.status(200).render("user/orderplaced");
        }
        else{
            res.json({e:"We only support CASH ON DELIVERY"})
        }
} 

const showMyOrders=async(req,res)=>{
    const userid=req.user._id;
    const orders=await Orders.find({userid}).sort({createdAt:-1}).populate('items.productid')
    res.render("user/myorder",{orders})
}

const cancelOrder=async(req,res)=>{
    const {orderid}=req.body
    if(!orderid){
        return res.json({e:"orderid required"})
    }
    await Orders.findByIdAndDelete(orderid)
    res.redirect("/users/myorders")

}

module.exports={addAddress, getCheckoutOrder, checkOut,showMyOrders,cancelOrder}