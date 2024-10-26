const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
},
{
    timestamps:true
})

const subCategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }
})

const Category=mongoose.model("Category",categorySchema)
const Subcategory=mongoose.model("Subcategory",subCategorySchema)

module.exports={Category,Subcategory}