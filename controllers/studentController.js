const Student = require('../models/Student');
const Course = require('../models/Course');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

exports.getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const student = await Student.findOne({ email }).populate('registeredCourses', 'name lecturer creditPoints');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching the student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    const updatedStudent = await Student.findOneAndUpdate({ email }, updates, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating the student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { email } = req.params;

    const deletedStudent = await Student.findOneAndDelete({ email });
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Course.updateMany(
      { enrolledStudents: deletedStudent._id },
      { $pull: { enrolledStudents: deletedStudent._id } }
    );

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting the student' });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const { email } = req.params;

    const student = await Student.findOne({ email }).populate('registeredCourses', 'name lecturer creditPoints');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ courses: student.registeredCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching student courses' });
  }
};
