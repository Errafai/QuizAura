const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// GET /api/quizzes
// Get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/quizzes/:id
// Get a quiz by ID
router.get('/quizzes/:id', getQuiz, (req, res) => {
  res.json(res.quiz);
});

// POST /api/quizzes
// Create a new quiz
router.post('/quizzes', async (req, res) => {
  const quiz = new Quiz({
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    questions: req.body.questions,
    possibleResults: req.body.possibleResults,
  });

  try {
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/quizzes/:id
// Update a quiz by ID
router.put('/quizzes/:id', getQuiz, async (req, res) => {
  res.quiz.image = req.body.image;
  res.quiz.title = req.body.title;
  res.quiz.description = req.body.description;
  res.quiz.questions = req.body.questions;
  res.quiz.possibleResults = req.body.possibleResults;

  try {
    const updatedQuiz = await res.quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/quizzes/:id
// Delete a quiz by ID
router.delete('/quizzes/:id', getQuiz, async (req, res) => {
  try {
    await res.quiz.remove();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a quiz by ID
async function getQuiz(req, res, next) {
  let quiz;
  try {
    quiz = await Quiz.findById(req.params.id);
    if (quiz == null) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.quiz = quiz;
  next();
}

module.exports = router;