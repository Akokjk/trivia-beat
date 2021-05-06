const mongodb = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const questionSchema = new Schema({
  title: {             //holds the question title
    type: String,
    unique: true
  },
  options: {          //holds the four options for an answer
    type: [String],
  },
  answer: {           //refers to the array element in options
    type: Number,
  },
  author: {           //used to determine bans for bad questions
    type: String,
  },
  category:{          //catergories can be used later to build specific kinds of trivia exams
    type: [String]
  },
  difficulty: {       //this determines the amount time to show the question on the screen
    type: Number
  },
  verified: {        //so its not picked when getting lists of questions for users to verify
    type: Boolean
  },
  sources: {         //open when users clicks on title of the question to be verified all questions must have a source
    type: [String]
  },
  reports: {         //number of times the question has been reported by users
    type: Number
  },
  report_types: {   //makes it so questions can be checked by type of report
    type: [String]
  },
  correct_responders: {  //so when the game is generated it does not pick questions already answered by the users
    type: [String]
  },
  wrong_responses: { //this can be used to adjust difficulty accordingly for later users
    type: Number
  },
  verifiers: {
    type: [String]   //when users verify questions that are then reported they will be eventually banned
  },
  date: {
    type: Date
  },
  nverifiers: {
    type: Number
  }
})


questionSchema.path("title").validate(async (title) => {
  const count = await mongoose.models.Question.countDocuments({title})
  return !count;
}, 'Question already exists')



const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
