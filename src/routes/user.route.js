const {registerUser,loginUser,forgotPassword,verifyOtp,setNewPassword}=require('../controller/user.controller.js')
const express=require('express')
const router=express.Router()

router.all('/register',(req,res)=>{
    if(req.method=='POST'){
    registerUser(req,res)
    }
    else if(req.method=='GET'){
        res.render('user/register',{error:""})
    }
})
router.all('/login',(req,res)=>{
    if(req.method=='POST'){
    loginUser(req,res)
    }
    else if(req.method=='GET'){
        res.render('user/login',{error:""})
    }
})
router.all('/forgot-password',(req,res)=>{
    if(req.method=='POST'){
        forgotPassword(req,res)
        }
    else if(req.method=='GET'){
            res.render('user/forgotpassword',{error:""})
        }
})
router.all('/verify-otp',(req,res)=>{
    if(req.method=='POST'){
        verifyOtp(req,res)
        }
        else if(req.method=='GET'){
            const email = req.cookies.emailResetPassword;
            res.render('user/verifyOtppage',{error:"",Email:email || ""})
        }
})
router.all('/set-new-password',(req,res)=>{
    if(req.method=='POST'){
        setNewPassword(req,res)
        }
        else if(req.method=='GET'){
            const email = req.cookies.emailResetPassword;
            res.render('user/setnewpassword',{error:"",Email:email || ""})
        }
})


router.all('/main',(req,res)=>{
    if(req.method=='GET'){
        res.render('main')
    }
})

module.exports=router