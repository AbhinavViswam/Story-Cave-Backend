const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/AdminAuth.middleware.js');
const upload=require("../middleware/multer.middleware.js")
const {addProduct,updateProduct,viewProduct,getProductDetails}=require("../controller/product.controller.js")

router.get('/dashboard', verifyAdmin, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

router.route("/add-product")
    .get(verifyAdmin, (req, res) => {
        res.render("admin/addproduct", { error: "" ,message:""});
    })
    .post(verifyAdmin, upload.single('image'), (req, res) => {
        addProduct(req, res);
    });
router.route("/view-product")
.get(verifyAdmin,(req,res)=>{
    viewProduct(req,res)
})

router.route("/update-product/:id")
.get(verifyAdmin,(req,res)=>{
    getProductDetails(req,res);
})
.post(verifyAdmin,upload.single('image'),(req,res)=>{
    updateProduct(req,res);
})

module.exports = router;
