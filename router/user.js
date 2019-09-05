const express = require('express')
const router = express.Router()
const { User } = require('../model/user')
const { Info } = require('../model/info')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const auth = require('../middleware/auth')

var captcha
var userId
var filename = null

//注册
router.post('/', async (req, res) => {
  if (req.body.captcha !== captcha) {
    return res.status(400).send('验证码错误')
  }

  let user = await User.findOne({
    $or: [{ tel: req.body.tel }, { email: req.body.email }]
  })
  if (user) return res.status(400).send('手机或邮箱已注册')

  user = new User(_.pick(req.body, ['tel', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  let info = new Info({
    username: mongoose.Types.ObjectId(user._id).toString(),
    avatar: 'http://localhost:3050/avatar/default.jpg',
    id: mongoose.Types.ObjectId(user._id).toString(),
    isChange: 0
  })
  await info.save()
  res.send(info.id)
})

//修改资料
router.post('/info', auth, async (req, res) => {
  let info = await Info.findOne({ id: req.body.id })
  info.username = req.body.username
  info.avatar = 'http://localhost:3050/avatar/' + req.body.id + '.jpg'
  await info.save()
  res.send(info)
})

//邮箱验证
router.get('/email', async (req, res) => {
  let user = await User.findOne({
    _id: req.query._id
  })

  if (user.email !== req.query.email) return res.status(400).send('邮箱错误！')

  res.status(200).send()
})

//获取登录信息
router.get('/info', auth, async (req, res) => {
  let info = await Info.findOne({ id: req.query.id })

  res.send(info)
})

//获取用户所有信息
router.get('/', auth, async (req, res) => {
  let user = await User.findOne({ _id: req.cookies.OTAKUId })

  let info = await Info.findOne({ id: req.cookies.OTAKUId })

  res.send({ info, user })
})
//修改登录信息
router.post('/user', auth, async (req, res) => {
  if (req.body.captcha !== captcha) {
    captcha = ''
    return res.status(400).send('验证码错误')
  }

  let user = await User.findOne({
    _id: req.body.id
  })

  if (req.body.newPassword) {
    let validPassword = await bcrypt.compare(req.body.newPassword, user.password)

    if (validPassword) {
      return res.status(400).send('新老密码不能一致')
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.newPassword, salt)

    await user.save()
  }

  if (req.body.newTel) {
    let validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
      return res.status(400).send('密码错误')
    }
    user.tel = req.body.newTel
    await user.save()
  }

  if (req.body.newEmail) {
    let validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
      return res.status(400).send('密码错误')
    }
    if (req.body.tel !== user.tel) {
      return res.status(400).send('手机号错误')
    }
    user.email = req.body.newEmail
    await user.save()
  }
  res.send()
})

//上传头像
router.post('/upload', async (req, res) => {
  userId = req.cookies.OTAKUId
  if (filename !== null) {
    fs.unlink('public/cache/' + filename, function(err) {
      if (err) {
        console.log(err)
      }
    })
  }
  const storage = multer.diskStorage({
    destination: 'public/cache',
    filename: function(req, file, cb) {
      cb(null, file.originalname)
      filename = file.originalname
    }
  })

  const upload = multer({ storage: storage }).single('file')
  upload(req, res, function(err) {
    req.file.path = 'http://localhost:3050/cache/' + filename
    res.send(req.file.path)
  })
})

//保存头像
router.post('/avatar', async (req, res) => {
  fs.rename('public/cache/' + filename, 'public/avatar/' + userId + '.jpg', function(err) {
    filename = null
    if (err) {
      console.log(err)
    }
  })
  res.send()
})

//获取头像
router.get('/avatar', async (req, res) => {
  let info = await Info.findOne({ id: req.query.id })

  res.send(info)
})

//获取验证码
router.get('/captcha', async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
      user: '465203412@qq.com',
      pass: 'qldnperwcqxgbhai'
    }
  })

  let mailOptions = {
    from: '"OTAKU资源站" <465203412@qq.com>', // sender address
    to: '', // list of receivers
    subject: '注册验证码', // Subject line
    text: ''
  }

  captcha = randomWord(4)
  mailOptions.to = req.query.email
  mailOptions.text = '您的验证码为：' + captcha

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)

      return res.status(400).send('邮箱发生错误')
    }
  })
  res.send()
})

//用户列表
router.get('/users', async (req, res) => {
  
  
  const size = 10
 
    let count = await Info.countDocuments()

    let users = await Info.find()
      .skip((req.query.page - 1) * size)
      .limit(size)
      .sort({ _id: -1 })

    res.send({ users, count, size })
  
})

function randomWord(range) {
  let str = ''
  arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]

  for (let i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

module.exports = router
