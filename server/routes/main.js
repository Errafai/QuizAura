const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");


/**
 * GET/
 * Home
 */
router.get("/", async (req, res)=>{
  const quizes =  await Quiz.find();
  res.render("home", {quizes});
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
