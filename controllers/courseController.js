const Course = require('../models/Course');
const Student = require('../models/Student');

const isStaff = (role) => role === 'staff';

exports.addCourse = async (req, res) => {
  try {
    // Ensure the user is staff
    if (!isStaff(req.user.role)) {
      return res.status(403).json({ message: 'Only staff can add courses' });
    }

    // Extract and validate body fields
    const { name, lecturer, creditPoints, maxCapacity } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Course name is required' });
    }
    if (!lecturer) {
      return res.status(400).json({ message: 'Lecturer is required' });
    }
    if (!creditPoints) {
      return res.status(400).json({ message: 'Credit points are required' });
    }
    if (creditPoints < 3 || creditPoints > 5) {
      return res.status(400).json({ message: 'Credit points must be between 3 and 5' });
    }
    if (!maxCapacity) {
      return res.status(400).json({ message: 'Maximum capacity is required' });
    }
    if (maxCapacity <= 0) {
      return res.status(400).json({ message: 'Maximum capacity must be a positive number' });
    }

    // Check for existing course with the same name
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(400).json({ message: 'A course with the same name already exists' });
    }

    // Create and save the new course
    const newCourse = new Course({
      name,
      lecturer,
      creditPoints,
      maxCapacity,
      enrolledStudents: [],
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding course' });
  }
};


exports.getCourses = async (req, res) => {
  try {

    const courses = await Course.find().populate('enrolledStudents', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

exports.updateCourse = async (req, res) => {
  try {

    if (!isStaff(req.user.role)) {
      return res.status(403).json({ message: 'Only staff can update courses' });
    }

    const { courseId } = req.params;
    const updates = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {

    if (!isStaff(req.user.role)) {
      return res.status(403).json({ message: 'Only staff can delete courses' });
    }

    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { email } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (course.enrolledStudents.length >= course.maxCapacity) {
      return res.status(400).json({ message: 'Course is already at maximum capacity' });
    }

    if (student.totalCredits + course.creditPoints > 20) {
      return res.status(400).json({
        message: 'Enrolling in this course would exceed the maximum allowed credits (20)',
      });
    }

    course.enrolledStudents.push(student._id);
    student.registeredCourses.push(course._id);
    student.totalCredits += course.creditPoints;

    await course.save();
    await student.save();

    res.status(200).json({ message: 'Student enrolled successfully', course, student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while enrolling student' });
  }
};

exports.dropStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { email } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (id) => id.toString() !== student._id.toString()
    );
    student.registeredCourses = student.registeredCourses.filter(
      (id) => id.toString() !== course._id.toString()
    );
    student.totalCredits -= course.creditPoints;

    await course.save();
    await student.save();

    res.status(200).json({ message: 'Student dropped from course', course, student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while dropping student' });
  }
};
