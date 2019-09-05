const express = require('express')
const router = express.Router()
const { User } = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const code = 'otaku'

//登录
router.post('/', async (req, res) => {



  

  if (req.cookies.remember) {
    
    try {
      let result = jwt.verify(req.cookies.remember, code)
      let user = await User.findOne({
        _id: result._id
      })
      if (user) {
        res.cookie('OTAKUId', mongoose.Types.ObjectId(user._id).toString())
        return res.send()
      }else{
        return res.status(400).send('登录错误！')

      }
    } catch (error) {
      return res.status(400).send('令牌非法！')

    }
  }

  
  
  let user = await User.findOne({
    $or: [{ tel: req.body.tel }, { email: req.body.email }]
  })

  if (!user) return res.status(400).send('用户或密码错误!')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('用户或密码错误!')

  const token = jwt.sign({ _id: user._id }, code)
  
  if (req.body.rememberMe== true) {
    res.cookie('remember', token, { maxAge: 604800000 })
    res.cookie('OTAKUId', mongoose.Types.ObjectId(user._id).toString())
  } else {
    res.cookie('OTAKUId', mongoose.Types.ObjectId(user._id).toString())
  }
  res.send()
})

module.exports = router
