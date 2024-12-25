const express = require("express");
const router = express.Router();
const usersLayout = "../views/layouts/users"
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;



/**
 * check cookies
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.redirect("/login");

  }
};

/**
 * GET |
 * login page
 */
router.get('/login', async (req, res) => {
    res.render("users/login", {error: null});
});
/**
 * POST
 * login
 */
router.post("/login", async (req, res) =>
  {
      
      try {
          const {identifier, password, rememberMe} = req.body;

          const user = await User.findOne({$or: [{username: identifier}, {email: identifier}]});
          if (!user) {
            return res.render("users/login", {error: "Invalide Cridentials"});
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return res.render("users/login", {error: "Invalide Cridentials"});
          }

          const tokenExpire = rememberMe ? "7d" : "1h";
          const token = jwt.sign({userId: user._id} ,jwtSecret, {expiresIn: tokenExpire});
          res.cookie("token", token, {httpOnly: true}, {maxAge: rememberMe ? 604800000 : 3600000});
          res.redirect('/');
          
      } catch (error) {
         console.log(error) 
      }
});

/**
 * GET |
 * register page
 */
router.get('/register', async (req, res) => {
  res.render("users/register", {error: null});
});

/**
 * POST / 
 * Admin - register
 */

router.post("/register", async (req, res) =>
  {
      
      try {
          const {username, password, email, password_again, terms, news} = req.body;
          const error = {};
          const hashedPassword = await bcrypt.hash(password, 10);

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            error.email = "Invalid email";
          } else if (!email) {
            error.email = "Please enter an email";
          }

          const termsAccepted = terms === "on" ? true : false;
          const subscribed = news === "on" ? true : false;

          if (!termsAccepted) {
            error.terms = "You must accept the terms";
          }

          if (password !== password_again) {
            error.password = "Passwords do not match";
          }
          
          const userExists = await User.findOne({username});
          
          if (userExists) {
            error.userExists = "User already exists";
          } else if (!username) {
            error.userExists = "Please enter a username";
          }

          if (Object.keys(error).length > 0) { 
            return res.render("users/register", {error, username, email});
          }

           const user = await User.create({username, password:hashedPassword, email, termsAccepted, subscribed});
           res.status(201).json({
            message: "User Created", user
           });
      } catch (error) {
         console.log(error);
         res.status(500).json({message: "Internal server error"});
      }
});

/** 
 * POST /logout
*/
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/login');
});

module.exports = router;