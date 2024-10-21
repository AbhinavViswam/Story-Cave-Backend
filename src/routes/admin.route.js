const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/AdminAuth.middleware.js');
const upload=require("../middleware/multer.middleware.js")
const addProduct=require("../controller/product.controller.js")

router.get('/dashboard', verifyAdmin, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

router.route("/add-product")
    .get(verifyAdmin, (req, res) => {
        res.render("admin/addproduct", { error: "" });
    })
    .post(verifyAdmin, upload.single('image'), (req, res) => {
        addProduct(req, res);
    });
module.exports = router;
