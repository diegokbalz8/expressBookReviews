const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn]
  if (book) { //Check if book exists
    const username = req.session.authorization.username; // Obtiene el nombre de usuario de la sesión
    const reviewText = req.body.review; // Obtiene el texto de la reseña desde la consulta de la solicitud
    if (!reviewText) {
      return res.status(400).send('No review text provided.');
    }

    // Busca si el usuario ya ha dejado una reseña para este libro
    const existingReviewIndex = book.reviews.findIndex(review => review.username === username);
    if (existingReviewIndex !== -1) {
      // Si el usuario ya ha dejado una reseña, modifica la reseña existente
      book.reviews[existingReviewIndex].review = reviewText;
      res.send(`Review modified for book with ISBN ${isbn}.`);
    } else {
      // Si el usuario no ha dejado una reseña previa, agrega una nueva reseña
      book.reviews.push({username: username, review: reviewText});
      res.send(`Review added to book with ISBN ${isbn}.`);
    }
  } else {
      res.send("Unable to find book!");
  }
});

//delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) { // Verificar si el libro existe
      if (!book.reviews) {
        return res.status(404).send("No reviews found for this book.");
      }
      const username = req.session.authorization.username; // Asumiendo que el username está almacenado así en la sesión
      const originalReviewCount = book.reviews.length;
      book.reviews = book.reviews.filter(review => review.username !== username); // Filtrar y dejar solo las reseñas no del usuario
  
      if (originalReviewCount === book.reviews.length) {
        return res.send('No review by the user found or deleted.');
      }
  
      books[isbn] = book; // actualizar el libro con la lista de reseñas filtrada
      res.send(`Review by ${username} on book with ISBN ${isbn} has been deleted.`);
    } else {
      res.status(404).send("Book not found.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
