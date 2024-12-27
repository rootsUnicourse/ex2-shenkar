const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lecturer: { type: String, required: true },
  creditPoints: { type: Number, required: true, min: 3, max: 5 },
  maxCapacity: { type: Number, required: true },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model('Course', courseSchema);
