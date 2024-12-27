const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // Unique student identifier
  name: { type: String, required: true }, // Student name
  address: { type: String, required: true }, // Student address
  academicYear: { type: Number, required: true }, // Academic year
  registeredCourses: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Course model
      ref: 'Course',
    },
  ],
  totalCredits: { type: Number, default: 0 }, // Total registered credits (limit: 20)
});

module.exports = mongoose.model('Student', studentSchema);
