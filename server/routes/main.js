const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const jwt = require("jsonwebtoken");


/**
 * GET/
 * Home
 */
router.get("/", async (req, res) => {
  try {
    const quizes = await Quiz.find(); // Fetch quizzes from the database
    const token = req.cookies.token;

    console.log(token);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        console.log("stop");
        return res.redirect("/dashboard"); // Redirect to the dashboard if token is valid
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          console.log("Token expired:", error.expiredAt);
          res.clearCookie("token"); // Clear the expired token
          return res.render("home", { quizes, message: "Your session has expired. Please log in again." });
        } else {
          console.log("Token verification failed:", error.message);
          res.clearCookie("token"); // Clear invalid tokens
          return res.render("home", { quizes, message: "Invalid token. Please log in again." });
        }
      }
    }

    // No token, render the home page with quizzes
    res.render("home", { quizes });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).send("Internal Server Error");
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
