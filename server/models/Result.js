const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  currentQuestionIndex: { type: Number, default: 0 }, // Tracks the user's current question
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId, // Reference to the question
      selectedOption: String,                    // The option the user selected
    },
  ],
  scores: { type: Map, of: Number },              // Accumulated scores
  result: {                                       // Final personality result
    name: { type: String },
    image: { type: String },
    description: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;