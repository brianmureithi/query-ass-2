const express = require('express');
const cors = require('cors');
const books=require("./data")
const Book = require('./Schema/Book');



const connectDb = require('./config/db') 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 6000
connectDb()

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.static('www'));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval'; connect-src 'self' http://localhost:8000");
    next();
  });
  
  


app.get('/',(req,res)=>{
    console.log(JSON.stringify(books));
    res.send(JSON.stringify(books))
})
app.post('/store-image-data', (req, res) => {
    // Get the data from the request body
    const data = req.body.data;
    const imageData = req.body.imageData;
    let bookData;
  
    // If image data is present, decode the QR code data to a JavaScript object
    if (imageData) {
      const decodedData = JSON.parse(atob(imageData));
      bookData = {
        title: decodedData.title,
        author: decodedData.author,
        year_published: decodedData.year_published,
        pages: decodedData.pages,
        genre: decodedData.genre,
        image: decodedData.image
      };
    } else {
      bookData = JSON.parse(data);
    }
  
    // Store the decoded data in local storage
    let storedData = JSON.parse(localStorage.getItem('bookData')) || [];
    storedData.push(bookData);
    localStorage.setItem('bookData', JSON.stringify(storedData));
  
    // Send a success response
    res.status(200).json({ message: 'Data stored successfully' });
  });



// Endpoint for submitting book data to the cloud
app.post('/submit-to-cloud', (req, res) => {
  const bookData = req.body.books;

  // Insert each book in the bookData array into the "book" collection
  bookData.forEach(book => {
    const newBook = new Book({
      title: book.title,
      author: book.author,
      year_published: book.year_published,
      pages: book.pages,
      genre: book.genre,
      image: book.image
    });
    newBook.save();
  });

  // Send a success response
  res.sendStatus(200);
});

/* Get books endpoint */
app.get('/get_books', (req, res) => {
    Book.find().then(function(books) {
        res.json(books);
      }).catch(function(error) {
        console.log(error);
        res.status(500).send("Error retrieving books");
      });
      
  });
  app.delete('/delete_cloud_data', function(req, res) {
    Book.deleteMany({})
      .then(result => {
        res.status(200).json({ message: 'Data deleted successfully', result: result });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete data from database' });
      });
  });
  
  
  
  

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});