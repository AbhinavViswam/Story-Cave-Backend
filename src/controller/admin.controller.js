const User=require('../models/user.models.js')

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
module.exports={listUser,blockUnblockUser};