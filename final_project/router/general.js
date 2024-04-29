const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router(); 
const axios = require('axios').default;



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books,null,4));
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Get booklist using Promise callbacks or async-await with Axios
public_users.get('/books', function (req, res) {
    axios.get('https://diegocabalce-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai')
        .then(response => {
            res.send(JSON.stringify(response.data.books, null, 4));
            console.log("Promise for Task 10 resolved");
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching books:', error);
            res.status(500).send('Error fetching books');
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //let filtered_users = users.filter((user) => user.isbn === isbn);
  res.send(JSON.stringify(books[isbn],null,4));
 });
  
 // Get book details based on ISBN using Promise callbacks or async-await with Axios
 public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`https://diegocabalce-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books?isbn=${isbn}`)
      .then(response => {
        res.send(JSON.stringify(response.data, null, 4));
        console.log("Promise for Task 11 resolved");
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
        res.status(500).send('Error fetching book details');
      });
  });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here  
  const author = req.params.author;
  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter(book => book.author === author);
  res.send(filtered_books);

});

 // Get book details based on author using Promise callbacks or async-await with Axios
public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    axios.get(`https://diegocabalce-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books?author=${author}`)
      .then(response => {
        res.send(JSON.stringify(response.data, null, 4));
        console.log("Promise for getting book details by author resolved");
      })
      .catch(error => {
        console.error('Error fetching book details by author:', error);
        res.status(500).send('Error fetching book details by author');
      });
  });



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter(book => book.title === title);
  res.send(filtered_books);
  
});

 // Get book details based on title using Promise callbacks or async-await with Axios
public_users.get('/books/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`https://diegocabalce-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books?title=${title}`)
      .then(response => {
        res.send(JSON.stringify(response.data, null, 4));
        console.log("Promise for getting book details by title resolved");
      })
      .catch(error => {
        console.error('Error fetching book details by author:', error);
        res.status(500).send('Error fetching book details by title');
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
//Write your code here
const isbn = req.params.isbn

//let filtered_users = users.filter((user) => user.isbn === isbn);
res.send(JSON.stringify(books[isbn].reviews,null,4));
  
//return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
