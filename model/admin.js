const mongoose = require('../mongodb')

const Admin = mongoose.model(
  'Admin',
  new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required:true
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 1024,
      required:true
    }
  })
)




exports.Admin = Admin
