const mongoose=require('mongoose')

const connect_DB=async function(){
  try {
    const Connection=await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
    console.log("Connected to MONGODB");
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR");
  }
}

module.exports=connect_DB