const mongoose = require('mongoose');
const Category=require('./category.models.js')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
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
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    offerprice:{
        type:Number,
        required:true
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
