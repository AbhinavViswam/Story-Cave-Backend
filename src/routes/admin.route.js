const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/AdminAuth.middleware.js');
const upload = require("../middleware/multer.middleware.js")
const { addProduct, updateProduct, viewProduct, getProductDetails, deleteProduct, deleteProductConfirmation, blockUnblockProduct} = require("../controller/product.controller.js")


router.get('/dashboard', verifyAdmin, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

router.route("/add-product")
.get(verifyAdmin, (req, res) => {
    res.status(200).render("admin/addproduct",{error:"",message:""})
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
module.exports = router;