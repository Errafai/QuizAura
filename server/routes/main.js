const express = require("express");
const router = express.Router();


/**
 * GET/
 * Home
 */
router.get("/", (req, res)=>{
  res.render("home");
});


/**
 * GET/
 * Quizes
 */
router.get("/games", (req, res)=>{
  res.render("games");
});







module.exports = router;
