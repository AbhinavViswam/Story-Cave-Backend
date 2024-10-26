const {Category,Subcategory}=require('../models/category.models.js')

const addCategory=async(req,res)=>{
   const{name}=req.body;
   if(!name){
    return res.status(400).json({error:"Name is required"});
   }
   const category=new Category({
    name
   })
   await category.save();
   res.status(200).json({message:"Done"})
}

const addSubCategory=async(req,res)=>{
    const {name,categoryid}=req.body
    if(!name || !categoryid){
        return res.status(400).json({message:"All fields are required"});
    }
    const subcategory=new Subcategory({
        name,
        categoryid
    })
    await subcategory.save();
    await Category.findByIdAndUpdate(categoryid, { $push: { subcategories: subcategory._id } });
    res.render("admin/addsubcategory", { error: "", message: "Subcategory added successfully", categories: await Category.find() });
}


module.exports={addCategory,addSubCategory}