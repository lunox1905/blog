const Posts = require('../module/Posts')
const Users = require('../module/Users')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const limit = 10
const size = 5
const defaultImg = "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8="
class SharingController {
    //GET 
    index (req, res, next) {
        
        
        var skip = (parseInt(req.query.page)-1) * limit
        Promise.all([Posts.find({isBrowse: true}).populate('author').sort({createdAt: -1}).skip(skip).limit(limit),
            Posts.countDocuments({isBrowse: true}), Posts.find({isBrowse: true}).populate('author').sort({view: -1}).limit(3)])
            .then(([posts, countFlim, trend]) => {
                var totalPage = Math.floor(countFlim/limit) + 1
              
                res.render('sharing/sharingall', {
                    image: req.data.avatar,
                    username: req.data.name,
                    role: req.data.role,
                    posts: mutipleMongooseToObject(posts),
                    size: size,
                    current: req.query.page || 1,
                    total: totalPage,
                    trend: mutipleMongooseToObject(trend)
                })
            })
            .catch(next)
    }

    async showpost (req, res, next) {
        try{
            
            const posts =  await Posts.findOne({slug: req.params.slug}).populate('comment.idUser').populate('author').exec()     
            const postsByAuthor = await Posts.find({author: posts.author._id, slug: { $ne: req.params.slug }}).limit(5)
            
            Posts.updateOne({slug: req.params.slug}, {view: posts.view + 1})
            .then()
           
            res.render('sharing/sharingone', {
                image: req.data.avatar,
                username: req.data.name,
                role: req.data.role,
                posts: mongooseToObject(posts),
                postsByAuthor: mutipleMongooseToObject(postsByAuthor)
            })
              
        
        } catch(err){
            return res.status(500).json("invalid in server")
        }
    }


    insertComment (req, res, next) {
        Posts.updateOne({slug: req.params.slug}, {
            $push: {
                comment: {
                    idUser: req.data._id,
                    content: req.body.content
                }
            }
        })
        .then(() => {
            res.json({mess: "success", avatar: req.data.avatar, name: req.data.name, content: req.body.content})
        })
    }

    create (req, res, next) {
        res.render('sharing/create', {
            image: req.data.avatar,
            username: req.data.name,
            role: req.data.role,
        })
    }

    createPost (req, res, next) {
        const img = req.file
        if(img) {
            req.body.image = '/' + img.path.split('\\').slice(1).slice(1).join('/')
        }
        const post = new Posts({
            title: req.body.title,
            slug: req.body.slug,
            image: req.body.image,
            author: req.data._id,
            tags: req.body.tag.split(','),
            content: req.body.content,
            summary: req.body.summary,
        })
        post.save()
        res.redirect('/sharing/manager')
    }

    create2 (req, res, next) {
        for(var i = 1; i < 210; i++) {
            const doc = new Posts({ title: `Posts ${i}`,
                image: 'https://i.pinimg.com/originals/62/28/d1/6228d1af2f48df623c647c682a43ec4b.jpg',
                slug: `post-${i}`,
                tags: ['t1', 't2'],
                summary: 'bài viết này ...',
                author: '6276832a523de4abf857d4d7',
                title: `Bài post ${i}`,
                comment: [
                    {
                        idUser: '6276832a523de4abf857d4d6',
                        content: 'Comment ...',
                    },
                ],
                isBrowse: true,
                content: 'sdsffsfsfscsdad ada asad a dài quá k muốn viết'});
            doc.save();
            
        }
        res.render('sharing/manager', {
            
        })
    }

    manager (req, res, next) {
        Promise.all([Posts.find({author: req.data._id}), Posts.countDocuments({author: req.data._id})])
            .then(([posts, countFlim]) => {
                var totalPage = Math.floor(countFlim/limit) + 1
                res.render('sharing/manager', {
                    posts: mutipleMongooseToObject(posts),
                    role: req.data.role,
                    image: req.data.avatar || defaultImg,
                    size: size,
                    current: req.query.page || 1,
                    total: totalPage,
                    author: req.data._id
                })
            })
    }

    browse (req, res, next) {
        Posts.find({isBrowse: false})
            .then(posts => {
                res.render('sharing/browse', {
                    posts: mutipleMongooseToObject(posts),
                    username: req.data.name,
                    role: req.data.role,
                    image: req.data.avatar,
                })
            })
    }

    editPost (req, res, next) {
        Posts.findOne({_id: req.params.id}).populate('author')
            .then(post => {
                
                res.render('sharing/editPost', {
                    post: mongooseToObject(post),
                    username: req.data.name,
                    role: req.data.role,
                    image: req.data.avatar,
                })
            })
    }

    updatePost (req, res, next) {
        const img = req.file
        if(img) {
            req.body.image = '/' + img.path.split('\\').slice(1).slice(1).join('/')
        }
        req.body.isBrowse = false
        req.body.tags = req.body.tag.split(',')
        if(req.data.role == 'user') var url = '/sharing/manager'
        else url = '/sharing/browse'
        Posts.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect(url))
    }

    showNewPost (req, res, next) {
        Posts.findOne({_id: req.params.id}).populate('author')
            .then((post) => {
                res.render('sharing/showNewPost', {
                    post: mongooseToObject(post),
                    username: req.data.name,
                    role: req.data.role,
                    image: req.data.avatar,
                })
            })
    }

    deletePost (req, res, next) {
        Posts.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect(`/sharing/browse`)
            })
            .catch(next)
    }

    browsePost (req, res, next) {
        Posts.updateOne({_id: req.params.id}, {isBrowse: true})
            .then(() => res.redirect(`/sharing/browse`))
    }

    search(req, res, next) {
        Promise.all([Posts.find({isBrowse: true, $or: [{title: {$regex : new RegExp(req.query.name, 'i')}}, { tags: {$regex : new RegExp(req.query.name, 'i')}}]}).populate('author').sort({createdAt: -1}).limit(10)])
            .then(([posts]) => {
                var totalPage = Math.floor(posts.length/limit) + 1
                res.render('sharing/search', {
                    image: req.data.avatar,
                    username: req.data.name,
                    role: req.data.role,
                    posts: mutipleMongooseToObject(posts),
                    size: size,
                    current: req.query.page || 1,
                    total: totalPage
                })
            })
            .catch(next)
    }

    updateRating (req, res, next) {
        Posts.updateOne({slug: req.params.slug}, {rating: req.body.rating})
            .then()
    }

    deleteAll (req, res, next) {
        Posts.deleteMany({ author: req.params.id })
            .then(() => {
                res.redirect(`/sharing/browse`)
            })
            .catch(next)
    }

    checkSlug (req, res, next) {
        Posts.findOne({slug: req.body.slug})
            .then(post => {
                if(post){
                    res.json({mess: 'Success'})
                }
                else res.json({mess: 'Err'})
            }) 
    }

}

module.exports = new SharingController();