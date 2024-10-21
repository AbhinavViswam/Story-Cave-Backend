const express=require("express")
const ejs= require('ejs')
const path= require('path')
const cookieParser=require('cookie-parser')

const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));

const userRouter=require('./routes/user.route.js')

app.use('/users',userRouter)
app.get('/', (req, res) => {
    res.redirect('/users/login'); 
  });
const adminRouter = require('./routes/admin.route.js');
app.use('/admin', adminRouter);

module.exports=app