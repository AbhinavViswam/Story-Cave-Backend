
const Product=require("../models/products.models.js")
const Category=require("../models/category.models.js")
const fs=require("fs")

const addProduct=async (req,res)=>{
    const categories=await Category.find();

    const {name,description,author,language,category,price,offerprice,stock}=req.body;
   
    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";
   
    try {
        if(!name || !description || !author || !language || !category || !price || !stock ){
            res.status(400).render("admin/addproduct",{error:"All Fields are required",message:""})
        }
        const add_product=new Product({
            name,
            description,
            author,
            language,
            category,
            price,
            offerprice,
            rating:0,
            stock,
            image: image ? '/productImages/' + image.split('/').pop() : ''
        })
        const pdct =await add_product.save();
        if(!pdct){
            res.status(500).render("admin/addproduct",{error:"error saving to database",message:"",categories})
        }
        res.status(200).render("admin/addproduct",{error:"",message:"Product added",categories});
    } catch (error) {
        res.status(500).render("admin/addproduct",{error:"error saving to database",message:"",categories})
    }
}

const viewProduct=async(req,res)=>{
    try {
        const products=await Product.find().populate('category')
        res.status(200).render('admin/viewproduct',{products});
    } catch (error) {
        res.status(500).json({error:"Error to fetch data"})
    }
}

const getProductDetails = async (req, res) => {
    const { id } = req.params;
    const categories=await Category.find();
    try {
        const product = await Product.findById(id).populate('category')
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).render("admin/updateproduct", { product ,categories,message:"",error:""});
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const updateProduct=async(req,res)=>{
    try {
        const {id}=req.params;
        const{name,description,price,stock,category,language,offerprice,author}=req.body
        const image=req.file ? req.file.path.replace(/\\/g, "/") : "";
        const product = await Product.findById(id);
        if (!product) {
                return res.status(404).json({ message: "Product not found",name,description,price,language,offerprice,author,stock,category,message:"",error:""});
            }
        if(!name || !description || !price || !stock || !category || !author || !offerprice || !language){
            return res.status(400).json({message:"all fields are required",name,description,price,language,offerprice,author,stock,category,message:"",error:""})
        }
    
        const updateData=await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                language,
                offerprice,
                author,
                stock,
                category,
                image: image ? '/productImages/' + image.split('/').pop() : product.image
            },
            {new:true}
        )
        if(!updateData){
            res.status(404).redirect('/admin/view-product')
        }
        res.status(200).redirect("/admin/view-product")
    } catch (error) {
        console.log("error occured during updating");
        res.send("Cannot update product")
    }
    
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
            const product = await Product.findById(id).populate('category');
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).render("admin/deleteproduct",{pdct_id:id,product:product})
    } catch (error) {
        res.send("cannot delete now")
    }
};

const deleteProductConfirmation=async(req,res)=>{
    try {
        const { id } = req.params;
        const product=await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).redirect("/admin/view-product");
    } catch (error) {
        res.send("Cannot delete")
    }
}

const blockUnblockProduct=async(req,res)=>{
   try {
     const {id}=req.params;
     const product=await Product.findById(id)
     if (!product) {
         return res.status(404).json({ error: "Product not found" });
     }
     product.isBlocked=!product.isBlocked;
 
     await product.save()
     
     res.status(200).redirect("/admin/view-product");
   } catch (error) {
    res.send("unable to block")
   } 
}

module.exports={addProduct,updateProduct,viewProduct,getProductDetails,deleteProduct,deleteProductConfirmation,blockUnblockProduct}