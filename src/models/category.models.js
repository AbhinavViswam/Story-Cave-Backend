const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const categorySchema=new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
    name:{
        type:String,
        required:true,
        uppercase:true,
        unique:true
    }
},
{
    timestamps:true
})

const Category=mongoose.model('Category',categorySchema)

module.exports=Category