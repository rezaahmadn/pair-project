const { User, Profile, Post } = require('../models')
const bcrypt = require('bcryptjs')
const formatDate = require('../helpers/formatDate')
const { Op } = require('sequelize')

class Controller{
  static registerGet(req, res){
    const { errors } = req.query
    res.render('register', {errors})
  }

  static registerPost(req, res){
    const { email, password, role, firstName, lastName, age } = req.body
    const newUser = { email, password, role }
    
    User.create(newUser)
      .then(result => {
        return User.findOne({
          where:{
            email
          }
        })
      })
      .then(user => {
        const id = user.id
        const newProfile = { firstName, lastName, age, UserId:id}
        return Profile.create(newProfile)
      })
      .then(result => {
        res.redirect('/login')
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError"){
          const errors = err.errors.map(e => e.message)
          return res.redirect(`/register/?errors=${errors}`)  
        }
        return res.send(err)
      })
  }

  static loginGet(req, res){
    const {errors} = req.query
    res.render('login', {errors})
  }

  static loginPost(req, res){
    const { email, password } = req.body
    User.findOne({where:{email}})
      .then(user => {
        if(user){
          const isValidPassword = bcrypt.compareSync(password, user.password)
          if (isValidPassword){

            req.session.UserId = user.id
            req.session.UserRole = user.role

            return res.redirect('/')
          } else {
            const err = 'Invalid email/password'
            return res.redirect(`/login/?errors=${err}`)
          }
        } else {
          const err = 'Invalid email/password'
          return res.redirect(`/login/?errors=${err}`)
        }
      })
      .catch(err => res.render(err))
  }

  static logout(req, res){
    req.session.destroy((err)=>{
      if (err){
        res.send(err)
      } else {
        res.redirect('/login')
      }
    })
  }

  static home(req, res){
    const { UserId, UserRole } = req.session
    const info = {UserId, UserRole }
    Post.findAll({
      include:{
        model:User,
        include:Profile
      },
      order:[["createdAt", "DESC"]]
    })
      .then(posts => {
        res.render('home', { posts, formatDate, info })
      })
      .catch(err => res.send(err))
  }

  static post(req, res){
    const { content } = req.body
    const { UserId } = req.session
    const newPost = { content, UserId}
    Post.create(newPost)
      .then(result => {
        res.redirect('/')
      })
      .catch(err => res.send(err))
  }

  static upvote(req, res){
    const { PostId } = req.params
    const id = +PostId
    Post.increment('votes', {
      where:{
        id
      }
    })
      .then(result => {
        res.redirect('/')
      })
      .catch(err => res.send(err))
  }

  static downvote(req, res){
    const { PostId } = req.params
    const id = +PostId
    Post.decrement('votes', {
      where:{
        id
      }
    })
      .then(result => {
        res.redirect('/')
      })
      .catch(err => res.send(err))
  }

  static delete(req, res){
    const { PostId } = req.params
    const id = +PostId
    Post.destroy({
      where:{
        id
      }
    })
      .then(result => {
        res.redirect('/')
      })
      .catch(err => res.send(err))
  }
  
  static profile(req, res){
    const { UserId:id, UserRole } = req.session
    const info = { UserId:id, UserRole }
    const { UserId } = req.params
    Profile.findOne({
      include:{
        model:User,
        include:Post
      },
      where:{
        UserId
      }
    })
      .then(profile => {
        res.render('profile', { profile, formatDate, info})
      })
      .catch(err => res.send(err))
  }

  //ini buat search
  static search(req, res){
    const { UserId, UserRole } = req.session
    const info = {UserId, UserRole }
    const { name } = req.query
    const options = {where:{[Op.or]: [{firstName:{[Op.iLike]:`%${name}%`}},{lastName:{[Op.iLike]:`%${name}%`}}]}}
    Profile.search(options)
    .then(users => {
      res.render('users', {users, info})
    })
    .catch(err => res.send(err))
  }

  static editGet(req, res){
    const { UserId:id, UserRole } = req.session
    const info = { UserId:id, UserRole }
    const { errors } = req.query
    const { UserId } = req.params
    Profile.findOne({
        where:{
        UserId
      }
    })
      .then(profile =>{
        res.render('edit', {profile, errors, info})
      })
      .catch(err => res.send(err))
  }

  static editPost(req, res){
    const { UserId } = req.session
    const { firstName, lastName, age } = req.body
    const updatedProfile = { firstName, lastName, age:+age, UserId:+UserId }
    console.log(updatedProfile);
    Profile.update(updatedProfile, {
      where:{
        UserId
      },
    })
      .then(result => {
        res.redirect(`/profile/${UserId}`)
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError"){
          const errors = err.errors.map(e => e.message)
          return res.redirect(`/profile/${UserId}/edit/?errors=${errors}`)  
        }
        return res.send(err)
      })
  }
}

module.exports = Controller