const mongoose = require('mongoose');

// Define the question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true }, // The text of the question
  options: [
    {
      text: { type: String, required: true }, // Text of the option
      scores: { type: Map, of: Number },      // Dynamic scoring for personality traits
    },
  ],
});

// Define the quiz schema
const quizSchema = new mongoose.Schema({
  image: { type: String },                // URL to the quiz image
  title: { type: String, required: true }, // Title of the quiz
  description: { type: String },          // Short description
  questions: [questionSchema],            // Array of questions
  possibleResults: [
    {
      name: { type: String, required: true }, // Personality type (e.g., "Dog Lover")
      image: { type: String, required: true }, // URL to result image
      description: { type: String },          // Description of the result
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;