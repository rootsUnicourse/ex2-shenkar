const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  academicYear: { type: Number, required: true },
  registeredCourses: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course',
    },
  ],
  totalCredits: { type: Number, default: 0 },
});

module.exports = mongoose.model('Student', studentSchema);
