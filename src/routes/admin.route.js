const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/AdminAuth.middleware.js');
const upload = require("../middleware/multer.middleware.js")
const { addProduct, updateProduct, viewProduct, getProductDetails, deleteProduct, deleteProductConfirmation, blockUnblockProduct, showCategoriesWithSubcategories } = require("../controller/product.controller.js")
const { addCategory, addSubCategory } = require("../controller/category.controller.js")

router.get('/dashboard', verifyAdmin, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

router.route("/add-product")
    .get(verifyAdmin, showCategoriesWithSubcategories)
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


router.route("/add-category")
    .get(verifyAdmin, (req, res) => {
        res.render("admin/addcategory", { error: "", message: "" });
    })
    .post(verifyAdmin, (req, res) => {
        addCategory(req, res);
    });
router.route("/add-sub-category")
    .get(verifyAdmin, (req, res) => {
        res.render("admin/addsubcategory", { error: "", message: "",categories });
    })
    .post(verifyAdmin, (req, res) => {
        addSubCategory(req, res);
    });
module.exports = router;