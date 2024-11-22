const User=require('../models/user.models.js')
const Orders=require('../models/order.models.js')

const listUser=async(req,res)=>{
    const users=await User.find()
    if(!users){
        return res.render("admin/listuser",{err:"No registered Users",users:""})
    }
    res.render("admin/listuser",{err:"",users})
}

const blockUnblockUser=async(req,res)=>{
    const {userId}=req.params;
    const user=await User.findById(userId)
    if(!user){
        return res.status(404).json({error:"User does not exists"})
    }
    user.isBlocked = !user.isBlocked
    await user.save()
    res.redirect('/admin/list-user')
}

const showAllOrders=async(req,res)=>{
    const {status}=req.query
    const filter={}
    if(status){
        filter.status=status
    }
    const orders=await Orders.find(filter).populate('items.productid')
    res.render("admin/order",{orders,selectedStatus:status || ""})
}

const updateOrderStatus=async(req,res)=>{
    const {orderId,status}=req.body;
    await Orders.findByIdAndUpdate(orderId,{
        status
    })
    res.redirect("/admin/orders")
}

module.exports={listUser,blockUnblockUser,showAllOrders,updateOrderStatus};