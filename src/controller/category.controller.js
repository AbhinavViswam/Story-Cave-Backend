const Category=require("../models/category.models.js")

const addCategory=async(req,res)=>{
    const {name}=req.body
    if(!name){
        const categories=await Category.find()
        return res.status(400).render("admin/addcategory",{categories,message:"",error:""})
    }
    const newCategory=await Category.create({name})
    if(!newCategory){
        const categories=await Category.find()
        return res.status(500).render("admin/addcategory",{categories,message:"",error:"Data not stored to database"})
    }
    const categories = await Category.find();
    res.status(200).render("admin/addcategory",{categories,error:"",message:"Category Successfully added"})
}

const viewCategory=async(req,res)=>{
    const categories=await Category.find()
    res.render("admin/addcategory",{categories,error:"",message:""})
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
        return res.render("admin/addsubcategory", { subcategories: category.subcategories, categoryId: category._id });
    }

    const category=await Category.findById(categoryId);
    if(!category){
        return res.render("admin/addsubcategory", { subcategories: category.subcategories, categoryId: category._id });
    }

    category.subcategories.push({name:subCategoryName})
    await category.save();

    res.render("admin/addsubcategory", { subcategories: category.subcategories, categoryId: category._id });
}

const updateCategory=async(req,res)=>{
    const {categoryId}=req.params
    const {categoryName}=req.body;
    const category=await Category.findById(categoryId)
    if(!category){
        return res.render("admin/updatecategory",{message:"",error:"no category found",categoryid:categoryId,categoryName:category.name})
    }
    if(!categoryName){
        return res.render("admin/updatecategory",{message:"",error:"All fields are required",categoryid:categoryId,categoryName:category.name})
    }
    category.name=categoryName;
    await category.save()
    res.render("admin/updatecategory",{message:"Category Updated",error:"",categoryid:categoryId,categoryName:category.name})

}

const viewUpdateSubCategory=async(req,res)=>{
    
        const { categoryId, subCategoryId } = req.params;
    
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
    
            const subcategory = category.subcategories.id(subCategoryId);
            if (!subcategory) {
                return res.status(404).json({ error: "Subcategory not found" });
            }
    
            res.render("admin/updatesubcategory", {
                categoryId,
                subCategoryId,
                subCategoryName: subcategory.name,
                message: "",
                error: ""
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    
}

const updateSubCategory=async(req,res)=>{
    const {categoryId,subCategoryId}=req.params
    const {subCategoryName}=req.body
    if(!subCategoryName){
        return res.render("/admin/updatesubcategory",{error:"All fields are required",message:"",categoryId,subCategoryId,subCategoryName:subcategory.name})
    }
    const category=await Category.findById(categoryId)
    const subcategory = category.subcategories.id(subCategoryId);
    subcategory.name=subCategoryName;
    await category.save();
    res.render("admin/updatesubcategory",{error:"",message:"Done",categoryId,subCategoryId,subCategoryName:subcategory.name})
}

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
           
            return res.status(404).render("admin/addcategory", { 
                categories: [], 
                message: "", 
                error: "Category not found" 
            });
        }

        const categories = await Category.find();

        res.render("admin/addcategory", { 
            categories, 
            message: "Category successfully deleted", 
            error: "" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("admin/addcategory", { 
            categories: [], 
            message: "", 
            error: "Server error during category deletion" 
        });
    }
};

module.exports={addCategory,addSubCategory,viewCategory,viewSubCategory,updateCategory,viewUpdateSubCategory,updateSubCategory,deleteCategory}