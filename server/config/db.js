const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async ()=>{
   const conn = await mongoose.connect('mongodb+srv://devc32012:123456admin@cluster0.3qi0yfw.mongodb.net/Books?retryWrites=true&w=majority' || 'mongodb://localhost:5000/Books',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{
  
    console.log(`Mongo DB connected successfully`)
}).catch((err)=>{
    console.log(err)
})


}

module.exports = connectDB