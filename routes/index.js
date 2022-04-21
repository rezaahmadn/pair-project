const express = require('express')
const Controller = require('../controllers')
const router = express.Router()

router.get('/',(req, res)=>{
  res.redirect('/login')
})

router.get('/register', Controller.registerGet)
router.post('/register', Controller.registerPost)

router.get('/login', Controller.loginGet)
router.post('/login', Controller.loginPost)

const isLogin = (req, res, next)=>{
  if (req.session.UserId){
    next()
  } else {
    const err = 'Please login'
    res.redirect(`/login/?errors=${err}`)
  }
}

const isModerator = (req, res, next)=>{
  if (req.session.UserRole === 'Moderator'){
    next()
  } else {
    const err = 'Please login as moderator'
    res.redirect(`/login/?errors=${err}`)
  }
}

router.use(isLogin)
router.get('/logout', Controller.logout)


router.get('/home', Controller.home)
router.post('/post',Controller.post)
router.get('/:PostId/upvote',Controller.upvote)
router.get('/:PostId/downvote',Controller.downvote)
router.get('/:PostId/delete', isModerator, Controller.delete)

router.get('/profile/:UserId', Controller.profile)
router.get('/search', Controller.search)

router.get('/profile/:UserId/edit', Controller.editGet)
router.post('/profile/:UserId/edit', Controller.editPost)

// router.get('/users')

module.exports = router