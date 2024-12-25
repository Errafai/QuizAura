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
  res.render("users/register");
});

/**
 * POST / 
 * Admin - register
 */

router.post("/register", async (req, res) =>
  {
      
      try {
          const {username, password, email, password_again, terms, news} = req.body;

          const hashedPassword = await bcrypt.hash(password, 10);

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email"});
          }

          const termsAccepted = terms === "on" ? true : false;
          const subscribed = news === "on" ? true : false;

          if (!terms) {
            return res.status(400).json({message: "You must accept the terms"});
          }

          if (password !== password_again) {
            return res.status(400).json({message: "Passwords do not match"});
          }

          try {
           const user = await User.create({username, password:hashedPassword, email, termsAccepted, subscribed});
           res.status(201).json({
            message: "User Created", user
           });

          } catch (error) {
            if (error.code === 11000 ) {
              res.status(409).json({message: "User already in use"});
            }
            res.status(500).json({message: "Internal server error"});
            console.log(error);
          }
      } catch (error) {
         console.log(error) 
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