const {registerUser,loginUser,forgotPassword,verifyOtp,setNewPassword,logoutUser,listProducts,productDetails,productFilter}=require('../controller/user.controller.js')
const {checkEmailSet,checkOtpSet}=require('../middleware/ForgotPasswordAuth.middleware.js');
const {getWishlist,addToWishlist,removeFromWishlist}=require("../controller/wishlist.controller.js")
const express=require('express')
const jwt=require("jsonwebtoken")
const verifyUser=require("../middleware/userAuth.middleware.js")
const router=express.Router()


const {getCart,addToCart,removeFromCart,updateCart}=require("../controller/cart.controller.js");



router.all('/register',(req,res)=>{
    if(req.method=='POST'){
    registerUser(req,res)
    }
    else if(req.method=='GET'){
        res.render('user/register',{error:"",fullName:"",email:""})
    }
})

router.route('/login')
.get((req,res)=>{
    const userToken = req.cookies.accessTokenUser;
    if (!userToken) {
        return res.render('user/login', { error: "", EMAIL: "" });
    }

    try {
        const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET)
        if(decoded.isBlocked==true){
            res.clearCookie('accessTokenUser')
            return res.send("Your Account is blocked")
        }
        res.redirect(`/users/main`);
    }catch (err) {
        console.error("Token verification failed:", err.message);
        res.clearCookie('accessTokenUser');
        res.render('user/login', { error: "Session expired. Please log in again.", EMAIL: "" });
    }
})
.post((req,res)=>{
    loginUser(req, res);
})

router.route('/forgot-password')
    .get((req, res) => {
        res.render('user/forgotpassword', { error: "" });
    })
    .post((req, res) => {
        forgotPassword(req, res);
    });

router.route('/verify-otp')
    .get(checkEmailSet,(req, res) => {
        const email = req.cookies.emailResetPassword;
        res.render('user/verifyOtppage', { error: "", Email: email || "" });
    })
    .post((req, res) => {
        verifyOtp(req, res);
    });

router.route('/set-new-password')
    .get(checkOtpSet,(req, res) => {
        const email = req.cookies.emailResetPassword;
        res.render('user/setnewpassword', { error: "", Email: email || "" });
    })
    .post((req, res) => {
        setNewPassword(req, res);
    });

router.route('/main')
.get(verifyUser,(req,res)=>{
    listProducts(req,res)
})

router.route('/product/:productId/details')
.get(verifyUser,(req,res)=>{
    productDetails(req,res)
})
router.route('/product')
.get(verifyUser,(req,res)=>{
    productFilter(req,res)
})

router.route("/logout")
.post(verifyUser,(req,res)=>{
    logoutUser(req,res)
})


//cart

router.route("/cart")
.get((req,res)=>{
    getCart(req,res)
})

router.route("/cart/:productId")
.post((req,res)=>{
    addToCart(req,res)
})

router.route("/cart/remove/:productId")
.post((req,res)=>{
    removeFromCart(req,res);
})

router.route("/cart/update/:productId")
.post((req,res)=>{
    updateCart(req,res);
})

//wishlist

router.route("/wishlist")
.get((req,res)=>{
    getWishlist(req,res)
})

router.route("/wishlist/:productId")
.post((req,res)=>{
    addToWishlist(req,res);
})

router.route("/wishlist/remove/:productId")
.post((req,res)=>{
    removeFromWishlist(req,res);
})



//orders
const {addAddress,getCheckoutOrder,checkOut,showMyOrders,cancelOrder,paypalOrder,viewOrderDetails,removeAddress,addAddressPage}=require("../controller/order.controller.js")

router.route("/order/addaddress")
.post(verifyUser,(req,res)=>{
    addAddress(req,res);
})

router.route("/order/checkout")
.get(verifyUser,(req,res)=>{
    getCheckoutOrder(req,res);
})

router.route("/order/checkout")
.post(verifyUser,(req,res)=>{
    checkOut(req,res);
})

router.route("/myorders")
.get(verifyUser,(req,res)=>{
    showMyOrders(req,res);
})


router.route("/myorders/remove")
.post(verifyUser,(req,res)=>{
    cancelOrder(req,res);
})

router.route("/myorders/:orderid")
.post(verifyUser,(req,res)=>{
    viewOrderDetails(req,res);
})

router.route("/orderplacedsuccess")
.get(verifyUser,(req,res)=>{
    paypalOrder(req,res)
})

router.route("/paymenterror")
.get(verifyUser,(req,res)=>{
    res.render("user/paymenterror")
})

router.route("/order/removeaddress")
.post(verifyUser,(req,res)=>{
   removeAddress(req,res)
})

router.route("/order/addaddresspage/:userid")
.get(verifyUser,(req,res)=>{
   addAddressPage(req,res)
})

module.exports=router

// app.get('/success', async (req, res) => {
//     const { paymentId, PayerID } = req.query;

//     const executePaymentJson = {
//         payer_id: PayerID,
//     };

//     paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
//         if (error) {
//             console.error(error.response);
//             return res.status(500).send("Error processing PayPal payment.");
//         } else {
//             // Save order details in the database
//             const { userId, orderItems, totalAmount, selectedAddress } = req.session.orderDetails;
//             const newOrder = new Orders({
//                 userid: userId,
//                 items: orderItems,
//                 totalAmount,
//                 address: `${selectedAddress.city}, ${selectedAddress.place}, ${selectedAddress.district}, ${selectedAddress.pincode}`,
//                 paymentMethod: 'paypal',
//                 status: 'paid',
//             });

//             const placedOrder = await newOrder.save();
//             await OrderConfirmMail(payment.payer.payer_info.email, placedOrder._id);

//             res.render("user/orderplaced");
//         }
//     });
// });
