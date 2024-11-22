const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/AdminAuth.middleware.js');
const upload = require("../middleware/multer.middleware.js")
const { addProduct, updateProduct, viewProduct, getProductDetails, deleteProduct, deleteProductConfirmation, blockUnblockProduct} = require("../controller/product.controller.js");
const { addCategory, viewCategory, updateCategory,deleteCategory} = require('../controller/category.controller.js');
const Category = require('../models/category.models.js');
const {listUser,blockUnblockUser,showAllOrders,updateOrderStatus} = require('../controller/admin.controller.js');
 
router.get('/dashboard', verifyAdmin, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

router.route("/add-product")
.get(verifyAdmin,async (req, res) => {
    const categories=await Category.find();
    res.status(200).render("admin/addproduct",{error:"",message:"",categories})
})
    .post(verifyAdmin, upload.single('image'), (req, res) => {
        addProduct(req, res);
    });
router.route("/view-product")
    .get(verifyAdmin, (req, res) => {
        viewProduct(req, res)
    })

router.route("/update-product/:id")
    .get(verifyAdmin, (req, res) => {
        getProductDetails(req, res);
    })
    .post(verifyAdmin, upload.single('image'), (req, res) => {
        updateProduct(req, res);
    })

router.route("/delete-product/:id")
    .post(verifyAdmin, (req, res) => {
        deleteProduct(req, res);
    })

router.route("/delete-product/:id/confirm")
    .post(verifyAdmin, (req, res) => {
        deleteProductConfirmation(req, res);
    })
    .get(verifyAdmin, (req, res) => {
        res.render("admin/deleteproduct", { id: "" })
    })

router.route("/block-unblock-product/:id")
    .post(verifyAdmin, (req, res) => {
        blockUnblockProduct(req, res);
    })

//category

router.route("/add-category")
.post(verifyAdmin,(req,res)=>{
    addCategory(req,res)
})
.get(verifyAdmin,(req,res)=>{
    viewCategory(req,res)
})

router.route("/update-category/:categoryId")
.post(verifyAdmin, (req,res)=>{
    updateCategory(req,res)
})
.get(verifyAdmin,async (req,res)=>{
    const {categoryId}=req.params
    const category=await Category.findById(categoryId)
    res.render("admin/updatecategory",{categoryid:categoryId,error:"",message:"",categoryName:category.name})
})

router.route("/delete-category/:categoryId")
.post(verifyAdmin, (req,res)=>{
    deleteCategory(req,res)
})

// user

router.route("/list-user")
.get(verifyAdmin,(req,res)=>{
    listUser(req,res);
})
router.route("/list-user/:userId/block-unblock")
.post(verifyAdmin,(req,res)=>{
    blockUnblockUser(req,res)
})

//orders
router.route("/orders")
.get(verifyAdmin,(req,res)=>{
    showAllOrders(req,res);
})

router.route("/orders/updatestatus")
.post((req,res)=>{
    updateOrderStatus(req,res);
})

module.exports = router;