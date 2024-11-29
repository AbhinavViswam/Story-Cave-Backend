const mongoose = require('mongoose');
const Category=require('./category.models.js')
const { v4: uuidv4 } = require('uuid');

const ProductSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
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
    ratings: [
        {
            userid: {
                type: String,
                ref: "User",
                required: true,
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true,
            },
            comment: { type: String },
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfRatings: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
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
        type:[String],
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
