const mongoose=require('mongoose')
const User=require('../models/user.models.js')
const Product=require('../models/products.models.js')
const { v4: uuidv4 } = require('uuid');

const cartSchema=new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
    userid:{
        type:String,
        ref:'User'
    },
    items:[
        {
        productid:{
            type:String,
            ref:'Product'
        },
        quantity:{
            type:Number,
            min:1
        }
    },
    ],
    totalprice:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart;