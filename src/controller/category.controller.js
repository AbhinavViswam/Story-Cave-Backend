const Category=require("../models/category.models.js")
const Product=require("../models/products.models.js")

const addCategory=async(req,res)=>{
    const {name}=req.body
    try{
    if(!name){
        const categories=await Category.find()
        return res.status(400).render("admin/addcategory",{categories,message:"",error:""})
    }
    const categoryExists=await Category.findOne({name});
    if(categoryExists){
        const categories=await Category.find()
        return res.status(400).render("admin/addcategory",{categories,message:"",error:"Category already Exists"})
    }
    
    const newCategory=await Category.create({name})
    if(!newCategory){
        const categories=await Category.find()
        return res.status(500).render("admin/addcategory",{categories,message:"",error:"Data not stored to database"})
    }
    const categories = await Category.find();
    res.status(200).render("admin/addcategory",{categories,error:"",message:"Category Successfully added"})
}catch(err){
    res.status(500).json({error:"Unknown error occured"})
}
}

const viewCategory=async(req,res)=>{
    
try {
        const categories=await Category.find()
        res.render("admin/addcategory",{categories,error:"",message:""})
} catch (error) {
    res.status(500).json({error:"Unknown eroor occured"})
}
}



const updateCategory=async(req,res)=>{
    const {categoryId}=req.params
    const {categoryName}=req.body;
    try {
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
    
    } catch (error) {
        res.status(500).json({error:"Unknown error occured"})
    }
}

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const productExists=await Product.exists({category:categoryId})
        if(productExists){
            return res.status(400).render("admin/addcategory", { 
                categories: await Category.find(), 
                message: "", 
                error: "Cannot delete category with linked products" 
            });
        }
        
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

module.exports={addCategory,viewCategory,updateCategory,deleteCategory}