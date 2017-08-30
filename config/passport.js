const passport = require('passport')
const User = require('../models/user')
const config = require('./config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const jwt = require('jsonwebtoken')

//  Setting username field to email rather than username
const localOptions = {
  usernameField: 'email',
  passwordField: 'password'
}

//Setting up local login Strategy
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {

  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err) }
    if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }) }

    if (user.facebookId != null) {
      return done(null, user)
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }) }

      return done(null, user)
    })
  })
})

//  Setting JWT strategy options
const jwtOptions = {
  //  Telling Passport to check authorization headers for jwt
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  //  Telling passport where to find the secret
  secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  console.log('dfads')
  User.findById(payload._id, function (err, user) {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // In seconds
  })
}

function setUserInfo(user) {
  const userInfo = {
    _id: user._id,
    email: user.email,
    profile: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName
    },
    role: user.role
  }

  return userInfo
}

passport.use(jwtLogin)
passport.use(localLogin)
