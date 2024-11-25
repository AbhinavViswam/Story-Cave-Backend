const User=require("../models/user.models.js")
const Cart=require("../models/cart.models.js")
const OrderConfirmMail=require("../middleware/orderplacedmail.middleware.js")
const Orders=require("../models/order.models.js")
const paypal=require("../utils/paypal.config.js")
const jwt=require("jsonwebtoken")
const Product=require("../models/products.models.js")

const addAddressPage=async(req,res)=>{
    try {
        const {userid}=req.params;
        const user=await User.findOne({_id:userid});
        const address=user.address
        res.render("user/addaddresspage",{address})
    } catch (error) {
        res.send("Some Internal error Occured,Cannot add address ")
    }
}

const addAddress=async(req,res)=>{
    try {
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
        res.redirect(`/users/order/addaddresspage/${userid}`)
    } catch (error) {
        res.send("Some Internal error Occured,Cannot Add Address ")
    }
}

const removeAddress=async(req,res)=>{
    try {
        const { addressId } = req.body;
        const userId=req.user._id
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, 
            { $pull: { address: { _id: addressId } } }, 
            { new: true }
        );
        res.redirect(`/users/order/addaddresspage/${userId}`)  
    } catch (error) {
        res.send("Some Internal error Occured, Cannot remove Address")
    }
}

const getCheckoutOrder=async(req,res)=>{
    try {
        const userid=req.user._id
        const user=await User.findOne({_id:userid})
        const cart=await Cart.findOne({userid}).populate('items.productid')
        const cartItems=cart.items
        const address=user.address
        res.render("user/checoutOrder",{address,cartItems,user})
    } catch (error) {
        res.send("Some Internal error Occured,Cannot order right now ")
    }
}

const checkOut=async(req,res)=>{
   try {
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
         const orderitemsToken=jwt.sign({userId,orderItems,totalAmount,selectedAddress},process.env.ACCESS_TOKEN_SECRET)
         
 
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
         else if (paymentMethod === 'pay-now') {
             // PayPal payment creation
             const createPaymentJson = {
                 intent: "sale",
                 payer: {
                     payment_method: "paypal",
                 },
                 redirect_urls: {
                     return_url: "http://localhost:3000/users/orderplacedsuccess", // Update with your success route
                     cancel_url: "http://localhost:3000/users/paymenterror",  // Update with your cancel route
                 },
                 transactions: [
                     {
                         item_list: {
                             items: cart.items.map(item => ({
                                 name: item.productid.name,
                                 price: (item.productid.offerprice || item.productid.price).toFixed(2),
                                 currency: "USD",
                                 quantity: item.quantity,
                             })),
                             shipping_address: {
                                 recipient_name: req.user.fullName, // Name of the recipient
                                 line1: selectedAddress.place,  // Street address
                                 city: selectedAddress.city,   // City
                                 state: selectedAddress.district || "N/A", // Optional state
                                 postal_code: selectedAddress.pincode, // Pincode
                                 country_code: "US", // Change to your country code (e.g., "IN" for India)
                             },
                         },
                         amount: {
                             currency: "USD",
                             total: totalAmount.toFixed(2),
                         },
                         description: "Order payment",
                     },
                 ],
             };
             
     
             paypal.payment.create(createPaymentJson, (error, payment) => {
                 if (error) {
                     console.error(error);
                     res.status(500).send("Error creating PayPal payment.");
                 } else {
                     // Redirect user to PayPal approval URL
                     const approvalUrl = payment.links.find(link => link.rel === "approval_url").href;
                     res.cookie('orderitemsToken',orderitemsToken).redirect(approvalUrl);
                 }
             });
         } else {
             res.status(400).send("Unsupported payment method.");
         }
   } catch (error) {
    res.send("Some Internal error Occured, checkout error")
   }
} 

const showMyOrders=async(req,res)=>{
    try {
        const userid=req.user._id;
        const orders=await Orders.find({userid}).sort({createdAt:-1}).populate('items.productid')
        res.render("user/myorder",{orders})
    } catch (error) {
        res.send("Some Internal error Occured, cannot show orders")
    }
}

const viewOrderDetails=async(req,res)=>{
    const {orderid}=req.params
    const order=await Orders.findById(orderid).populate('items.productid')
    res.render("user/vieworder",{order})
}

const cancelOrder=async(req,res)=>{
    const {orderid}=req.body
    if(!orderid){
        return res.json({e:"orderid required"})
    }
    const order=await Orders.findById(orderid)
    order.status="cancelled"
    await order.save();
    res.redirect("/users/myorders")

}

const paypalOrder=async(req,res)=>{
    const { paymentId, PayerID } = req.query;

    const executePaymentJson = {
        payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
        if (error) {
            console.error(error.response);
            return res.status(500).send("Error processing PayPal payment.");
        } else {
            const orderitemstoken=req.cookies.orderitemsToken
            const orderitems=jwt.verify(orderitemstoken,process.env.ACCESS_TOKEN_SECRET)
            const { userId, orderItems, totalAmount, selectedAddress } = orderitems;
            const newOrder = new Orders({
                userid: userId,
                items: orderItems,
                totalAmount,
                address: `${selectedAddress.city}, ${selectedAddress.place}, ${selectedAddress.district}, ${selectedAddress.pincode}`,
                paymentMethod: 'upi',
                paymentStatus: 'completed'
            });

            const placedOrder = await newOrder.save();
            await OrderConfirmMail(req.user.email, placedOrder._id);
            return res.render("user/orderplaced");
        }
    });
}

module.exports={addAddress, getCheckoutOrder, checkOut,showMyOrders,cancelOrder,paypalOrder,viewOrderDetails, removeAddress,addAddressPage}