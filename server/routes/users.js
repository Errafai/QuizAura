const express = require("express");
const router = express.Router();
const usersLayout = "../views/layouts/users"
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
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
          const {identifier, password} = req.body;

          const user = await User.findOne({$or: [{username: identifier}, {email: identifier}]});
          if (!user) {
            return res.render("users/login", {error: "Invalide Cridentials"});
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.render("users/login", {error: "Invalide Cridentials"});
          }
          
          const token = jwt.sign({userId: user._id} ,jwtSecret);
          res.cookie("token", token, {httpOnly: true});
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
          const {username, password, email, password_again} = req.body;
          const hashedPassword = await bcrypt.hash(password, 10);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email"});
          }
          if (password !== password_again) {
            return res.status(400).json({message: "Passwords do not match"});
          }
          try {
           const user = await User.create({username, password:hashedPassword, email});
           res.status(201).json({
            message: "User Created", user
           });
          } catch (error) {
            if (error.code === 11000 ) {
              res.status(409).json({message: "User already in use"});
            }
            res.status(500).json({message: "Internal server error"})
          }
      } catch (error) {
         console.log(error) 
      }
});

module.exports = router;