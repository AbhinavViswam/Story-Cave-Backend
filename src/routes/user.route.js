const {registerUser,loginUser,forgotPassword,verifyOtp,setNewPassword,logoutUser,listProducts,productDetails,productFilter}=require('../controller/user.controller.js')
const {checkEmailSet,checkOtpSet}=require('../middleware/ForgotPasswordAuth.middleware.js');
const express=require('express')
const jwt=require("jsonwebtoken")
const verifyUser=require("../middleware/userAuth.middleware.js")
const router=express.Router()

const {getCart,addToCart,updateCart}=require("../controller/cart.controller.js")


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

module.exports=router