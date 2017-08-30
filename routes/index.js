const express = require('express')
const passportService = require('../config/passport')
const passport = require('passport')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

//  Controladores
const ctrlProjects = require('../controllers/projects.js')
const ctrlUser = require('../controllers/user')
const ctrlAuthentication = require('../controllers/authentication')

//Middleware to require login/authentication
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

//Constants for role types
const REQUIRE_ADMIN = 'Admin'
const REQUIRE_CLIENT = 'Client'

module.exports = function(app){
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const userRoutes = express.Router()
  const projectRoutes = express.Router()

  apiRoutes.use('/auth', authRoutes)
  
  //  Local authentication
  authRoutes.post('/register', ctrlAuthentication.register)
  authRoutes.post('/login',requireLogin, ctrlAuthentication.login)
  authRoutes.post('/forgot-password', ctrlAuthentication.forgotPassword)
  authRoutes.post('/reset-password/:token', ctrlAuthentication.verifyToken)
  
  //  FB authentication
  authRoutes.post('/facebook', ctrlAuthentication.facebookLogin)

  apiRoutes.use('/project', projectRoutes)
  projectRoutes.get('/', ctrlProjects.getProjects)
  projectRoutes.get('/user',requireAuth, ctrlProjects.getProjectsByUser)
  projectRoutes.post('/',requireAuth, ctrlProjects.postProject)
  projectRoutes.put('/main/:projectid', requireAuth, ctrlProjects.mainInformation)
  projectRoutes.put('/resume/:projectid', requireAuth, ctrlProjects.resumeProject)
  projectRoutes.get('/:projectid', ctrlProjects.getProject)
  projectRoutes.delete('/:projectid', requireAuth, ctrlProjects.deleteProject)

  app.use('/api', apiRoutes)
}

//  User routes
//  router.get('/user/:userId', requireAuth, ctrlUser.viewProfile)
//  Test protected route
//  router.get('/user/protected', requireAuth, function(req, res){
//    res.send({ content : 'The protected test route is functional!'})
//  });