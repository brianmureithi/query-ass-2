const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  year_published: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  image: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
