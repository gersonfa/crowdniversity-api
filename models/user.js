var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String },
  },
  facebookId: { 
    type: String,
    unique: true
  },
  guideId: { type: Schema.Types.ObjectId },
  role: {
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
},
  {
    timestamps: true
  })

//  User methods

//  Pre-save of user to db, hash password if password is modified or new
userSchema.pre('save', function (next) {
  const user = this
  const SALT_FACTOR = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)
        user.password = hash
        next()
      })
  })
})

//  Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return cb(err) }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', userSchema)
