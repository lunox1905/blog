const Users = require('../app/module/Users')
const jwt = require('jsonwebtoken')
const defaultImg = "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8="

const check = (req, res, next) => {
    try {
       
        const token = req.cookies.blog_token
        if(token) {
            var idUser = jwt.verify(token, 'mk')
        
            Users.findOne({ _id: idUser})
            .then(user => {
                req.data = {avatar: user.avatar, _id: user._id, name: user.name, role: user.role}
                next()
            })
            .catch(() => {
                req.data = {name: '', role: 'user', avatar: defaultImg}
                next()
            })
        } else {
            req.data = {name: '', role: 'user', avatar: defaultImg}
            next()
        }
        
        
    } catch(err) {
        console.log(err)
    }
}

module.exports = check