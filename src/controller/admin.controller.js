const User=require('../models/user.models.js')
const Orders=require('../models/order.models.js')

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

module.exports={listUser,blockUnblockUser,showAllOrders,updateOrderStatus,ShowOrderDetails};