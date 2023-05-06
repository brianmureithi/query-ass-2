const mongoose = require('mongoose');
const connectDB = async ()=>{
   const conn = await mongoose.connect('mongodb+srv://devc32012:123456admin@cluster0.3qi0yfw.mongodb.net/Books?retryWrites=true&w=majority')
.then(()=>{
  
    console.log(`Mongo DB connected successfully`)
}).catch((err)=>{
    console.log(err)
})


}

module.exports = connectDB