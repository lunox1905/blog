const mongoose = require('mongoose')
const Schema = mongoose.Schema

const posts = new Schema({
    title: {type: String, maxLength: 100},
    image: {type: String},
    slug: {type: String, unique: true},
    tags: [{type: String}],
    summary: {type: String},
    author: {type: mongoose.Types.ObjectId, ref: 'users'},
    comment: [
        {
            idUser: {type: mongoose.Types.ObjectId, ref: 'users'},
            content: String,
        },
    ],
    like: {type: Number, default: 0},
    rating: {type: Number, default: 0},
    view: {type: Number, default: 0},
    content: {type: String},
    isBrowse: {type: Boolean, default: false}
},{
    timestamps: true,
});
  
  
module.exports = mongoose.model('posts' , posts)
