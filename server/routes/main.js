const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const jwt = require("jsonwebtoken");
const Result = require("../models/Result");
const User = require("../models/User");
const nodemailer = require("nodemailer");


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
router.get("/games", async (req, res) => {
  try {
    const token = req.cookies.token;
    const quizes = await Quiz.find();
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      const results = await Result.find({ userId: decoded.userId });
      return res.render("users/games_user", { quizes, layout: "layouts/users", user, results });
    }
    res.render("games", { quizes });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET/
 * about us
 */
router.get("/about", async (req, res) => {
  try {
    const token = req.cookies.token;
    const quizes = await Quiz.find();
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      return res.render("about", {layout: "layouts/users", user, quizes });
    }
    res.render("about", { quizes });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET/
 * contact us
 */
router.get("/contact", async (req, res) => {
  try {
    const token = req.cookies.token;
    const quizes = await Quiz.find();
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      return res.render("contact", {layout: "layouts/users", user, quizes });
    }
    res.render("contact", { quizes });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * POST/
 * contact us
 */
router.post("/submit-contact", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  try {
    // If you want to process the contact details (e.g., save to a database), do it here
    console.log("Contact form submitted:", { firstName, lastName, email, message });

    // Optional: Send an email notification with the contact form details (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any other email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: email, // Sender's email address
      to: "contact@quizaura.com", // Receiver's email address
      subject: `Contact Form Submission from ${firstName} ${lastName}`,
      text: `You have received a new message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    alert("Email sent successfully");
    res.render("/");
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
module.exports = router;
