const Product=require("../models/products.models.js")

const addProduct=async (req,res)=>{
    const {name,description,category,price,stock}=req.body
   
    const image = req.file ? req.file.path.replace('src/public/', '') : "no image";
   

    if(!name || !description || !category || !price || !stock ){
        res.render("admin/addproduct",{error:"All Fields are required",message:""})
    }
    const add_product=new Product({
        name,
        description,
        category,
        price,
        rating:0,
        stock,
        image
    })
    const pdct =await add_product.save();
    if(!pdct){
        res.render("admin/addproduct",{error:"error saving to database",message:""})
    }
    res.render("admin/addproduct",{error:"",message:"Product added"});
}

const viewProduct=async(req,res)=>{
    const products=await Product.find()
    res.render('admin/viewproduct',{products});
}

const getProductDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.render("admin/updateproduct", { product });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


const updateProduct=async(req,res)=>{
    const {id}=req.params;
    const{name,description,price,stock,category}=req.body
    const newImage=req.file?req.file.path:null
    const product = await Product.findById(id);
    if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

    if(!name || !description || !price || !stock || !category){
        return res.json({message:"all fields are required"})
    }

    const updateData=await Product.findByIdAndUpdate(
        id,
        {
            name,
            description,
            price,
            stock,
            category,
            image:newImage?newImage:product.image
        },
        {new:true}
    )
    if(!updateData){
        res.status(404).redirect('/admin/view-product')
    }
    res.status(200).redirect("/admin/view-product")
    
}

module.exports={addProduct,updateProduct,viewProduct,getProductDetails}