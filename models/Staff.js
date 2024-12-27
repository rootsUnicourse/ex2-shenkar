const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  address: { type: String, required: true }, 
  role: { type: String, default: 'staff' }, 
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Staff', staffSchema);
