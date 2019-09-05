const mongoose = require('../mongodb')


const Info = mongoose.model(
  'Info',
  new mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    avatar:{
      type: String
    },
    id:{
      type:String
    },
    isChange:{
      type:Number
    }
  })
)

exports.Info = Info
