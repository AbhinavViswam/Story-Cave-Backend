const Product=require("../models/products.models.js")
const Orders=require("../models/order.models.js")

const rate=async(req,res)=>{

    const {rating,comment}=req.body
    const {orderId,productId}=req.params
    const userid=req.user._id
    const product = await Product.findOne({_id:productId})
    product.ratings.push({ userid, rating, comment });
    product.numOfRatings += 1;
    product.averageRating =
        (product.averageRating * (Number(product.numOfRatings - 1)) + Number(rating)) /Number(product.numOfRatings);

    await product.save();
    await Orders.updateOne(
        { _id: orderId, "items.productid": productId },
        { $set: { "items.$.rated": true } }
    );
    res.redirect(`/users/myorders`)
}

module.exports=rate;