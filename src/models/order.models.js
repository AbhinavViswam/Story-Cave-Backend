const mongoose=require("mongoose")

const ordersSchema=new mongoose.Schema({
    userid:{
        type:String,
        ref:"User",
        required:true
    },
    items:[{
        productid:{
            type:String,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            min:1,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        rated: { 
            type: Boolean, 
            default: false
         }
    }],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','shipped','delivered','cancelled'],
        default:"pending"
    },
    address:{
        type:String,
        required:true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash-on-delivery', 'upi', 'wallet'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
},{timestamps:true})

const Orders=mongoose.model("Orders",ordersSchema)
module.exports=Orders;