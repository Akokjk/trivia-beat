const mongodb = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ipSchema = new Schema(
  {
    ip:{
      type: [String],
      }
    }
)




const Ip = mongoose.model("ip", ipSchema);

module.exports = Ip;
