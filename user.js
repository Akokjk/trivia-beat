const mongodb = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    expire: {
      type: Date
    }, 
    phone:{
      type: String,
      unique: true
    },
    password: String,
    diamonds: Number,
    hearts: Number,
    bitcoin: Number
  }
)


userSchema.path("email").validate(async (email) => {
  const count = await mongoose.models.User.countDocuments({email})
  return !count;
}, 'Email already exists')

userSchema.path("phone").validate(async (phone) => {
  const count = await mongoose.models.User.countDocuments({phone})
  return !count;
}, 'Phone already exists')

userSchema.path("name").validate(async (name) => {
  const count = await mongoose.models.User.countDocuments({name})
  return !count;
}, 'Username already exists')



const User = mongoose.model("User", userSchema);

module.exports = User;
