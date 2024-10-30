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

module.exports={addCategory,viewCategory,updateCategory,deleteCategory}