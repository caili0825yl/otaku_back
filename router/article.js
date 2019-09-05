const express = require('express')
const router = express.Router()
const { Article } = require('../model/article')
const { Comment } = require('../model/comment')
const { Info } = require('../model/info')

const auth = require('../middleware/auth')
const _ = require('lodash')
const moment = require('moment')

//获取留言
router.get('/comment', async (req, res) => {
  const size = 10
  const comments = await Comment.find({
    articleId: req.query.id
  })
    .sort({ index: -1 })
    .skip((req.query.page - 1) * size)
    .limit(size)

  const total = await Comment.countDocuments({ articleId: req.query.id })
  res.send({ comments, total, size })
})

//创建文章
router.post('/', async (req, res) => {
  req.body.time = moment().format('YYYY.MM.DD')
  await Article.create(req.body)
  res.status(200).send()
})

//文章列表
router.get('/', async (req, res) => {
  const size = 10
  if (req.query.type === 'all') {
    let count = await Article.countDocuments()

    let articles = await Article.find()
      .skip((req.query.page - 1) * size)
      .limit(size)
      .sort({ _id: -1 })

    res.send({ articles, count, size })
  } else {
    let count = await Article.countDocuments({
      type: req.query.type
    })

    let articles = await Article.find({
      type: req.query.type
    })
      .skip((req.query.page - 1) * size)
      .limit(size)
      .sort({ _id: -1 })

    res.send({ articles, count, size })
  }
})

//删除文章
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.status(200).send()
})

//文章详情
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.send(article)
})

//修改文章
router.put('/:id', async (req, res) => {
  await Article.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).send()
})

//搜索文章
router.get('/search/result', async (req, res) => {
  const size = 10

  let articles = await Article.find({ title: { $regex: eval(`/${req.query.search}/i`) } })
    .skip((req.query.page - 1) * size)
    .limit(size)
    .sort({ _id: -1 })

  let count = await Article.countDocuments({
    title: { $regex: eval(`/${req.query.search}/i`) }
  })

  res.send({ articles, count, size })
})

//发表留言
router.post('/comment/:id', async (req, res) => {
  req.body.time = moment().format('YYYY/MM/DD HH:mm')
  const info = await Info.findOne({
    id: req.body.id
  })

  req.body.index = (await Comment.countDocuments({ articleId: req.params.id })) + 1

  req.body.avatar = info.avatar
  req.body.username = info.username
  req.body.articleId = req.params.id
  let comment = await Comment.create(req.body)
  res.send(comment)
})

module.exports = router
