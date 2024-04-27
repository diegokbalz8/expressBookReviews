const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
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

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //let filtered_users = users.filter((user) => user.isbn === isbn);
  res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here  
  const author = req.params.author;
  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter(book => book.author === author);
  res.send(filtered_books);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter(book => book.title === title);
  res.send(filtered_books);
  

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
