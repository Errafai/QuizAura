const mongoose = require('mongoose');

//difine the question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true }, 
  options: [
    {
      text: { type: String, required: true },
      scores: { type: Map, of: Number },      
    },
  ],
});

// Define the quiz schema
const quizSchema = new mongoose.Schema({
  image: { type: String },                
  title: { type: String, required: true },
  headline: { type: String }, 
  description: { type: String },         
  questions: [questionSchema],            
  possibleResults: [
    {
      name: { type: String, required: true }, 
      image: { type: String, required: true },
      description: { type: String },          
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;