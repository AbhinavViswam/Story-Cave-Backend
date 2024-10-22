const Product=require("../models/products.models.js")

const addProduct=async (req,res)=>{
    const {name,description,category,price,stock}=req.body
    console.log(name,description,category,price,stock);
    const image = req.file ? req.file.path.replace('src/public/', '') : "no image";
    console.log(image);

    if(!name || !description || !category || !price || !stock ){
        return res.json({message:"All fields are required"})
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
        return res.json({message:"error saving to database"})
    }
    res.json({message:"Product added"});
}


const viewProduct=async(req,res)=>{
    const products=await Product.find()
    console.log(products);
    res.render('admin/viewproduct',{products});
}


const updateProduct=async(req,res)=>{
    const {id}=req.params;
    const{name,description,price,stock,category}=req.body
    const newImage=req.file?req.files.path:null
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
        return res.json({message:"product not found"})
    }
    res.json({message:"product updated successfully"})
    
}

module.exports={addProduct,updateProduct,viewProduct}