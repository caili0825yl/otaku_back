const { User } = require('../model/user')

module.exports = async function(req, res, next) {
  const id = req.cookies.OTAKUId
  if (!id) return res.status(400).send('拒绝访问！')

  let user = await User.findOne({
    _id: id
  })
  if (user) {
    next()
  } else {
    res.status(400).send('id非法！')
  }
}
