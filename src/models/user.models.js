const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt= require("jsonwebtoken")

const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        trim:true,
        required:true            
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer'
    },
    refreshToken:{
        type:String,
    }
},
{
    timestamps:true
})

UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
        next();
    }
    else{
        return next();
    }
})

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User=mongoose.model('User',UserSchema)
module.exports=User