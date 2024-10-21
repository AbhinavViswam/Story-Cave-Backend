const Product=require("../models/products.models.js")

const addProduct=async (req,res)=>{
    const {name,description,category,price,stock}=req.body
    console.log(name,description,category,price,stock);
    const image=req.file?req.file.path: "no image";
    console.log(image);

    // if(!name || !description || !category || !price || !stock ){
    //     return res.json({message:"All fields are required"})
    // }
    // const add_product=new Product({
    //     name,
    //     description,
    //     category,
    //     price,
    //     rating:0,
    //     stock,
    //     image
    // })
    // const pdct =await add_product.save();
    // if(!pdct){
    //     return res.json({message:"error saving to database"})
    // }
    // res.json({message:"Product added"});
}

module.exports=addProduct