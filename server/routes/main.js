const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const jwt = require("jsonwebtoken");


/**
 * GET/
 * Home
 */
router.get("/", async (req, res)=>{
  const quizes =  await Quiz.find();
  const token = req.cookies.token;
  console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.clearCookie("token");
    }
  }
  else{
    res.render("home", {quizes});
  }
});


/**
 * GET/
 * Quizes
 */
router.get("/games", async (req, res)=>{
  const quizes =  await Quiz.find();
  res.render("games", {quizes});
});







module.exports = router;
