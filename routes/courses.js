const express = require('express');
const {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  enrollStudent,
  dropStudent,
} = require('../controllers/courseController');
const verifyToken = require('../utils/verifyToken');

const router = express.Router();

router.post('/', verifyToken, addCourse);
router.get('/', verifyToken, getCourses); 
router.put('/:courseId', verifyToken, updateCourse); 
router.delete('/:courseId', verifyToken, deleteCourse); 
router.post('/:courseId/enroll', verifyToken, enrollStudent); 
router.post('/:courseId/drop', verifyToken, dropStudent); 

module.exports = router;
