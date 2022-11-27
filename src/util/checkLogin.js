const Users = require('../app/module/Users')
const jwt = require('jsonwebtoken')

const checkLogin = (req, res, next) => {
    try {
        const token = req.cookies.blog_token
        var idUser = jwt.verify(token, 'mk')
        Users.findOne({ _id: idUser})
        .then(user => {
            req.data = {avatar: user.avatar, _id: user._id, name: user.name, role: user.role}
            next()
        })
        .catch(err => {
            res.render('/login')
        })
    } catch(err) {
        res.redirect('/login')
    }
}

module.exports = checkLogin