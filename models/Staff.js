const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true }, // Unique staff identifier
  name: { type: String, required: true }, // Staff member name
  address: { type: String, required: true }, // Staff member address
  role: { type: String, default: 'staff' }, // Role (default: 'staff')
});

module.exports = mongoose.model('Staff', staffSchema);
