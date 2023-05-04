const express = require('express');
const cors = require('cors');

const connectDb = require('./config/db') 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 6000
connectDb()


app.use(cors());
app.use(express.json());
app.use(express.static('www'));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval'; connect-src 'self' http://localhost:8000");
    next();
  });
  
  


app.get('/',(req,res)=>{
    res.send("Hello no dapi")
})
app.post('/store-image-data', (req, res) => {
    // Get the image data from the request body
    const imageData = req.body.imageData;
res.send(imageData)
  /*   // Decode the QR code data to a JavaScript object
    const decodedData = JSON.parse(atob(imageData));
    
    // Store the decoded data in local storage
    const bookData = {
        title: decodedData.title,
        author: decodedData.author,
        year_published: decodedData.year_published,
        pages: decodedData.pages,
        genre: decodedData.genre,
        image: decodedData.image
    };
    
    let storedData = JSON.parse(localStorage.getItem('bookData')) || [];
    storedData.push(bookData);
    localStorage.setItem('bookData', JSON.stringify(storedData));
    
    // Send a success response
    res.status(200).send("Data stored successfully."); */
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});