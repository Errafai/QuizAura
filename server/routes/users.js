const express = require("express");
const router = express.Router();
const usersLayout = "../views/layouts/users"
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { find } = require("lodash");
const { route } = require("./main");
const quizLayout = "../views/layouts/quiz";


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
    const quizes = await Quiz.find();
    res.render("users/login", {error: null, quizes });
});
/**
 * POST
 * login
 */
router.post("/login", async (req, res) =>
  {
      
      try {
          const {identifier, password, rememberMe} = req.body;
          const quizes = await Quiz.find();

          const user = await User.findOne({$or: [{username: identifier}, {email: identifier}]});
          if (!user) {
            return res.render("users/login", {error: "Invalide Cridentials", quizes});
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return res.render("users/login", {error: "Invalide Cridentials", quizes});
          }

          const tokenExpire = rememberMe ? "7d" : "1h";
          const token = jwt.sign({userId: user._id} ,jwtSecret, {expiresIn: tokenExpire});
          res.cookie("token", token, {httpOnly: true}, {maxAge: rememberMe ? 604800000 : 3600000});
          res.user = user;
          res.redirect('/dashboard');
          
      } catch (error) {
         console.log(error) 
      }
});

/**
 * GET |
 * dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  const quizes = await Quiz.find();
  const results = await Result.find({userId: req.userId});
  
  res.render("users/dashboard", {error: null, layout: usersLayout, user, quizes, results});  
});

/**
 * GET |
 * profile
 */
router.get('/user', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  const quizzes = await Quiz.find();
  const results = await Result.find({userId: req.userId});
  console.log(results);
  res.render("users/user", {error: null, layout: usersLayout, user, quizzes, results});
});

/**
 * GET |
 * register page
 */
router.get('/register', async (req, res) => {
  const quizes = await Quiz.find();
  res.render("users/register", {error: null, quizes});
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
          const quizes = await Quiz.find();

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
            return res.render("users/register", {error, username, email, quizes });
          }

           const user = await User.create({username, password:hashedPassword, email, termsAccepted, subscribed});
           const tokenExpire = "1h";
           const token = jwt.sign({userId: user._id} ,jwtSecret, {expiresIn: tokenExpire});
           res.cookie("token", token, {httpOnly: true}, {maxAge: rememberMe ? 604800000 : 3600000});
           res.user = user;
           res.redirect("/dashboard");
      } catch (error) {
         console.log(error);
         res.status(500).json({message: "Internal server error"});
      }
});


// GET /quizzes
router.get('/quizzes/:id/start', authMiddleware, async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);

    // Check if the user has already started this quiz
    let result = await Result.findOne({ userId, quizId });

    if (!result) {
      // Create a new result document
      result = new Result({
        userId,
        quizId,
        currentQuestionIndex: 0,
        answers: [],
      });
      await result.save();
    }

    // Fetch the quiz and current question
    const quiz = await Quiz.findById(quizId);
    const currentQuestion = quiz.questions[result.currentQuestionIndex];

    res.render('users/quiz',{ quiz, currentQuestion, result , user, layout: quizLayout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST /quizzes/:id/next
router.post('/quizzes/:id/next', authMiddleware, async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.userId;
    const { questionId, selectedOption } = req.body;
    const user = await User.findById(userId);

    // Find the result document
    const result = await Result.findOne({ userId, quizId });
    if (!result) return res.status(404).json({ message: 'No progress found for this quiz.' });

    // Save the user's answer
    result.answers.push({ questionId, selectedOption });

    // Move to the next question
    const quiz = await Quiz.findById(quizId);
    result.currentQuestionIndex += 1;

    // If there are no more questions, redirect to the finish route
    if (result.currentQuestionIndex >= quiz.questions.length) {
      await result.save();
      return res.redirect(`/quizzes/${quizId}/finish`);
    }

    // Save progress and fetch the next question
    await result.save();
    const nextQuestion = quiz.questions[result.currentQuestionIndex];
    res.render('users/quiz', { quiz, currentQuestion: nextQuestion,result , user, layout: quizLayout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/quizzes/:id/finish', authMiddleware, async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);
    // Find the result document
    const result = await Result.findOne({ userId, quizId });
    if (!result) return res.status(404).json({ message: 'No progress found for this quiz.' });

    const quiz = await Quiz.findById(quizId);

    // Calculate scores
    const totalScores = new Map();
    result.answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      const selectedOption = question.options.find(opt => opt.text === answer.selectedOption);
      if (selectedOption) {
        for (const [key, value] of selectedOption.scores.entries()) {
          totalScores.set(key, (totalScores.get(key) || 0) + value);
        }
      }
    });

    // Determine the top result
    let topResult = { name: null, score: 0 };
    for (const [key, score] of totalScores.entries()) {
      if (score > topResult.score) {
        topResult = { name: key, score };
      }
    }

    const resultDetails = quiz.possibleResults.find(r => r.name === topResult.name);
    result.result = resultDetails;
    await result.save();

    res.render('users/results', {quiz, user, result: resultDetails, scores: Object.fromEntries(totalScores), quizId , layout: quizLayout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:id/retake', authMiddleware,async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.userId; // Assuming you're using authentication and `req.user` contains the logged-in user.
    const idQuiz = quizId;
    // Delete the previous quiz result for the user and quiz
    console.log(userId, quizId);
    const isDeleted = await Result.deleteOne({ userId, quizId });
    console.log(isDeleted);
    // Redirect to the quiz start page
    res.redirect(`/quizzes/${idQuiz}/start`);
  } catch (error) {
    console.error('Error retaking quiz:', error);
    res.status(500).send('Something went wrong while trying to retake the quiz.');
  }
});
router.get('/quiz/:id', authMiddleware, async (req, res) => { 
  const quizzes = await Quiz.find();
  const quiz = await Quiz.findById(req.params.id);
  const user = await User.findById(req.userId);
  const quizes = await Quiz.find();

  res.render('users/quiz_start', { user,quiz ,quizes, quizzes, layout: usersLayout });
});


/**
 * GET | 
 * edit page
 */
router.get('/edit', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.render("users/edit", {error: null, layout: usersLayout, user, success: false});
});
/**
 * POST |
 * edit user
 */
router.post('/edit', authMiddleware, async (req, res) => {
  
  try {
    const user = await User.findById(req.userId);
    const {username, newpassword,newpassword_again, email, first_name, last_name, location, twitter} = req.body;
    const error = {};
    if (newpassword || newpassword_again) {
      if (newpassword !== newpassword_again) {
        error.password = "Passwords do not match";
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;
   }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
          error.email = "Invalid email";
    } else if (!email) {
      error.email = "Please enter an email";
    }
    if (Object.keys(error).length > 0) {
      return res.render("users/edit", { error, layout: usersLayout, user, success: false });
    }
    user.username = username;
    user.twitter = twitter;
    user.location = location;
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    await user.save();
    res.render("users/edit", {error, layout: usersLayout, user, success: true});
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Internal server error"}); 
  }
});
/** 
 * POST /logout
*/
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/');
});

module.exports = router;