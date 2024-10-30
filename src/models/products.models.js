const mongoose = require('mongoose');
const Category=require('./category.models.js')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase:true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    author:{
        type:String,
        required:true,
        uppercase:true
    },
    language:{
        type:String,
        required:true,
        uppercase:true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        trim: true,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    offerprice:{
        type:Number,
        default:null
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type:String,
        required: true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
