const Category=require("../models/category.models.js")

const addCategory=async(req,res)=>{
    const {name}=req.body
    if(!name){
        return res.status(400).json({error:"All fields are required"})
    }
    const newCategory=await Category.create({name})
    if(!newCategory){
        return res.status(500).json({error:"Data not stored to database"})
    }
    res.status(200).json({message:"Category successfully added"})
}

const viewCategory=async(req,res)=>{
    const categories=await Category.find()
    res.render("admin/addcategory",{categories})
}
const viewSubCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.render("admin/addsubcategory", { subcategories: category.subcategories, categoryId: category._id });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Server error while fetching subcategories" });
    }
};


const addSubCategory=async(req,res)=>{
    const {categoryId}=req.params
    const {subCategoryName}=req.body

    if(!categoryId){
        return res.status(404).json({error:"No category id found"})
    }
    if(!subCategoryName){
        return res.status(400).json({error:"All fields are required"})
    }

    const category=await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({error:"No category with this id found"})
    }

    category.subcategories.push({name:subCategoryName})
    await category.save();

    res.status(200).json({message:"Done"})
}

module.exports={addCategory,addSubCategory,viewCategory,viewSubCategory}