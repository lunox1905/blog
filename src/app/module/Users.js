const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users = new Schema({
    name: {type: String, maxLength: 100},
    avatar: {type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT42STwjfKg1x3AmsXTwpXHV6DmN-ZfGoJp1A&usqp=CAU'},
    address: {type: String},
    email: {type: String},
    facebook: {type: String},
    password: {type: String},
    role: {type: String, default: "user"},
    birthday: {type: String},
}, {
    timestamps: true,
});
  
  
module.exports = mongoose.model('users' , users)
