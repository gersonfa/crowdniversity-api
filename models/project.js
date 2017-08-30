const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recompenseSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  numberAvailable: { type: Number, min: 1 }
})

const updatesSchema = new Schema({
  title: String,
  description: String
},
{
  timestamps: true
})

const commentsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  commentText: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  })

const projectSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId },
  guideId: { type: Schema.Types.ObjectId },
  projectName: { type: String, required: true },
  published: {type: Boolean, default: false},
  principalInformation: {
    moneyReach: { type: Number, min: 10000 },
    sloganProject: { type: String },
    imageCard: { type: String, default: 'http://semantic-ui.com/images/wireframe/image.png' },
    country: { type: String },
    city: { type: String },
    university: { type: String },
    category: { type: String },
    projectStage: {
      type: String,
      enum: ['Concepto', 'Prototipo', 'Producción'],
      default: 'Concepto'
    },
    daysCollection: { type: Number, min: 20, max: 50 }
  },
  resume: {
    videoUrl: { type: String },
    posterVideo: { type: String },
    mainImage: { type: String },
    mainDescription: { type: String },
    resume: { type: String } // Summernote
  },
  recompenses: [recompenseSchema],
  updates: [updatesSchema],
  comments: [commentsSchema]
})

module.exports = mongoose.model('Project', projectSchema)
