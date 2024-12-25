const mongoose = require('mongoose');
const { subscribe } = require('../routes/main');
const { first } = require('lodash');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  termsAccepted: { type: Boolean, required: true },
  subscribed: { type: Boolean, required: false },
  first_name: { type: String, required: false }, 
  last_name: { type: String, required: false },
  twitter: { type: String, required: false },
  location: { type: String, required: false }, 
  
});

module.exports = mongoose.model("User", UserSchema);