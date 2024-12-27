const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Staff = require('../models/Staff');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_EXPIRY = '10m';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || 'student' },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

exports.signup = async (req, res) => {
  try {
    const { userType, name, address, email, academicYear, password } = req.body;

    if (userType === 'staff') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStaff = new Staff({
        name,
        address,
        email,
        role: 'staff',
        password: hashedPassword,
      });

      await newStaff.save();
      return res.status(201).json({ message: 'Staff registered successfully' });
    } else if (userType === 'student') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new Student({
        name,
        address,
        email,
        academicYear,
        password: hashedPassword,
      });

      await newStudent.save();
      return res.status(201).json({ message: 'Student registered successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { userType, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user;

    if (userType === 'staff') {
      user = await Staff.findOne({ email });
    } else if (userType === 'student') {
      user = await Student.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
