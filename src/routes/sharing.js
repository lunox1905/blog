var express = require('express');
var router = express.Router();
const checkLogin = require('../util/checkLogin')
const check = require('../util/check')
const sharingController = require('../app/controllers/SharingController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100)
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })
const checkRole = (req, res, next) => {
  if(req.data.role == 'admin' || req.data.role == 'browse') {
    next()
  }
  else {
    res.redirect('back')
  }
}

router.get('/', check ,sharingController.index)
router.get('/post/:slug', check, sharingController.showpost)
router.get('/create', checkLogin, sharingController.create)
router.post('/create', checkLogin, upload.single('image'), sharingController.createPost)
router.get('/manager', checkLogin, sharingController.manager)
router.get('/browse', checkLogin, checkRole, sharingController.browse)
router.get('/editpost/:id', checkLogin, sharingController.editPost)
router.post('/updatepost/:id', checkLogin, upload.single('image'), sharingController.updatePost)
router.get('/shownewpost/:id', checkLogin, sharingController.showNewPost)
router.delete('/deletepost/:id', checkLogin, sharingController.deletePost)
router.get('/browsepost/:id', checkLogin, sharingController.browsePost)
router.get('/search', check, sharingController.search)
router.post('/insertcomment/:slug', checkLogin, sharingController.insertComment)
router.post('/updaterating/:slug', sharingController.updateRating)
router.get('/deleteall/:id', sharingController.deleteAll)
router.post('/checkslug', sharingController.checkSlug)
module.exports = router;