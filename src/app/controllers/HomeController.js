const Users = require('../module/Users')
const jwt = require('jsonwebtoken')

class HomeController {
    //GET 
    register (req, res, next) {
        res.render('auth/register', {
            
        })
    }

    login (req, res, next) {
        res.render('auth/login', {
        
        })
    }

    create (req, res, next) {
        
    }

    async handleRegister (req, res, next) {
        try{
            
            const {email, username, password} = req.body
            const user = await Users.findOne({ email })
          
            if(user){
                return res.json({mess: 'err'})  
            } else {
                const user = new Users({email: email, name: username, password: password})
                user.save()
                return res.json({mess: email})
            }
            
        } catch(err){
            return res.status(500).json('invalid server')
        }
    }

    async handleLogin (req, res, next) {
        try{
            
            const {email, password} = req.body
            const user = await Users.findOne({ email, password })

            if(!user){
                return res.json({mess: 'err'})  
            } else {
             
                const token = jwt.sign({
                    _id: user._id, user: user.user, role: user.role, img: user.image
                }, 'mk')
                
                res.cookie('blog_token', token)
          
                return res.json({mess: "success", blog_token: token})
            }
            
        } catch(err){
            return res.status(500).json('invalid server')
        }
    }

    handleChangePass(req, res, next) {
        Users.updateOne({_id: req.data._id, password: req.body.password}, {password: req.body.newpassword})
            .then(() => 
                res.json({mess: "success"})
            )
            .catch(next => {
                res.json({mess: "err"})
            }) 
    } 

    changePass (req, res, next) {
        res.render('auth/changePass', {
            role: req.data.role,
            image: req.data.avatar || defaultImg
        })
    }

    logout (req, res, next) {
        res.clearCookie('blog_token')
        res.redirect('/login')
    }
}

module.exports = new HomeController();