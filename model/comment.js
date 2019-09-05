const mongoose = require('../mongodb')

var schema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true
    },
  username: {
    type: String,
    required: true,
    
  },
  time: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  articleId:{
    type: String,
    required: true
  },
  index:{
    type:Number,
    required:true
  }
})

const Comment = mongoose.model('Comment', schema)

exports.Comment = Comment
