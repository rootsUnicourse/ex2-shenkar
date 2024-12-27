const express = require('express');
const {
  getAllStudents,
  getStudentByEmail,
  updateStudent,
  deleteStudent,
  getStudentCourses,
} = require('../controllers/studentController');
const verifyToken = require('../utils/validateToken');

const router = express.Router();

router.get('/', verifyToken, getAllStudents);
router.get('/:email', verifyToken, getStudentByEmail);
router.put('/:email', verifyToken, updateStudent); 
router.delete('/:email', verifyToken, deleteStudent); 
router.get('/:email/courses', verifyToken, getStudentCourses);

module.exports = router;
