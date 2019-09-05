const mongoose = require('../mongodb')

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    tel: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 1024
    }
  })
)




exports.User = User
