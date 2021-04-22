const mongodb = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ipSchema = new Schema(
  {
    ip:{
      type: [String],
      unique: true
      }
    }
)


ipSchema.path("ip").validate(async (ip) => {
  const count = await mongoose.models.Ip.countDocuments({ip})
  return !count;
}, 'IP already linked to another user')




const Ip = mongoose.model("ip", ipSchema);

module.exports = Ip;
