const User=require('../models/user.models.js')
const Orders=require('../models/order.models.js')
const Product=require("../models/products.models.js")

const listUser=async(req,res)=>{
    
    try {
        const users=await User.find()
        if(!users){
            return res.render("admin/listuser",{err:"No registered Users",users:""})
        }
        res.render("admin/listuser",{err:"",users})
    } catch (error) {
        res.render("admin/listuser",{err:"Some Internal Error Occurred",users:""})
    }
}

const blockUnblockUser=async(req,res)=>{
    const {userId}=req.params;
    try {
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User does not exists"})
        }
        user.isBlocked = !user.isBlocked
        await user.save()
        res.redirect('/admin/list-user')
    } catch (error) {
        res.send("Some Internal error Occured, Cannot Block User Right now")
    }
}

const showAllOrders=async(req,res)=>{
    try {
        const {status}=req.query
        const filter={}
        if(status){
            filter.status=status
        }
        const orders=await Orders.find(filter).populate('items.productid')
        res.render("admin/order",{orders,selectedStatus:status || ""})
    } catch (error) {
        res.send("Some Internal error Occured, Cannot Show Orders")
    }
}

const updateOrderStatus=async(req,res)=>{
    try {
        const {orderId,status}=req.body;
        await Orders.findByIdAndUpdate(orderId,{
            status
        })
        res.redirect("/admin/orders")
    } catch (error) {
        res.send("Some Internal error Occured, Cannot Update Order Status")
    }
}


const ShowOrderDetails=async(req,res)=>{
    const {orderid}=req.params
    const order=await Orders.findById(orderid).populate('items.productid')
    res.render("admin/orderDetails",{order})
}


const monthlyIncome=async(req,res,next)=>{
    const order=await Orders.aggregate([
        {
            $match:{paymentStatus:'completed'}
        },
        {
            $group:{
                _id:{
                    year:{
                        "$year":"$createdAt"
                    },
                    month:{
                        "$month":"$createdAt"
                    }
                },
                totalIncome:{
                    $sum:"$totalAmount"
                }
            }
        },
        {
            $sort:{
                "_id.year":1,
                "_id.month":1
            }
        }
    ])
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const Income = order.map(item => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1],
        totalIncome: item.totalIncome
    }));
    req.income=Income
    next();
}


const topProducts=async(req,res,next)=>{
    const top5=await Orders.aggregate([
        {$unwind:"$items"},
        {
            $group:{
                _id:"$items.productid",
                totalQuantity:{$sum:"$items.quantity"},
                totalRevenue: { $sum: "$items.price" } 
            }
        },
        {$sort:{totalQuantity:-1}},
        {$limit:5},
        {
            $lookup:{
                from:"products",
                localField:"_id",
                foreignField:"_id",
                as:"productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project:{
                _id:0,
                name:"$productDetails.name",
                totalQuantity:1,
                totalRevenue:1,
                image: "$productDetails.image"
            }
        }
    ])
    res.render("admin/top5",{top5})
}

const categoryWiseSales = async (req, res) => {
    try {
        const sales = await Orders.aggregate([
          
            { $unwind: "$items" },

            {
                $lookup: {
                    from: "products",
                    localField: "items.productid",
                    foreignField: "_id", 
                    as: "productDetails" 
                }
            },

           
            { $unwind: "$productDetails" },

          
            {
                $lookup: {
                    from: "categories", 
                    localField: "productDetails.category", 
                    foreignField: "_id", 
                    as: "categoryDetails" 
                }
            },

            { $unwind: "$categoryDetails" },

        
            {
                $group: {
                    _id: "$categoryDetails._id", 
                    categoryName: { $first: "$categoryDetails.name" }, 
                    totalQuantity: { $sum: "$items.quantity" }, 
                    totalRevenue: { $sum: "$items.price" } 
                }
            },

            {
                $project: {
                    _id: 0, 
                    categoryId: "$_id",
                    categoryName: 1, 
                    totalQuantity: 1, 
                    totalRevenue: 1 
                }
            }
        ]);
        res.render("admin/category-sales", { sales });
    } catch (error) {
        console.error("Error in categoryWiseSales:", error);
        res.status(500).send("Internal Server Error");
    }
};


const showReviews=async(req,res)=>{
    const review =await Product.aggregate([
        {$unwind:"$ratings"},
        {
            $lookup:{
                from:"users",
                localField:"ratings.userid",
                foreignField:"_id",
                as:"userDetails"
            }
        },
        {
            $project:{
                fullName:"$userDetails.fullName",
                name:1,
                image:1,
                rating:"$ratings.rating",
                comment:"$ratings.comment",
            }
        }
    ])
    res.render("admin/ratings",{review})
}


const onlineOfflinePayment = async (req, res) => {
    try {
        const results = await Orders.aggregate([
            {
                $facet: {
                    onlinePayments: [
                        { $match: { paymentMethod: { $in: ['card', 'upi', 'wallet'] } } },
                        {
                            $project: {
                                userid: 1,
                                items: 1,
                                totalAmount: 1,
                                status: 1,
                                address: 1,
                                paymentMethod: 1,
                                paymentStatus: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    cashOnDelivery: [
                        { $match: { paymentMethod: 'cash-on-delivery' } },
                        {
                            $project: {
                                userid: 1,
                                items: 1,
                                totalAmount: 1,
                                status: 1,
                                address: 1,
                                paymentMethod: 1,
                                paymentStatus: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const data = results[0];

        res.render('admin/onlineAndOfflinePayment', {
            onlinePayments: data.onlinePayments,
            cashOnDelivery: data.cashOnDelivery,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const monthlyProfit=async(req,res,next)=>{
    const profitData = await Orders.aggregate([
        {
            $match: { status: 'delivered', paymentStatus: 'completed' }
        },
        {
            $unwind: '$items'
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                totalProfit: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    req.profitdata=profitData;
    next();
}

const PDFDocument = require('pdfkit');

const downloadSalesReport=async(req,res)=>{
    try {
       
        const orders = await Orders.find().select(
            '_id totalAmount paymentMethod status address createdAt'
        );


        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');

       
        doc.pipe(res);

       
        doc.fontSize(20).text('Sales Report', { align: 'center' });
        doc.moveDown();

     
        doc.fontSize(11).text('Order ID | Total Amount | Payment Method | Status | Address | Created At');
        doc.moveDown();

        orders.forEach(order => {
            doc.text(
                `${order._id} | $${order.totalAmount} | ${order.paymentMethod} | ${order.status} | ${order.address} | ${new Date(order.createdAt).toLocaleDateString()}`
            );
        });

      
        doc.end();

    } catch (err) {
        console.error('PDF Report Error:', err.message);
        res.status(500).send('Unable to generate the report');
    }
}

module.exports={listUser,blockUnblockUser,showAllOrders,updateOrderStatus,ShowOrderDetails,monthlyIncome,topProducts,categoryWiseSales,showReviews,onlineOfflinePayment,monthlyProfit,downloadSalesReport};