const User= require('../models/user.models.js')
const bcrypt=require("bcrypt")
const genOTP=require("../middleware/OTP.middleware.js")

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

const registerUser=async function(req,res){
        try {
                
                const {fullName,password,email}=req.body 
                if(fullName=="" || password=="" || email==""){
                        return res.status(400).render('user/register',{error:"All Fields are required"})
                }
                const userEmailExist= await User.findOne({email})
        
                if(userEmailExist){
                        return res.status(409).render('user/register',{error:"USER already exists"})
                }
                const user= await User.create({
                        fullName,
                        email,
                        password
                })
                if(!user){
                        return res.status(500).render('user/register',{error:"Sorry, your request failed. Try again later"}) 
                } 
                setTimeout(() => {
                        res.status(200).redirect('/users/login')
                },1000);
        } catch (error) {
                console.log(error)
                res.status(500).render('user/register',{error:"Sorry, your request failed. Try again later"})
        }
}

const loginUser=async function(req,res){
        const {email,password}=req.body
        if(!email){
                return res.status(400).render('user/login',{error:"Email is required"})
        }
        if(!password){
                return res.status(400).render('user/login',{error:"Password is required"})
        }
        const user= await User.findOne({email})
        if(!user){
                return res.status(404).render('user/login',{error:"User don't exist"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
                return res.status(400).render('user/login',{error:"Invalid Password"})
        }
        const {refreshToken,accessToken}= await generateAccessTokenAndRefreshToken(user._id)
         return res.status(200)
         .cookie('accessToken',accessToken,{httpOnly:true})
         .cookie('refreshToken',refreshToken,{ maxAge: 600000,httpOnly:true})
         .redirect(user.role==="admin"?'/admin/dashboard':'/users/main')
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
        if(otpInput==fetchOtp){
                res.clearCookie('otp');
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
        res.status(200).clearCookie('emailResetPassword')
        setTimeout(() => {
                res.status(200).redirect("/users/login")
        }, 1000);
}
catch(err){
        console.log(err,"error occured");
}
}
module.exports={registerUser,loginUser,forgotPassword,verifyOtp,setNewPassword}