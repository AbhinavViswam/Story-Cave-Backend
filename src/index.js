require("dotenv").config({path:"./.env"})

const app=require("./app.js")
const connect_DB=require("./db/index.js")

connect_DB().then(()=>{
    app.listen(3000 || process.env.PORT,()=>{
        console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
    })
}).catch(err=>console.log("Error in connecting to DB"))