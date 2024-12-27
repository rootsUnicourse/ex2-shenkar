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
    const { role, name, address, email, academicYear, password } = req.body;

    // Validate common fields
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check if a user with the same email already exists
    let existingUser = await Staff.findOne({ email });
    if (!existingUser) {
      existingUser = await Student.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Handle staff signup
    if (role === 'staff') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStaff = new Staff({
        name,
        address,
        email,
        role, // Automatically set to 'staff'
        password: hashedPassword,
      });

      await newStaff.save();
      return res.status(201).json({ message: 'Staff registered successfully' });
    }

    // Handle student signup
    if (role === 'student') {
      if (!academicYear) {
        return res.status(400).json({ message: 'Academic year is required for students' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new Student({
        name,
        address,
        email,
        academicYear,
        role, // Automatically set to 'student'
        password: hashedPassword,
      });

      await newStudent.save();
      return res.status(201).json({ message: 'Student registered successfully' });
    }

    // Invalid role
    return res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user in both collections (Staff and Student)
    let user = await Staff.findOne({ email });

    if (!user) {
      user = await Student.findOne({ email });
    }

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token based on the user's role
    const token = generateToken(user);
    res.json({ token, message: `Login successful for ${user.role}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

