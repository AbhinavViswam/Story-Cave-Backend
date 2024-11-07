const User= require('../models/user.models.js')
const Products=require("../models/products.models.js")
const Category=require("../models/category.models.js")
const bcrypt=require("bcrypt")
const genOTP=require("../middleware/OTP.middleware.js")
const Product = require('../models/products.models.js')

async function generateAccessTokenAndRefreshToken(userId){
        try {
                const user= await User.findById(userId)
                const refreshToken=user.generateRefreshToken()
                const accessToken=user.generateAccessToken()
                user.refreshToken=refreshToken;
                await user.save({validateBeforeSave:false})
                return {refreshToken,accessToken}
        } catch (error) {
               throw new Error("Something went wrong") 
        }
}
const registerUser = async function(req, res) {
        try {
            const { fullName, password, email } = req.body; 
    
            if (fullName === "" || password === "" || email === "") {
                return res.status(400).render('user/register', { 
                    error: "All fields are required",
                    fullName,  
                    email      
                });
            }
    
           
            const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!passwordRequirements.test(password)) {
                return res.status(400).render('user/register', { 
                    error: "Password must have at least 8 characters, one uppercase, one lowercase, one digit, and a special character.",
                    fullName,  
                    email      
                });
            }
    
        
            const userEmailExist = await User.findOne({ email });
            if (userEmailExist) {
                return res.status(409).render('user/register', { 
                    error: "User already exists",
                    fullName,  
                    email      
                });
            }
    
         
            const user = await User.create({
                fullName,
                email,
                password
            });
    
            
            if (!user) {
                return res.status(500).render('user/register', { 
                    error: "Sorry, your request failed. Try again later",
                    fullName,  
                    email      
                });
            }
    

            setTimeout(() => {
                res.status(200).redirect('/users/login');
            }, 1000);
            
        } catch (error) {
            console.log(error);
            res.status(500).render('user/register', { 
                error: "Sorry, your request failed. Try again later",
                fullName,  
                email      
            });
        }
    };
    

const loginUser=async function(req,res){
        const {email,password}=req.body
        if(!email){
                return res.status(400).render('user/login',{error:"Email is required",EMAIL:email})
        }
        if(!password){
                return res.status(400).render('user/login',{error:"Password is required",EMAIL:email})
        }
        const user= await User.findOne({email})
        if(!user){
                return res.status(404).render('user/login',{error:"User don't exist",EMAIL:email})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
                return res.status(400).render('user/login',{error:"Invalid Password",EMAIL:email})
        }
        if(user.isBlocked==true){
                return res.status(403).render('user/login',{error:"Your Account is currently blocked",EMAIL:email})
        }
        const {refreshToken,accessToken}= await generateAccessTokenAndRefreshToken(user._id)
         res.status(200)
         .cookie('accessToken',accessToken,{httpOnly:true})
         .cookie('refreshToken',refreshToken,{ maxAge: 600000,httpOnly:true})
         if(user.role==="admin"){
                res.redirect("/admin/dashboard")
         }
         else{
                res.redirect("/users/main")
         }
}
const forgotPassword=async function(req,res){
        const {email}=req.body
        if(!email){
                return res.status(400).render('user/forgotpassword',{error:"Provide your email"})
        }
        const user= await User.findOne({email})
        if(!user){
                return res.status(404).render('user/forgotpassword',{error:"User doesnot exist"})
        }
        try {
                const otp_generated=await genOTP(email);
                res.status(200).cookie('otp',otp_generated,{httpOnly:true,maxAge:600000}).cookie('emailResetPassword',email,{httpOnly:true}).redirect('/users/verify-otp')
        } catch (error) {
                res.status(500).render('user/forgotpassword',{error:"Cannot generate OTP"})
        }
}
const verifyOtp=async (req,res)=>{
        const {otpInput}=req.body
        const email1=req.cookies.emailResetPassword
        if(!otpInput){
                return res.status(400).render('user/verifyOtppage',{error:"OTP field is empty",Email:email1})
        }
        const fetchOtp=req.cookies.otp;
        if(!fetchOtp){
                return res.status(400).render('user/verifyOtppage',{error:"OTP expired",Email:email1})
        }
        if(otpInput===fetchOtp){
                res.status(200).redirect('/users/set-new-password')
        }
        else{
                res.status(400).render('user/verifyOtppage',{error:"OTP doesnt match",Email:email1})
        }
}
const setNewPassword=async(req,res)=>{
        const{newPassword,confirmPassword}=req.body
        const email=req.cookies.emailResetPassword
        if(!(newPassword || confirmPassword)){
                return  res.status(400).render('user/setnewpassword',{error:"Password field is empty",Email:email})
        }
        const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!passwordRequirements.test(newPassword)) {
                return res.status(400).render('user/setnewpassword', { 
                    error: "Password must have at least 8 characters, one uppercase, one lowercase, one digit, and a special character.",Email:email   
                });
            }
        if(newPassword!==confirmPassword){
                return res.status(400).render('user/setnewpassword',{error:"Passwords doesnt match",Email:email})
        }
        try{
        const user=await User.findOne({email})
        if(!user){
               return res.status(404).render('user/setnewpassword',{error:"No User Found",Email:email})
        }
        user.password=newPassword;
        await user.save();
        res.status(200).clearCookie('emailResetPassword').clearCookie('otp');
        setTimeout(() => {
                res.status(200).redirect("/users/login")
        }, 1000);
}
catch(err){
        console.log(err,"error occured");
}
}

// products

const listProducts=async(req,res)=>{
        const products=await Products.find({isBlocked:false});
        const categories=await Category.find();
        if(!products){
                return res.render({error:"No products available"})
        }
        res.render("user/main",{products,categories,selectedCategory:"",languages:[]})
}

const productDetails=async(req,res)=>{
        const {productId}=req.params
        const product=await Product.findById(productId).populate('category')
        res.render("product/productdetail",{product});
}

const productFilter=async(req,res)=>{
        const {category}=req.query;
        const {language}=req.query;
        const {price}=req.query;
        const filter={isBlocked:false}
        if(category){
                filter.category=category;
        }
        if (language) filter.language = language;

        let pdctQuery=Products.find(filter);
        if(price=="asc"){
                pdctQuery=pdctQuery.sort({offerprice:1})
        }
        if(price=="des"){
                pdctQuery=pdctQuery.sort({offerprice:-1});
        }
        const products=await pdctQuery.exec()
        const categories=await Category.find();

        const languages = [...new Set(products.map(product => product.language))];
        res.render("user/main",{categories,products,languages,selectedCategory:category || "",selectedLanguage:language || "",selectedPriceOrder:price || ""})
}

module.exports={registerUser,loginUser,forgotPassword,verifyOtp,setNewPassword,listProducts,productDetails,productFilter}