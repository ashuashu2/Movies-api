const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePictureUrl: String,
    username: { type: String,
         required:
          true, 
          unique: true },
    nickname: String,
    phoneNo: {
      type: Number,
      unique: true,
    },
  },
  
  {

    timestamps: true,
  },
)

const User = mongoose.model('User', userSchema)

module.exports = User