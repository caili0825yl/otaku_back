const mongoose = require('../mongodb')

var schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  body: {
    type: String,
    required: true,
    minlength: 1
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  resource:{
    type: Boolean
  },
  resUrl:{
    type:String
  },
  code:{
    type:String
  }
})

const Article = mongoose.model('Article', schema)

exports.Article = Article
