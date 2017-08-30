const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const job = new Schema({
  jobPosition: { type: String },
  description: { type: String },
  dateStart: { type: String },
  dateFinish: { type: String }
})

const grade = new Schema({
  title: { type: String},
  institutionName: { type: String}
})

const guideSchema = new Schema ({
  userId: { type: Schema.Types.ObjectId },
  description: { type: String},
  jobPosition: { type: String},
  professionalExperience: [job],
  education: [grade],
  proyectsId: [ Schema.Types.ObjectId ]
})

module.exports = mongoose.model('Guide', guideSchema)
